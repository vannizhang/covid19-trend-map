import './styles/index.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { setDefaultOptions } from 'esri-loader';

import { Provider as ReduxProvider } from 'react-redux';
import configureAppStore from './store/configureStore';
import App from './components/App/App';
import AppContextProvider from './context/AppContextProvider';
import getPreloadedState from './utils/getPreloadedState';

// setDefaultOptions({ url: 'https://js.arcgis.com/next/' });

const preloadedState = getPreloadedState();
const store = configureAppStore(preloadedState);

ReactDOM.render(
    <ReduxProvider store={store}>
        <AppContextProvider>
            <App />
        </AppContextProvider>
    </ReduxProvider>,
    document.getElementById('root')
);
