import './styles/index.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { setDefaultOptions } from 'esri-loader';

import App from './components/App/App';

setDefaultOptions({ url: 'https://js.arcgis.com/next/'})

ReactDOM.render(
    <App/>, 
    document.getElementById('root')
);