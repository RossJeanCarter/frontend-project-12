import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './slices/channelsSlice';
import currentChannelReducer from './slices/currentChannelSlice';
import messagesReducer from './slices/messagesSlice';

export default configureStore({
  reducer: {
    channels: channelsReducer,
    currentChannel: currentChannelReducer,
    messages: messagesReducer,
  },
});
