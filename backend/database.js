import * as fakerObj from '@faker-js/faker';
import pg from 'pg';
import * as fs from 'fs';
import { randomUUID } from 'crypto';
const faker = fakerObj.default;

const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
});

let connected = false;

if (process.env.DATABASE_URL) {
    console.log("Connecting to DB...");
    client.connect();

    var sql = fs.readFileSync('./backend/init_db.sql').toString();
    client.query(sql);
    connected = true; 
}

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
async function insert(database, dataEntry){
    let columns = '';
    let values = '';
    let i = 0;
    for(const dataPoint of dataEntry){
        columns += i !== dataEntry.length - 1? `${dataPoint.Column}, ` : `${dataPoint.Column}`;
        values += i !== dataEntry.length - 1? `${dataPoint.Data}, ` : `${dataPoint.Data}`;
        i++;
    }
    let query = `INSERT INTO ${database} (${columns}) VALUES (${values});`;
    console.log(query);
    let res = await queryClient(query);
    if(res.success){
        return true;
    }
    return false; //TODO: Make this return success value of query
}

/**
 *
 * @param {String} database Database to find in
 * @param {String} whereQuery Query to find the desired row(or rows) eg. "userID='1234' AND userToID='4321'"
 * @param {String} orderBy Query to determnine the the way to order the results eg. "timestamp DESC"
 * @return {[]} Return the data found
 */
async function find(database, whereQuery, orderBy){
    let query = (orderBy) ? `SELECT * FROM ${database} WHERE ${whereQuery} ORDER BY ${orderBy};` : `SELECT * FROM ${database} WHERE ${whereQuery};`;
    console.log(query);
    let res = await queryClient(query);
    if(res.success){
        return res.data.rows;
    }
    return []; //TODO: Make this return data
}


/**Find and update a row(or rows) in a database.
 *
 * @param {String} database Database to update
 * @param {String} whereQuery Query to find the desired row(or rows) eg. "userFromID='1234' AND userToID='4321'"
 * @param {[{Column:String, Data:String}]} dataEntry Data to update
 * @returns {Boolean} Returns true if it was successfully updated, false otherwise
 */
async function findAndUpdate(database, whereQuery, dataEntry){
    let columns = '';
    let values = '';
    let i = 0;
    for(const dataPoint of dataEntry){
        columns += i !== dataEntry.length - 1 ? `${dataPoint.Column} = ${dataPoint.data}, ` : `${dataPoint.Column} = ${dataPoint.data}`;
        i++;
    }
    let query = `UPDATE ${database} SET ${columns} WHERE ${whereQuery};`;
    console.log(query);
    queryClient(query);
    return true; //TODO: Make this return success value of query
}

/**Find and delete a row(or rows) in a database.
 *
 * @param {String} database Database to update
 * @param {String} whereQuery Query to find the desired row(or rows) eg. "userFromID='1234' AND userToID='4321'"
 * @returns {Boolean} Returns true if it was successfully deleted, false otherwise
 */
async function findAndDelete(database, whereQuery){
    let query = `DELETE * FROM ${database} WHERE ${whereQuery};`;
    console.log(query);
    return true; //TODO: Make this return success value of query
}

/**
 * 
 * @param {String} query SQL query to run on the postgres database
 * @returns Returns the rows of the query
 */
async function queryClient(query){
    if(connected){
        let res = await client.query(query);
        return {success: true, data: res};
    }
    return {success: false};
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
export async function createNewUser(email, password){
    const newUUId = randomUUID();
    let userExists = await find('users', `email='${email}'`);
    if(! (userExists.length > 0) && email.length > 0 && password.length > 7){
        await insert('users', [{Column: 'uID', Data: `'${newUUId}'`}, {Column: 'email', Data: `'${email}'`}, {Column: 'password', Data: `'${password}'`}]);
        await insert('userpreferences', [{Column: 'uID', Data: `'${newUUId}'`}]);
        await insert('userprofiles', [{Column: 'uID', Data: `'${newUUId}'`}]);
        console.log("New User Created");
        return true;
    } 
    else{
        return false;
    }   
}

/** Creates a new match between two users
 *
 * @param {String} userID1 User1 ID
 * @param {String} userID2 User2 ID
 * @returns {Boolean} Returns if the insert was successfull
 */
export async function acceptMatch(userID1, userID2){
    let res = await client.query(`select * FROM matches WHERE (uID1='${userID1}' AND uID2='${userID2}') OR (uID1='${userID2}' AND uID2='${userID1}')`);
    console.log(res);
    return insert('matches', [{Column: 'userID1', Data: userID1}, {Column: 'userID2', Data:userID2}]);
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
    const preferences = find("userPreferences", `uID='${userID}'`);
    const profile = find("userProfiles", `uID='${userID}'`)

    return {user_ID: userID, preferences:{"bedtime":{"time":bedtime,"importance":importance()},"cleanliness":{"level":importance(),"importance":importance()}}, profile:{userName:randomName, bio:loremBio, profilePicture:randomImg}}
}

/** Checks if the user is in the database
 *
 * @param {String} userID UserID to check
 * @returns Boolean if the user exists in the database
 */
export function idExists(userID){
    return (find("user", `userID='${userID}'`).length == 0);
}

/**Checks if a match between users exists
 *
 * @param {String} userID1
 * @param {String} userID2
 * @returns Boolean
 */
export function matchExists(userID1, userID2){
    return (find("matches", `(userID1='${userID1}' AND userID2='${userID2}) OR (userID1='${userID2}' AND userID2='${userID1})'`).length == 0);
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
    const userToMsgsResults = find("chat", `userFromID='${userIDFrom}' AND userToID='${userIDTo}'`, "timestamp DESC");
    const userFromMsgsResults = find("chat", `userFromID='${userIDTo}' AND userToID='${userIDFrom}'`, "timestamp DESC");

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
    const userMatchesResults = find("matches", `userID1='${userID}' OR userID2='${userID}'`);

    return userMatches;
}

/**
 *
 * @param {String} userID
 * @returns {String} Returns the hashed users password stored in the db
 */
export async function getUserFromEmail(email){
    let password = faker.internet.password();

    //Test for sql result
    const passwordResult = await find("users", `email='${email}'`);
    if(passwordResult.length > 0){
        console.log(passwordResult[0]);
        return passwordResult[0];
    }
    return undefined;
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
    return findAndUpdate("userPreferences", `uID='${userID}'`, preferences);
}

/**Updates the user profile in the database
 *
 * @param {String} userID UserID to update
 * @param {Object} userProfile New Profile
 */
 export function updateUserProfile(userID, userProfile){
    let profile = [];
    for(const key of Object.keys(userProfile)){
        profile.push({Column:key, Data:`'${userProfile[key]}'`});
    }
    return findAndUpdate("userProfiles", `uID='${userID}'`, profile);
}

/**Updates the given users password in the database
 *
 * @param {String} userID UserID to update
 * @param {String} password New password
 * @returns
 */
export function updateUserPassword(userID, password){
    return findAndUpdate("Users", `uID=${userID}`, [{Column:'password', Data:`'${password}'`}]);
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
    return findAndDelete("Users", `(userID1='${userID1}' AND userID2='${userID2}) OR (userID1='${userID2}' AND userID2='${userID1})'`);
}
