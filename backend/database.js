import * as fakerObj from '@faker-js/faker'
const faker = fakerObj.default;

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
 * @return {Boolean} Returns true if it was successfully inserted, false otherwise
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
    return true; //TODO: Make this return success value of query
}

/**
 *
 * @param {String} database Database to find in
 * @param {String} whereQuery Query to find the desired row(or rows) eg. "userID='1234' AND userToID='4321'"
 * @param {String} orderBy Query to determnine the the way to order the results eg. "timestamp DESC"
 * @return {[]} Return the data found
 */
function find(database, whereQuery, orderBy){
    let query = (orderBy) ? `SELECT * FROM ${database} WHERE ${whereQuery} ORDER BY ${orderBy};` : `SELECT * FROM ${database} WHERE ${whereQuery};`;
    console.log(query);
    return []; //TODO: Make this return data
}


/**Find and update a row(or rows) in a database.
 *
 * @param {String} database Database to update
 * @param {String} whereQuery Query to find the desired row(or rows) eg. "userFromID='1234' AND userToID='4321'"
 * @param {[{Column:String, Data:String}]} dataEntry Data to update
 * @returns {Boolean} Returns true if it was successfully updated, false otherwise
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
    return true; //TODO: Make this return success value of query
}

/**Find and delete a row(or rows) in a database.
 *
 * @param {String} database Database to update
 * @param {String} whereQuery Query to find the desired row(or rows) eg. "userFromID='1234' AND userToID='4321'"
 * @returns {Boolean} Returns true if it was successfully deleted, false otherwise
 */
function findAndDelete(database, whereQuery){
    let query = `DELETE * FROM ${database} WHERE ${whereQuery};`;
    console.log(query);
    return true; //TODO: Make this return success value of query
}


/**-------------------------------------------------------------
 *
 *                    CREATE FUNCTIONS
 *
 * --------------------------------------------------------------
 */

/** Creates a new user in the users table
 * 
 * @param {String} email User email
 * @param {String} password User password
 * @returns {Boolean} Returns if the insert was successfull
 */
export function createNewUser(email, password){
    const newUuid = faker.datatype.uuid();

    return insert('Users', [{Column: 'userID', Data: newUUId}, {Column: 'email', Data: email}, {Column: 'password', Data: password}]);
}

/** Creates a new match between two users
 * 
 * @param {String} userID1 User1 ID
 * @param {String} userID2 User2 ID
 * @returns {Boolean} Returns if the insert was successfull
 */
export function createMatch(userID1, userID2){
    return insert('Matches', [{Column: 'userID1', Data: userID1}, {Column: 'userID2', Data:userID2}]);
}

/** Adds a new message between two users.
 * 
 * @param {String} userFromID The user sending the message
 * @param {String} userToID The user recieving the message
 * @param {String} Message The message sent
 * @returns {Boolean} Returns if the insert was successfull
 */
export function createMessage(userFromID, userToID, Message){
    return insert('chat', [{Column: 'userFromID', Data: userFromID}, {Column: 'userToID', Data:userToID}, {Column: 'message', Data: Message}]);
}


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
export function getUserData(userID){
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
export function getMessages(userIDFrom, userIDTo, numMessages=20){
    let userFromMsgs = [];
    let userToMsgs = [];
    const randomMsg = () => faker.lorem.paragraph();

    for(let i = 0; i < numMessages; ++i){
        userFromMsgs.push(randomMsg());
        userToMsgs.push(randomMsg());
    }

    //Test the query ouput for eventual SQL
    const userToMsgsResults = find("chat", `userFromID='${userIDFrom}' AND userToID='${userIDTo}'`);
    const userFromMsgsResults = find("chat", `userFromID='${userIDTo}' AND userToID='${userIDFrom}'`);

    return {fromMsgs: userFromMsgs, toMsgs: userToMsgs};
}

/**
 *
 * @param {String} userID user to find matches from
 * @returns {[]Matches} Returns all user matches
 */
export function getMatches(userID){
    let userMatches = [];
    const randomUUID = () => faker.datatype.uuid();

    for(let i = 0; i < 10; ++i){
        userMatches.push(randomUUID());
    }

    //Test the query ouput for eventual SQL
    const userMatchesResults = find("matches", `userID1='${userID}' OR userID2='${userIDTo}'`);

    return userMatches;
}


/**-------------------------------------------------------------
 *
 *                    UPDATE FUNCTIONS
 *
 * --------------------------------------------------------------
 */

/**Updates the user preferences in the database
 * 
 * @param {String} userID UserID to update
 * @param {Object} userPreferences New Preferences
 */
export function updateUserPreferences(userID, userPreferences){
    let preferences = [];
    for(const key of Object.keys(userPreferences)){
        preferences.push({Column:key, Data:userPreferences[key]});
    }
    return findAndUpdate("Preferences", `userID='${userID}'`, preferences);
}

/**-------------------------------------------------------------
 *
 *                    DELETE FUNCTIONS
 *
 * --------------------------------------------------------------
 */

/**Deletes a user from the user table
 * 
 * @param {String} userID 
 * @returns {Boolean} Returns true if it was successfully deleted, false otherwise
 */
export function deleteUser(userID){
    return findAndDelete("Users", `userID='${userID}'`);
}


/**Deletes matches from the Match table
 * 
 * @param {String} userID1 First user in the match
 * @param {String} userID2 Second user in the match
 * @returns {Boolean} Returns true if it was successfully deleted, false otherwise
 */
export function deleteMatch(userID1, userID2){
    return findAndDelete("Users", `(userID1='${userID1}' AND userID2='${userID2}) OR (userID1='${userID2}' AND userID2='${userID21})'`);
}
