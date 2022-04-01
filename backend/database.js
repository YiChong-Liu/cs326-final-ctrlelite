import * as faker from '@faker-js/faker'


/**-------------------------------------------------------------
 * 
 *                 DATABASE HELPER FUNCTIONS
 * 
 * --------------------------------------------------------------
 */

/**Attempts to insert data into the database.
 * 
 * @param {String} database Name of the database to enter 
 * @param {[{Column:String, Data:String}]} dataEntry Data to enter.
 */
function insert(database, dataEntry){
    let columns = '';
    let values = '';
    for(const dataPoint of dataEntry){
        columns += `${datapoint.Column}, `;
        values += `${dataPoint.Data}, `;
    }
    let query = `INSERT INTO ${database} (${columns}) VALUES (${values});`;
    console.log(query);
}

/**
 * 
 * @param {String} database Database to find in
 * @param {String} whereQuery Query to find the desired row(or rows) eg. "userID='1234' AND userToID='4321'"
 * @param {String} orderBy Query to determnine the the way to order the results eg. "timestamp DESC"
 */
function find(database, whereQuery, orderBy){
    let query = (orderBy) ? `SELECT * FROM ${database} WHERE ${whereQuery} ORDER BY ${orderBy};` : `SELECT * FROM ${database} WHERE ${whereQuery}`;
    console.log(query);
}


/**Find and update a row(or rows) in a database.
 * 
 * @param {String} database Database to update
 * @param {String} whereQuery Query to find the desired row(or rows) eg. "userFromID='1234' AND userToID='4321'"
 * @param {[{Column:String, Data:String}]} dataEntry Data to update
 */
function findAndUpdate(database, whereQuery, dataEntry){
    let columns = '';
    let values = '';
    for(const dataPoint of dataEntry){
        columns += `${datapoint.Column}, `;
        values += `${dataPoint.Data}, `;
    }
    let query = `UPDATE ${database} (${columns}) VALUES (${values}) WHERE ${whereQuery};`;
    console.log(query);
}

/**Find and delete a row(or rows) in a database.
 * 
 * @param {String} database Database to update
 * @param {String} whereQuery Query to find the desired row(or rows) eg. "userFromID='1234' AND userToID='4321'"
 */
function findAndDelete(database, whereQuery){
    let query = `DELETE * FROM ${database} WHERE ${whereQuery};`;
    console.log(query);
}


/**-------------------------------------------------------------
 * 
 *                    CREATE FUNCTIONS
 * 
 * --------------------------------------------------------------
 */



/**-------------------------------------------------------------
 * 
 *                     READ FUNCTIONS
 * 
 * --------------------------------------------------------------
 */

/**Gets the userData from the database
 * 
 * @param {String} userID User id to get data of
 * @returns {Object: {uId: String, preferences: Object, profile: Object}} Profile and Preferences to return
 */
function getUserData(userID){
    const randomName = faker.name.findName();
    const randomImg = faker.image.avatar();
    const loremBio = faker.lorem.paragraph();

    const bedtime = Math.random()*200 + 2000;
    const importance = () => Math.random()*10;

    //Test the query ouput for eventual SQL
    const preferences = find("Preferences", `userID='${userID}'`);
    const profile = find("Profile", `userID='${userID}'`)

    return {uID: userID, preferences:{"bedtime":{"time":bedtime,"importance":importance()},"cleanliness":{"level":importance(),"importance":importance()}}, profile:{name:randomName, bio:loremBio, profilePicture:randomImg}}
}

/**Gets the messages between the two users.
 * 
 * @param {String} userIDFrom The user making the request
 * @param {String} userIDTo The other user involved with the request
 * @returns {Object: {fromMsgs: []Messages, toMsgs: []Messages}} Returns two list of chat objects
 */
function getMessages(userIDFrom, userIDTo){
    let userFromMsgs = [];
    let userToMsgs = [];

    const randomMsg = () => faker.lorem.paragraph();

    for(let i = 0; i < 10; ++i){
        userFromMsgs.push(randomMsg());
        userToMsgs.push(randomMsg());
    }

    //Test the query ouput for eventual SQL
    const userToMsgsResults = find("chat", `userFromID=${userIDFrom} AND userToID=${userIDTo}`);
    const userFromMsgsResults = find("chat", `userFromID=${userIDTo} AND userToID=${userIDFrom}`);

    return {fromMsgs: userFromMsgs, toMsgs: userToMsgs};
}

/**
 * 
 * @param {String} userID user to find matches from
 * @returns {[]Matches} Returns all user matches
 */
function getMatches(userID){
    let userMatches = [];
    const randomUUID = () => faker.database.uuid();

    for(let i = 0; i < 10; ++i){
        userMatches.push(randomUUID());
    }

    //Test the query ouput for eventual SQL
    const userMatchesResults = find("matches", `userID1='${userIDFrom}' OR userID2='${userIDTo}'`);

    return userMatches;
}


/**-------------------------------------------------------------
 * 
 *                    UPDATE FUNCTIONS
 * 
 * --------------------------------------------------------------
 */

/**-------------------------------------------------------------
 * 
 *                    DELETE FUNCTIONS
 * 
 * --------------------------------------------------------------
 */
