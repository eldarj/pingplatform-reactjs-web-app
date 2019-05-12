// React
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
// Redux and redux-persist
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import getConfiguredStore from './redux/configureStore';
// Styles & JS
import './resources/styles/index.css';
import './index.scss';
import './resources/styles/extensions/microsoft-fabric-ui.scss';

import { initializeIcons } from '@uifabric/icons';
import { initializeFileTypeIcons } from '@uifabric/file-type-icons';
// Register icons and pull the fonts from the default SharePoint cdn.
import App from './App';

initializeIcons();
initializeFileTypeIcons();

// const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const baseUrl = "/";
const rootElement = document.getElementById('root');
const store = getConfiguredStore().store;
const persistor = getConfiguredStore().persistor;

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter basename={baseUrl}>
                <App />
            </BrowserRouter>
        </PersistGate>
    </Provider>,
    rootElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
