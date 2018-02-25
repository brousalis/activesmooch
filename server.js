const dotenv = require('dotenv');
dotenv.config();
dotenv.load();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Smooch = require('smooch-core');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 5000;
const KEY_ID = process.env.REACT_APP_SMOOCH_KEY_ID;
const SECRET = process.env.REACT_APP_SMOOCH_SECRET;
const APP_ID = process.env.REACT_APP_SMOOCH_ID;

const smooch = new Smooch({
  keyId: KEY_ID,
  secret: SECRET,
  scope: 'app',
});

io.set('transports', ['xhr-polling']);
io.set('polling duration', 10);

var messagePayload = null;
// var appUserId = 'a29c4085a9a876086d7c2aec';
var appUserId = 'default';

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../build')));
app.use(bodyParser.json());

// Answer API requests.
app.get('/api', function(req, res) {
  console.log('-------------- API');
  res.set('Content-Type', 'application/json');
  res.send('{"message":response.appUser._id}');
});

// POST message by appUser
app.post('/messages', function(req, res) {
  if (req.body.trigger === 'message:appUser') {
    console.log(req.body);
    messagePayload = JSON.stringify(req.body, null, 4);
    appUserId = req.body.appUser._id;
    io.emit('message', messagePayload);
    res.sendStatus(200);
  }
});

// UPDATE appUser
app.post('/updateappuser', function(req, res) {
  console.log(req.body);

  smooch.appUsers.update(appUserId, req.body).then(response => {
    res.send(response);
  });
});

// GET appUser
app.get('/appuser', function(req, res) {
  // smooch.appUsers.get('a29c4085a9a876086d7c2aec', 'c7f6e6d6c3a637261bd9656f').then(response => {
  // console.log(req, res);
  smooch.appUsers
    .get(appUserId)
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      console.log('API ERROR:\n', err);
      res.status(404).json({
        error: err.description,
        status: err.response.status,
        statusText: err.response.statusText,
      });
    });
  // async code
  // });
});

// DELETE user profile
app.get('/deleteuserprofile', function(req, res) {
  smooch.appUsers
    .deleteProfile(appUserId)
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      console.log('API ERROR:\n', err);
      res.end();
    });
});

// POST message by appMaker
app.get('/postmessage/message/:message', function(req, res) {
  var message = req.params.message;

  var messageRequest = {
    type: 'text',
    text: message,
    role: 'appMaker',
    metadata: { lang: 'en-ca', items: 3 },
  };

  console.log(messageRequest);

  smooch.appUsers.sendMessage(appUserId, messageRequest).then(response => {
    res.send(response);
  });
});

// POST message with button by appMaker
app.get('/postmessage/message/:message/button/:buttonMessage', function(req, res) {
  var message = req.params.message;
  var buttonMessage = req.params.buttonMessage;

  messageRequest = {
    type: 'text',
    text: message,
    role: 'appMaker',
    metadata: { lang: 'en-ca', items: 3 },
    actions: [
      {
        type: 'link',
        text: buttonMessage,
        uri: 'http://example.com',
        metadata: { buttonId: 'vinegar' },
      },
    ],
  };
  console.log(messageRequest);

  smooch.appUsers.sendMessage(appUserId, messageRequest).then(response => {
    res.send(response);
  });
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, './build', 'index.html'));
});

server.listen(PORT, function() {
  console.log(`Server listening on port ${PORT}`);
});

io.on('connection', function(socket) {
  socket.emit('Socket ready', console.log('Socket ready'));
});
