import openSocket from 'socket.io-client';

const socket = openSocket(process.env.API_URL);

export function subscribeToMessagePayload(callback) {
  socket.on('message', data => {
    callback(data);
    console.log('#####', data);
  });
}
