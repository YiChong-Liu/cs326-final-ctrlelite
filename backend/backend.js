import express from 'express';
import jwtSigner from 'jsonwebtoken';
const { sign } = jwtSigner;
import jwt from 'express-jwt';
import cookieParser from 'cookie-parser';
import * as db from './database.js';

const app = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const SUPER_SECRET = '8253c11f1244dd66854a026f537d68c350527cebb5678da5c05410e51ddbe32587a3464be4867aa5367f7b4bd4f23fd795ab61b0eed63a30e5f47c73384f222e';

// LOGIN
app.use(jwt({
  secret: SUPER_SECRET,
  algorithms: ['HS256'],
  getToken: function fromHeaderOrCookie(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.auth) {
      return req.cookies.auth;
    }
    return null;
  }
}).unless({path: ['/api/login/passwd', '/api/users/newUser']}));

app.post('/login/passwd', async (req, res) => {
  const options = req.body;
  console.log(options);
  const passwordValidated = true;
  if (passwordValidated) {
    const signedJWT = sign({user: options.email}, SUPER_SECRET, { expiresIn: '1 day' });
    res.cookie('auth', signedJWT, { maxAge: 43200000 });
    res.redirect("/userPreferences.html");
  } else {
    res.status(401).send("BOO");
  }
});


// PUT

// Accept a new Match
app.put('/matches/acceptedMatch', (req, res) => {
  // TODO authenticate & authorize via JWT

  // Get the user and their proposed partner
  const otherGuy = req.query.secondaryUserID;
  const myself = req.query.primaryUserID;

  // TODO database call to run them
  const result = db.createMatch(otherGuy, myself);

  // TODO return HTTP header / JSON response with real data
  res.status(200).send({worked: result, otherUser: otherGuy, matchAccepted: true});
});
// Add a new User
app.put('/users/newUser', (req, res) => {
  // TODO authenticate & authorize via JWT

  // Get the user and their proposed partner
  const e = req.query.email;
  const pass = req.query.password;

  // TODO database call to run them
  const result = db.createNewUser(e, pass);

  // TODO return HTTP header / JSON response with real data
  res.status(200).send({accepted: result, email: e, password: pass});
});
// Update a User's Preferences
app.put('/update/userPreferences', (req, res) => {
  // Get userID and Preference Object from request
  const uID = req.query.userID;
  const pref = JSON.parse(req.query.preferences);

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

  const result = db.updateUserPassword(uID, pass);

  // Response
  res.status(200).send({worked: result, user: uID, password: pass});
});


// POST

// Send a Message
app.post('/msg/newChatMsg', (req, res) => {
  // Get from and to user and the msg
  const sender = req.query.userFrom;
  const receiver = req.query.userTo;
  const msg = req.query.msg;

  // TODO actual databasing
  const result = db.createMessage(sender, receiver, msg);

  // TODO return HTTP header / JSON response with real data
  res.status(200).send({worked: result, msg_content: msg});
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
  res.status(200).send({worked: true, userID: id, potentialMatches: []});
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

export default app;
