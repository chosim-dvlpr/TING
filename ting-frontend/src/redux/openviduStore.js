import { configureStore, createSlice } from '@reduxjs/toolkit';

export let openviduReducer = createSlice({
  name : 'openviduReducer',
  initialState:{ token:null },
  reducers : {
    setOpenviduToken: (state, action) => {
      state.token = action.payload
      console.log("++++++++++++++ Redux OpenviduToken 저장 +++++++++++++++")
      console.log(state.token)
    }
  }
})

export let { setOpenviduToken } = openviduReducer.actions;

export default openviduReducer