// import { combineReducers } from "redux";
// import signupReducer from "./signup";
import { configureStore } from "@reduxjs/toolkit";
import signupSlice from "./signup";
// const rootReducer = combineReducers({
//   signupReducer: signupSlice.reducer,
// });

export default configureStore({
  reducer: {
      signupReducer : signupSlice.reducer,
  }
}) 

// export default rootReducer;