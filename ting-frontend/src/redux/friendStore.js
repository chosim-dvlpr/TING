import { configureStore, createSlice } from "@reduxjs/toolkit";

export let friendReducer = createSlice({
  name: "friendReducer",
  initialState: { friendId: null },
  reducers: {
    getFriendId: (state, action) => {
      state.friendId = action.payload;
    },
    // logout: (state) => {
    //   state.userdata = null;
    // },
  },
});

export let { getFriendId } = friendReducer.actions;

export default friendReducer;
