// React
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

// Redux
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './reducers';

// Styles
import './resources/styles/index.css';
import './index.scss';

import App from './App';

// const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const baseUrl = "/";
const rootElement = document.getElementById('root');

const store = createStore(rootReducer);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter basename={baseUrl}>
            <App />
        </BrowserRouter>
    </Provider>,
    rootElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
