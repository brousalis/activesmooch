import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_API_URL);

export function subscribeToMessagePayload(callback) {
  socket.on('message', data => {
    callback(data);
    console.log('#####', data);
  });
}
