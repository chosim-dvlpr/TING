import { combineReducers } from "redux";
import userReducer from "./signup";

const rootReducer = combineReducers({
  userReducer,
});

export default rootReducer;