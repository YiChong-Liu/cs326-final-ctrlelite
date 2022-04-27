import express from 'express';
import jwtSigner from 'jsonwebtoken';
const { sign, verify } = jwtSigner;
import jwt from 'express-jwt';
import cookieParser from 'cookie-parser';
import * as db from './database.js';

const app = express.Router();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());

const SUPER_SECRET = process.env.JWT_SECRET || '8253c11f1244dd66854a026f537d68c350527cebb5678da5c05410e51ddbe32587a3464be4867aa5367f7b4bd4f23fd795ab61b0eed63a30e5f47c73384f222e';

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
}).unless({ path: ['/api/login/passwd', '/api/users/newUser'] }));

app.post('/login/passwd', async (req, res) => {
  const options = req.body;
  let user = await db.getUserFromEmail(options.email);
  if (user != undefined && user.password == options.password) {
    console.log(user.uid);
    const signedJWT = sign({ user: user.uid }, SUPER_SECRET, { expiresIn: '1 day' });
    res.cookie('auth', signedJWT, { maxAge: 43200000 });
    res.redirect("/personalProfile.html");
  } 
  else {
    res.status(401).send('Password not validated');
  }
});

function validateUser(token) {
  try {
    const tokenDecodedData = verify(token, SUPER_SECRET);
    if (tokenDecodedData === undefined) {
      return ({
        error: true,
      });
    }
    return ({
      error: false,
      data: tokenDecodedData
    });
  } catch (error) {
    return ({
      error: true,
      //data: error
    });
  }
}

// PUT

// Accept a new Match
app.put('/matches/acceptMatch', (req, res) => {
  // authenticate & authorize via JWT
  const authInfo = validateUser(req.cookies["auth"]);

  // If we are not validated, return a 401 error
  if (authInfo.error) {
    // unauthenticated
    return res.status(401).send();
  }

  // Get the user and their proposed partner
  const otherGuy = req.body.secondaryUserID;
  const myself = authInfo.data.user;

  // TODO database call to run them
  const result = db.acceptMatch(otherGuy, myself);

  // TODO return HTTP header / JSON response with real data
  res.status(200).send({ worked: result, user2: otherGuy });
});
// Add a new User
app.put('/users/newUser', async (req, res) => {
  // Get the user and their proposed partner
  let options = req.body;
  const e = options.email;
  const pass = options.password;
  const userName = options.username;

  // TODO database call to run them
  const result = await db.createNewUser(e, pass, userName);
  if (result) {
    const signedJWT = sign({ user: result }, SUPER_SECRET, { expiresIn: '1 day' });
    res.cookie('auth', signedJWT, { maxAge: 43200000 });
    // TODO return HTTP header / JSON response with real data
    res.redirect(303, "/userPreferences.html");
  }
  else {
    return res.status(401).send();
  }
});
// Update a User's Preferences
app.put('/update/userPreferences', (req, res) => {
  const authInfo = validateUser(req.cookies["auth"]);
  if (authInfo.error) {
    // unauthenticated
    return res.status(401).send();
  } else {
    console.log(`Updating ${authInfo.data.user}'s preferences`);
  }

  // Get userID and Preference Object from request
  const uID = authInfo.data.user;
  const pref = req.body.preferences;

  // Attempt to update this user's preferencess
  const result = db.updateUserPreferences(uID, pref);

  // Response
  res.status(200).send({ worked: result, user: uID, preferences: pref });
});
// Update a User's Preferences
app.put('/update/userProfile', async (req, res) => {
  // authenticate & authorize via JWT
  const authInfo = validateUser(req.cookies["auth"]);

  // If we are not validated, return a 401 error
  if (authInfo.error) {
    // unauthenticated
    return res.status(401).send();
  } else {
    console.log(`Updating ${authInfo.data.user}'s profile`);
  }
  console.log(authInfo);

  // Get userID and Preference Object from request
  console.log(req);
  const uID = authInfo.data.user;
  const profile = req.body.profile;

  // Attempt to update this user's preferencess
  const result = await db.updateUserProfile(uID, profile);

  // Response
  res.status(200).send({ worked: result, user: uID, profile: profile });
});
// Update/Change a User's Password
app.put('/update/userPassword', (req, res) => {
  // authenticate & authorize via JWT
  const authInfo = validateUser(req.cookies["auth"]);

  // If we are not validated, return a 401 error
  if (authInfo.error) {
    // unauthenticated
    return res.status(401).send();
  }

  // Get userID and new password from request
  const uID = authInfo.data.user;
  const pass = req.body.password;

  const result = db.updateUserPassword(uID, pass);

  // Response
  res.status(200).send({ worked: result, user: uID, password: pass });
});


// POST

// Send a Message
app.post('/msg/newChatMsg', (req, res) => {
  // authenticate & authorize via JWT
  const authInfo = validateUser(req.cookies["auth"]);

  // If we are not validated, return a 401 error
  if (authInfo.error) {
    // unauthenticated
    return res.status(401).send();
  }

  // Get from and to user and the msg
  const sender = authInfo.data.user;
  const receiver = req.body.user2;
  const msg = req.body.msg;

  // TODO actual databasing
  const result = db.createMessage(sender, receiver, msg);

  // TODO return HTTP header / JSON response with real data
  res.status(200).send({ worked: result, msg_content: msg });
});

// GET

// Grab a Conversation of Messages
app.get('/msg/fetch', (req, res) => {
  // authenticate & authorize via JWT
  const authInfo = validateUser(req.cookies["auth"]);

  // If we are not validated, return a 401 error
  if (authInfo.error) {
    // unauthenticated
    return res.status(401).send();
  }

  // Get Data from the Request
  const sender = authInfo.data.user;
  const receiver = req.query.userTo;
  const amt = req.query.msgAmt;

  // Gather the message data
  const data = db.getMessages(sender, receiver, amt);

  // Send Response
  res.status(200).send({ worked: true, msg_object: data });
});
// Grab a User's Matches
app.get('/matches', (req, res) => {
  // authenticate & authorize via JWT
  const authInfo = validateUser(req.cookies["auth"]);

  // If we are not validated, return a 401 error
  if (authInfo.error) {
    // unauthenticated
    return res.status(401).send();
  }

  // Get Data from the Request
  const id = authInfo.data.user;

  // Gather user Matches
  const data = db.getMatches(id);

  // Send Response
  res.status(200).send({ worked: true, user: id, user_matches: data });
});
// Grab a User's Profile and Preferences
app.get('/user/data', async (req, res) => {
  // authenticate & authorize via JWT
  const authInfo = validateUser(req.cookies["auth"]);

  // If we are not validated, return a 401 error
  if (authInfo.error) {
    // unauthenticated
    return res.status(401).send();
  }

  // Get Data from the Request
  const id = authInfo.data.user;

  // Gather user Data
  const data = await db.getUserData(id);

  // Send Response
  res.status(200).send({ worked: true, user: id, user_data: data });
});
// Grab a User's Matches
app.get('/matches/potentialMatches', async (req, res) => {
  // authenticate & authorize via JWT
  const authInfo = validateUser(req.cookies["auth"]);

  // If we are not validated, return a 401 error
  if (authInfo.error) {
    // unauthenticated
    return res.status(401).send();
  }

  // Get Data from the Request
  const id = authInfo.data.user;

  let matches = await db.getPotentialMatches(id);
  console.log(res);

  // Send Response
  res.status(200).send({ worked: true, user: id, potential_matches: matches });
});


// DELETE

// Delete a User
app.delete('/delete/user', (req, res) => {
  // authenticate & authorize via JWT
  const authInfo = validateUser(req.cookies["auth"]);

  // If we are not validated, return a 401 error
  if (authInfo.error) {
    // unauthenticated
    return res.status(401).send();
  }

  // Get Data from the Request
  const id = authInfo.data.userID;

  // Attempt to delete this user
  const result = db.deleteUser(id);

  // Send Response
  res.status(200).send({ worked: result, user: id });
});
// Delete a Match
app.delete('/delete/match', (req, res) => {
  // authenticate & authorize via JWT
  const authInfo = validateUser(req.cookies["auth"]);

  // If we are not validated, return a 401 error
  if (authInfo.error) {
    // unauthenticated
    return res.status(401).send();
  }

  // Get Data from the Request
  const ufID = authInfo.data.user;
  const mtID = req.body.matchToID;

  // Attempt to Delete this match
  const result = db.deleteMatch(ufID, mtID);

  // Send Response
  res.status(200).send({ worked: result, user: ufID, user2: mtID });
});

export default app;
