import { combineReducers } from "redux";
import signupReducer from "./signup";

const rootReducer = combineReducers({
  signupReducer,
});

export default rootReducer;