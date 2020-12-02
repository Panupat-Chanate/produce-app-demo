import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Apps from './App2';
import * as serviceWorker from './serviceWorker';
import {createStore} from 'redux';
import commentReducer from './test/commentReducer'
import { Provider } from 'react-redux';

const store = createStore(commentReducer);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Apps />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
