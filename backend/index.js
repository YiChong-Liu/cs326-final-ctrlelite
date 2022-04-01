import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!')
});


// POST

// Accept a new Match
app.post('/matches/acceptedMatch', (req, res) => {
  // TODO authenticate & authorize via JWT

  // Get the user and their proposed partner
  const otherGuy = req.query.secondaryUserID;
  const myself = req.query.primaryUserID;

  // TODO database call to run them

  // TODO return HTTP header / JSON response with real data
  res.status(200).send({otherUser: otherGuy, matchAccepted: true});
});
// Add a new User
app.post('/users/newUser', (req, res) => {
  // TODO authenticate & authorize via JWT

  // Get the user and their proposed partner
  const e = req.query.email;
  const pass = req.query.password;

  // TODO database call to run them

  // TODO return HTTP header / JSON response with real data
  res.status(200).send({accepted: true, email: e, password: pass});
});
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
// Update a User's Preferences
app.post('/update/userPreferences', (req, res) => {
  // Get userID and Preference Object from request
  const uID = req.query.userID;
  const pref = req.query.preferences;

  // Response
  res.status(200).send({worked: true, user: uID, preferences: pref});
});
// Update/Change a User's Password
app.post('/update/userPassword', (req, res) => {
  // Get userID and new password from request
  const uID = req.query.userID;
  const pass = req.query.password;

  // Response
  res.status(200).send({worked: true, user: uID, password: pass});
});


// GET

// Grab a Conversation of Messages
app.get('/msg/fetch', (req, res) => {
  // Get Data from the Request
  const sender = req.query.userFrom;
  const receiver = req.query.userTo;
  const amt = req.query.msgAmt;

  // Send Response
  res.status(200).send({worked: true, amount: amt});
});
// Grab a User's Matches
app.get('/matches', (req, res) => {
  // Get Data from the Request
  const id = req.query.user;

  // Send Response
  res.status(200).send({worked: true, userID: id});
});
// Grab a User's Profile and Preferences
app.get('/user/data', (req, res) => {
  // Get Data from the Request
  const id = req.query.user;

  // Send Response
  res.status(200).send({worked: true, userID: id});
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

  // Send Response
  res.status(200).send({worked: true, userID: id});
});
// Delete a Match
app.delete('/delete/match', (req, res) => {
  // Get Data from the Request
  const ufID = req.query.userFromID;
  const mtID = req.query.matchToID;

  // Send Response
  res.status(200).send({worked: true, userFrom: ufID, userTo: mtID});
});


// Start the Server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
