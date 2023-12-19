/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { removeChannel } from './channelsSlice.js';

const messagesSlice = createSlice({
  name: 'messages',
  initialState: [],
  reducers: {
    setMessages: (state, action) => action.payload,
    addMessage: (state, action) => {
      state.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(removeChannel, (state, action) => {
      const id = action.payload;
      return state.filter((message) => message.channelId !== id);
    });
  },
});

export const { setMessages, addMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
