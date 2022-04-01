// Import Packages
import express from 'express';
import * as db from './database.js';

// Initialize express
const app = express();
const port = 3000;

// Default API Welcome Message
app.get('/', (req, res) => {
    res.send('Hello World!')
});


// PUT

// Accept a new Match
app.put('/matches/acceptedMatch', (req, res) => {
  // TODO authenticate & authorize via JWT

  // Get the user and their proposed partner
  const otherGuy = req.query.secondaryUserID;
  const myself = req.query.primaryUserID;

  // TODO database call to run them

  // TODO return HTTP header / JSON response with real data
  res.status(200).send({otherUser: otherGuy, matchAccepted: true});
});
// Add a new User
app.put('/users/newUser', (req, res) => {
  // TODO authenticate & authorize via JWT

  // Get the user and their proposed partner
  const e = req.query.email;
  const pass = req.query.password;

  // TODO database call to run them

  // TODO return HTTP header / JSON response with real data
  res.status(200).send({accepted: true, email: e, password: pass});
});
// Update a User's Preferences
app.put('/update/userPreferences', (req, res) => {
  // Get userID and Preference Object from request
  const uID = req.query.userID;
  const pref = req.query.preferences;

  // Attempt to update this user's preferencess
  const result = db.updateUserPreferences(uID, pref);

  // Response
  res.status(200).send({worked: result, user: uID, preferences: pref});
});
// Update/Change a User's Password
app.put('/update/userPassword', (req, res) => {
  // Get userID and new password from request
  const uID = req.query.userID;
  const pass = req.query.password;

  // Response
  res.status(200).send({worked: true, user: uID, password: pass});
});


// POST

// Send a Message
app.post('/msg/newChatMsg', (req, res) => {
  // Get from and to user and the msg
  const sender = req.query.userFrom;
  const receiver = req.query.userTo;
  const msg = req.query.msg;

  // TODO actual databasing

  // TODO return HTTP header / JSON response with real data
  res.status(200).send({worked: true, msg_content: msg});
});


// GET

// Grab a Conversation of Messages
app.get('/msg/fetch', (req, res) => {
  // Get Data from the Request
  const sender = req.query.userFrom;
  const receiver = req.query.userTo;
  const amt = req.query.msgAmt;

  // Gather the message data
  const data = db.getMessages(sender, receiver, amt);

  // Send Response
  res.status(200).send({worked: true, messageData: data});
});
// Grab a User's Matches
app.get('/matches', (req, res) => {
  // Get Data from the Request
  const id = req.query.user;

  // Gather user Matches
  const data = db.getMatches(id);

  // Send Response
  res.status(200).send({worked: true, user_ID: id, user_matches: data});
});
// Grab a User's Profile and Preferences
app.get('/user/data', (req, res) => {
  // Get Data from the Request
  const id = req.query.user;

  // Gather user Data
  const data = db.getUserData(id);

  // Send Response
  res.status(200).send({worked: true, user_ID: id, user_data: data});
});
// Grab a User's Matches
app.get('/matches/potentialMatches', (req, res) => {
  // Get Data from the Request
  const id = req.query.user;

  // Send Response
  res.status(200).send({worked: true, userID: id});
});


// DELETE

// Delete a User
app.delete('/delete/user', (req, res) => {
  // Get Data from the Request
  const id = req.query.userID;

  // Attempt to delete this user
  const result = db.deleteUser(id);

  // Send Response
  res.status(200).send({worked: result, userID: id});
});
// Delete a Match
app.delete('/delete/match', (req, res) => {
  // Get Data from the Request
  const ufID = req.query.userFromID;
  const mtID = req.query.matchToID;

  // Attempt to Delete this match
  const result = db.deleteMatch(ufID, mtID);

  // Send Response
  res.status(200).send({worked: result, userFrom: ufID, userTo: mtID});
});


// Start the Server
app.listen(port, () => {
    console.log(`Hosting server on port: ${port}`)
});
