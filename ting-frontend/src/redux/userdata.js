import { configureStore, createSlice } from '@reduxjs/toolkit';

export let userdataReducer = createSlice({
  name : 'userdataReducer',
  initialState:{ userdata:{} },
  reducers : {
    getCurrentUserdata: (state, action) => {
      state.userdata = action.payload;
    }
  }
})

export let { getCurrentUserdata } = userdataReducer.actions;

export default userdataReducer