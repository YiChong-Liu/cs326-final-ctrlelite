const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!')
});

// Matches
app.post('/matches/acceptedMatch', (req, res) => {
  // TODO authenticate & authorize via JWT

  // Get the user and their proposed partner
  const otherGuy = req.query.secondaryUserID;
  const myself = req.query.primaryUserID;

  // TODO database call to run them

  // TODO return HTTP header / JSON response with real data
  res.status(200).send({otherUser: otherGuy, matchAccepted: true});
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
