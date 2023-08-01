// import { combineReducers } from "redux";
// import signupReducer from "./signup";
import { configureStore } from "@reduxjs/toolkit";
import signupSlice from "./signup";
// const rootReducer = combineReducers({
//   signupReducer: signupSlice.reducer,
// });
import userdataSlice from "./userdata.js";
import openviduSlice from "./openviduStore.js"

export default configureStore({
  reducer: {
      signupReducer : signupSlice.reducer,
      userdataReducer : userdataSlice.reducer, 
      openviduReducer : openviduSlice.reducer,
  }
}) 

// export default rootReducer;