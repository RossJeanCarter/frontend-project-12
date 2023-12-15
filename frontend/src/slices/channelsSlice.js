import { createSlice } from '@reduxjs/toolkit';

const channelsSlice = createSlice({
  name: 'channels',
  initialState: [],
  reducers: {
    // setChannels(['channel1', 'channel2', 'channel3'])-наполняется массив
    setChannels: (state, action) => action.payload,
  },
});

export const { setChannels } = channelsSlice.actions;

export default channelsSlice.reducer;
