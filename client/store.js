import redux, { createStore, applyMiddleware } from 'redux';
import loggerMiddleware from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import axios from 'axios';
import socket from './socket';

const GOT_MESSAGES_FROM_SERVER = 'GOT_MESSAGES_FROM_SERVER';
const GOT_NEW_MESSAGES_FROM_SERVER = 'GOT_NEW_MESSAGES_FROM_SERVER';
const WRITE_MESSAGE = 'WRITE_MESSAGE';
const logger = applyMiddleware(loggerMiddleware, thunkMiddleware);
export const gotMessagesFromServer = messages => {
  return {
    type: GOT_MESSAGES_FROM_SERVER,
    messages,
  };
};
export const gotNewMessagesFromServer = messages => {
  return{
    type: GOT_NEW_MESSAGES_FROM_SERVER,
    messages
  }
}
export const writeMessage = newMessageEntry => {
  return {
    type: WRITE_MESSAGE,
    newMessageEntry
  }
}

export const fetchMessages = () => {
  return (dispatch) => {
    axios
    .get('/api/messages')
    .then(res => res.data)
    .then(messages => {
      const action = gotMessagesFromServer(messages);
      dispatch(action);
    })
    .catch(console.error);
  }
}

export const postMessages = (content, channelId) => {
  return (dispatch) => {
    axios
    .post('/api/messages', {
        content: content,
        channelId: channelId
    })
    .then(result => {
      const action1 = gotNewMessagesFromServer(result.data);
      const action2 = writeMessage('');
      dispatch(action1);
      dispatch(action2);
      socket.emit('new-message', result.data);
    });
  }
}

const initialState = {
  messages: [],
  newMessageEntry: ''
};
const reducer = (prevState = initialState, action) => {
  const newState = Object.assign({}, prevState);
  switch (action.type) {
    case GOT_MESSAGES_FROM_SERVER:
      newState.messages = action.messages;
      return newState;
    case GOT_NEW_MESSAGES_FROM_SERVER:
      newState.messages = newState.messages.concat(action.messages);
      return newState;
      //return {...state, messages:[...prevState.messages, action.message]}
    case WRITE_MESSAGE:
      newState.newMessageEntry = action.newMessageEntry;
      return newState;
      //return {...state, newMessageEntry: action.newMessageEntry}
    default:
      return prevState;
  }
};

const store = createStore(reducer, logger);

export default store;
