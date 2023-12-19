/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const channelsSlice = createSlice({
  name: 'channels',
  initialState: [],
  reducers: {
    setChannels: (state, action) => action.payload,
    addChannel: (state, action) => {
      state.push(action.payload);
    },
    removeChannel: (state, action) => {
      const channelIdToRemove = action.payload;
      return state.filter((channel) => channel.id !== channelIdToRemove);
    },
  },
});

export const { setChannels, addChannel, removeChannel } = channelsSlice.actions;

export default channelsSlice.reducer;
