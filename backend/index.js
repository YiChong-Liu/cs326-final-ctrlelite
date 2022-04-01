const express = require('express');
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


// Start the Server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
