import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'; // redux-persist의 PersistGate를 추가합니다.
import store, { persistor } from './redux/store'; // 스토어와 persistor를 import 합니다.

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  // </React.StrictMode>
);

reportWebVitals();
