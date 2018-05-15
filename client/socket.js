import io from 'socket.io-client';
import store, {gotNewMessagesFromServer, writeMessage} from './store';

const socket = io(window.location.origin);

socket.on('connect', () => {
  console.log('I am now connected to the server!');

  socket.on('new-message', (message) => {
    const action1 = gotNewMessagesFromServer(message);
    const action2 = writeMessage('');
    store.dispatch(action1);
    store.dispatch(action2);
  });
});

export default socket;
