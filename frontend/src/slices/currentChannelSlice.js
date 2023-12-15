import { createSlice } from '@reduxjs/toolkit';

const currentChannelSlice = createSlice({
  name: 'currentChannel',
  initialState: null,
  reducers: {
    setCurrentChannel: (state, action) => action.payload,
  },
});

export const { setCurrentChannel } = currentChannelSlice.actions;

export default currentChannelSlice.reducer;
