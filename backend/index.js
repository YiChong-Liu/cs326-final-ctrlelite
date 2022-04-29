import express from 'express';
import logger from 'morgan';
import backendRouter from './backend.js';
import ws from "websocket";

// Initialize express
const app = express();
const port = process.env.PORT || 3000;
app.use(logger('dev'));
app.use('/', express.static('./src'));
app.use('/api', backendRouter);


// Start the Server
const server = app.listen(port, () => {
    console.log(`Hosting server on port: ${port}`)
});

const wsServer = new ws.server({
    httpServer: server,
});

let rooms = {};
wsServer.on("request", function (req) {
    let connection = req.accept(null, req.origin);
    //Group closure to keep track of the group the socket is in for easy alerting
    let group = {};
    let roomID;
    connection.on('open', () => console.log("Connection opened"));
    connection.on('close', () => {
        console.log("Connection closed");
        if (roomID != undefined) {
            console.log(rooms[roomID]);
        }
    });
    connection.on('message', e => {
        //Parse the incoming message
        let parsedJSON = JSON.parse(e.utf8Data);
        console.log(parsedJSON);
        switch (parsedJSON.type) {
            //If it is a connection, add it to the correct document group
            case ('connect'):
                if (rooms[`${parsedJSON.user1}${parsedJSON.user2}`] !== undefined) {
                    rooms[`${parsedJSON.user1}${parsedJSON.user2}`].sockets.push(connection);
                    roomID = `${parsedJSON.user1}${parsedJSON.user2}`;
                    console.log(roomID);
                    group = rooms[`${parsedJSON.user1}${parsedJSON.user2}`];
                }
                else if (rooms[`${parsedJSON.user2}${parsedJSON.user1}`] !== undefined) {
                    rooms[`${parsedJSON.user2}${parsedJSON.user1}`].sockets.push(connection);
                    roomID = `${parsedJSON.user2}${parsedJSON.user1}`;
                    console.log(roomID);
                    group = rooms[`${parsedJSON.user2}${parsedJSON.user1}`];
                }
                else {
                    rooms[`${parsedJSON.user1}${parsedJSON.user2}`] = { sockets: [connection] };
                    group = rooms[`${parsedJSON.user1}${parsedJSON.user2}`];
                    roomID = `${parsedJSON.user1}${parsedJSON.user2}`;
                    console.log(roomID);
                }
                console.log(group);
                break;
            //If it is a disconnect, delete the socket from the group
            case ('disconnect'):
                group.sockets.splice(group.sockets.indexOf(connection), 1);
                break;
            //If it is sending text, send the update to the whole group (except sending connection)
            case ('update'):
                group.sockets.forEach((s) => {if(s != connection){s.send(parsedJSON.message) }});
                break;
        }
    });
});
