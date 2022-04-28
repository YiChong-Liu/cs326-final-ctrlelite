import { parseJwt } from "./main.js";

function makeNewMessage(msg, time, isTo) {
    if(isTo) {
        let message = document.createElement('div');

        let msg_body = document.createElement('div');
        msg_body.classList.add('card');
        msg_body.classList.add('text-black');
        msg_body.classList.add('bg-white');
        msg_body.classList.add('p-4');
        msg_body.classList.add('ms-auto');
        msg_body.classList.add('me-0');
        msg_body.classList.add('chat-msg');
        msg_body.textContent = msg;
        message.appendChild(msg_body);

        let time_stamp = document.createElement('p');
        time_stamp.classList.add('text-end');
        time_stamp.textContent = time;
        message.appendChild(time_stamp);

        return message;
    } else {
        let message = document.createElement('div');

        let msg_body = document.createElement('div');
        msg_body.classList.add('card');
        msg_body.classList.add('text-white');
        msg_body.classList.add('bg-primary');
        msg_body.classList.add('p-4');
        msg_body.classList.add('ms-0');
        msg_body.classList.add('me-auto');
        msg_body.classList.add('chat-msg');
        msg_body.textContent = msg;
        message.appendChild(msg_body);

        let time_stamp = document.createElement('p');
        time_stamp.classList.add('text-start');
        time_stamp.textContent = time;
        message.appendChild(time_stamp);

        return message;
    }
}

const params = new URLSearchParams(window.location.search);

const send = document.getElementById('button-addon2');
const chat = document.getElementById('chat-message');

let socket;

if(params.has('user') && params.has('userName')) {
    // Gather user names and other important data
    const user1 = parseJwt(document.cookie).user;
    const user2 = params.get('user');
    const user2Name = params.get('userName');
    const msgCount = 10;
    let msgData;
    let chatBody = document.getElementById('chat_body');

    // Gather messages
    let response = await fetch('/api/msg/fetch?userFrom=' + user1 + '&userTo=' + user2 + '&msgAmt=' + msgCount);
    if(response.ok){
        let msgJSON = await response.json();
        console.log(msgJSON);
        msgData = msgJSON.msg_object;
    } else {
        console.log('ERROR: failed to update preferences');
    }


    // Set chat header
    document.getElementById('chat_header').innerHTML = 'Chat - ' + user2Name;

    // Fill in the fake messages
    let index1 = 0; 
    let index2 = 0;
    for(let i = 0; i < msgData.fromMsgs.length + msgData.toMsgs.length; i++) {
        if(msgData.fromMsgs[index1] === undefined){
            let time2 = new Date(msgData.toMsgs[index2].time.replace(' ', 'T'));
            chatBody.appendChild(makeNewMessage(msgData.toMsgs[index2].msg, time2.toLocaleString(), true));
            index2++;
        }
        else if(msgData.toMsgs[index2] === undefined){
            let time1 = new Date(msgData.fromMsgs[index1].time.replace(' ', 'T'));
            chatBody.appendChild(makeNewMessage(msgData.fromMsgs[index1].msg, time1.toLocaleString(), false));
            index1++;
        }
        else{
            let time1 = new Date(msgData.fromMsgs[index1].time.replace(' ', 'T'));
            let time2 = new Date(msgData.toMsgs[index2].time.replace(' ', 'T'));
            if(time1 >= time2){
                chatBody.appendChild(makeNewMessage(msgData.fromMsgs[index1].msg, time1.toLocaleString(), false));
                index1++;
            }
            else{
                chatBody.appendChild(makeNewMessage(msgData.toMsgs[index2].msg, time2.toLocaleString(), true));
                index2++;
            }
        }
        updateScroll();
    }
    let HOST = location.origin.replace(/^http/, 'ws')
    socket = new WebSocket(HOST);
    socket.addEventListener('open', e => {
        //When the socket is established, we are going to send an initial connect message
        socket.send(JSON.stringify({ type: 'connect', user1: user1, user2: user2 }));
    });
    socket.addEventListener('message', function (e) {
        console.log(e);
        chatBody.appendChild(makeNewMessage(e.data, new Date().toLocaleString(), false));
        updateScroll();
    });
    socket.addEventListener('close', e => {
        //When the socket is established, we are going to send an initial connect message
        socket.send(JSON.stringify({ type: 'disconnect', user1: user1, user2: user2 }));
    });

    send.addEventListener('click', async function(e){
        sendMessage(user2);
    });

    chat.addEventListener('keyup', async function(e){
        if(e.code = "Enter"){
            sendMessage(user2);
        }
    });
}

async function sendMessage(user2){
    let time = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let response = await fetch("/api/msg/newChatMsg", { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user2:user2, msg: chat.value, timestamp: time}) });
    if(socket != null){
        socket.send(JSON.stringify({ type: 'update', message: chat.value}));
        chatBody.appendChild(makeNewMessage(chat.value, time.toLocaleString(), true));
        updateScroll();
    }
    chat.innerText = "";
}

function updateScroll(){
    let element = document.getElementById("chat_body");
    element.scrollTop = element.scrollHeight;
}




