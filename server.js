const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Smooch = require('smooch-core');
const cors = require('cors');

dotenv.config();
dotenv.load();

const PORT = process.env.PORT || 5000;
const SMOOCH_KEY_ID = process.env.REACT_APP_SMOOCH_KEY_ID;
const SMOOCH_SECRET = process.env.REACT_APP_SMOOCH_SECRET;
const AC_API_URL = process.env.AC_API_URL;
const AC_API_KEY = process.env.AC_API_KEY;

const smooch = new Smooch({
  keyId: SMOOCH_KEY_ID,
  secret: SMOOCH_SECRET,
  scope: 'app',
});

// activecampaign api url
function acUrl(action) {
  return `${AC_API_URL}/admin/api.php?api_key=${AC_API_KEY}&api_output=json&api_action=${action}`;
}

// express server
const app = express();
const server = require('http').Server(app);
app.use(express.static(path.resolve(__dirname, './build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

// GET smooch appuser
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

// POST smooch message
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

// POST activecampaign email message
app.post('/api/campaign', (req, res) => {
  const message = req.body.message;
  const userId = req.body.userId;
  if (!userId) return;
  const request = {
    api_key: AC_API_KEY,
    api_action: 'message_add',
    api_output: 'json',
    subject: 'Smooch Chat Message',
    fromemail: 'test@example.com',
    fromname: 'Test Smooch',
    reply2: 'test@example.com',
    priority: '1',
    charset: 'utf8',
    encoding: 'quoted-printable',
    textconstructor: 'editor',
    text: message,
    'p[1]': '1',
  };

  fetch(acUrl('message_add'), {
    method: 'post',
    body: new URLSearchParams(new FormData(request)),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
    .then(res => {
      console.log(res);
    })
    .catch(err => [console.log('err', err)]);
});

app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, './build', 'index.html'));
});

server.listen(PORT, function() {
  console.log(`Server listening on port ${PORT}`);
});
