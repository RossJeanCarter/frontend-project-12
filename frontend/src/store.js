import { configureStore } from '@reduxjs/toolkit';
import channelsReducer, { handleSocketEvents } from './slices/channelsSlice';
import currentChannelReducer from './slices/currentChannelSlice';
import messagesReducer from './slices/messagesSlice';

export default configureStore({
  reducer: {
    channels: channelsReducer,
    currentChannel: currentChannelReducer,
    messages: messagesReducer,
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(handleSocketEvents()),
});
