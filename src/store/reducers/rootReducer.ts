import { combineReducers } from 'redux';
import map from './Map';
import UI from './UI';
import covid19Data from './Covid19Data';

export default combineReducers({ map, UI, covid19Data });
