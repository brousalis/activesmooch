# ActiveCampaign + Smooch.io

This proof of concept uses the [smooch-core](https://github.com/smooch/smooch-core-js) (server API) and [smooch](https://www.npmjs.com/package/smooch) (client API) packages to integrate an operator chat window with ActiveCampaign and the Smooch.io chat API.

Uses Node with [express](https://expressjs.com/) for the server, and React (with [create-react-app](https://github.com/facebook/create-react-app)) for the client.

## Setup

```
npm install
```

For convenience sake, I've committed my `.env` file with the sandbox application keys (ew). You should have the following set in the environment:

```
REACT_APP_SMOOCH_KEY_ID=
REACT_APP_SMOOCH_SECRET=
REACT_APP_SMOOCH_ID=
AC_API_URL=
AC_API_KEY=
```

(`REACT_APP` prefixes get interpolated into the JS bundle)

## Run locally

To start both app servers, run:

```
npm run dev
```

and visit: http://localhost:3000

---

To start just the API server:

```
npm start
```

To start the client app:

```
npm run client
```
