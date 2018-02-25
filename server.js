const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Smooch = require('smooch-core');
const cors = require('cors');

dotenv.config();
dotenv.load();

const PORT = process.env.PORT || 5000;
const KEY_ID = process.env.REACT_APP_SMOOCH_KEY_ID;
const SECRET = process.env.REACT_APP_SMOOCH_SECRET;
const APP_ID = process.env.REACT_APP_SMOOCH_ID;

// express server
const app = express();
app.use(express.static(path.resolve(__dirname, '../build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

// http server
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  pingInterval: 10000,
  transports: ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling', 'polling'],
});
io.origins(['localhost:3000', 'localhost:5000', 'https://activesmooch.herokuapp.com']);

const smooch = new Smooch({
  keyId: KEY_ID,
  secret: SECRET,
  scope: 'app',
});

// need to pay for smooch to extend this functionality
let appUserId = '42ef69a21a6136b0a30974f8';

// api
app.post('/messages', (req, res) => {
  if (req.body.trigger === 'message:appUser') {
    console.log(req.body);
    const messagePayload = JSON.stringify(req.body, null, 4);
    appUserId = req.body.appUser._id;
    io.emit('message', messagePayload);
    res.sendStatus(200);
  }
});

app.put('/user', (req, res) => {
  smooch.appUsers.update(appUserId, req.body).then(response => {
    res.send(response);
  });
});

app.get('/user', (req, res) => {
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
});

app.post('/message', (req, res) => {
  const message = req.body.message;
  const request = {
    type: 'text',
    text: message,
    role: 'appMaker',
    metadata: { lang: 'en-ca', items: 3 },
  };
  smooch.appUsers.sendMessage(appUserId, request).then(response => {
    res.send(response);
  });
});

app.post('/message/button', (req, res) => {
  const message = req.params.message;
  const buttonMessage = req.params.buttonMessage;
  const request = {
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
  smooch.appUsers.sendMessage(appUserId, request).then(response => {
    res.send(response);
  });
});

app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, './build', 'index.html'));
});

server.listen(PORT, function() {
  console.log(`Server listening on port ${PORT}`);
});

io.on('connection', function(socket) {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});
