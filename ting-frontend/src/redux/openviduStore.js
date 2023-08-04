import { configureStore, createSlice } from '@reduxjs/toolkit';

export let openviduReducer = createSlice({
  name : 'openviduReducer',
  initialState:{ token:null },
  reducers : {
    setOpenviduToken: (state, action) => {
      state.token = action.payload
    }
  }
})

export let { setOpenviduToken } = openviduReducer.actions;

export default openviduReducer