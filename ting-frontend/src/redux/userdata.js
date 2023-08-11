import { configureStore, createSlice } from "@reduxjs/toolkit";

export let userdataReducer = createSlice({
  name: "userdataReducer",
  initialState: { userdata: null },
  reducers: {
    getCurrentUserdata: (state, action) => {
      state.userdata = action.payload;
    },
    logout: (state) => {
      state.userdata = null;
    },
  },
});

export let { getCurrentUserdata, logout } = userdataReducer.actions;

export default userdataReducer;
