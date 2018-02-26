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

const smooch = new Smooch({
  keyId: KEY_ID,
  secret: SECRET,
  scope: 'app',
});

// express server
const app = express();
const server = require('http').Server(app);
app.use(express.static(path.resolve(__dirname, './build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

app.get('/api/user/:userId', (req, res) => {
  const userId = req.params.userId;
  if (!userId) return;
  smooch.appUsers
    .get(userId)
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

app.post('/api/message', (req, res) => {
  const message = req.body.message;
  const userId = req.body.userId;
  if (!userId) return;
  const request = {
    type: 'text',
    text: message,
    avatarUrl:
      'https://pbs.twimg.com/profile_images/1718704725/shay_400x400.jpg',
    name: 'Shay',
    role: 'appMaker',
    metadata: { lang: 'en-ca', items: 3 },
  };
  smooch.appUsers.sendMessage(userId, request).then(response => {
    res.send(response);
  });
});

app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, './build', 'index.html'));
});

server.listen(PORT, function() {
  console.log(`Server listening on port ${PORT}`);
});
