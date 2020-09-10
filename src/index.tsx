import './styles/index.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { setDefaultOptions } from 'esri-loader';

import { Provider as ReduxProvider } from 'react-redux';
import store from './store/configureStore';
import App from './components/App/App';

setDefaultOptions({ url: 'https://js.arcgis.com/next/' });

ReactDOM.render(
    <ReduxProvider store={store}>
        <App />
    </ReduxProvider>,
    document.getElementById('root')
);
