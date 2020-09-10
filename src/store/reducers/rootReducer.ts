import { combineReducers } from 'redux';
import mapReducer from './Map';
import UIReducer from './UI';
import covid19DataReducer from './Covid19Data';

export default combineReducers({
    map: mapReducer,
    UI: UIReducer,
    covid19Data: covid19DataReducer
});