import redux, { createStore } from 'redux';

const GOT_MESSAGES_FROM_SERVER = 'GOT_MESSAGES_FROM_SERVER';

export const gotMessagesFromServer = messages => {
  return {
    type: GOT_MESSAGES_FROM_SERVER,
    messages,
  };
};

const initialState = {
  messages: [],
};
const reducer = (prevState = initialState, action) => {
  const newState = Object.assign({}, prevState);
  switch (action.type) {
    case GOT_MESSAGES_FROM_SERVER:
      newState.messages = action.messages;
      return newState;
    default:
      return prevState;
  }
};

const store = createStore(reducer);

export default store;
