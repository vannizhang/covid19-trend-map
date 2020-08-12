import { combineReducers } from 'redux';
import mapReducer from './Map';
import UIReducer from './UI';

export default combineReducers({
    map: mapReducer,
    UI: UIReducer
});