import { combineReducers } from "@reduxjs/toolkit";
import signupReducer from "./signup";
import userdataReducer from "./userdata.js";
import openviduReducer from "./openviduStore.js";
import matchingReducer from "./matchingStore.js";
import itemReducer from "./itemStore.js";
import finalMatchingReducer from "./finalMatchingStore";

import storage from 'redux-persist/lib/storage';
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { persistReducer } from 'redux-persist';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import persistStore from "redux-persist/es/persistStore";
import friendReducer from "./friendStore";
// import thunk from "redux-thunk";

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  signupReducer: signupReducer.reducer,
  userdataReducer: userdataReducer.reducer,
  openviduReducer: openviduReducer.reducer,
  matchingReducer: matchingReducer.reducer,
  itemReducer: itemReducer.reducer,
  friendReducer: friendReducer.reducer,
  finalMatchingReducer: finalMatchingReducer.reducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    },
  }),
});

// persistor를 export 합니다.
export const persistor = persistStore(store);

export default store;
