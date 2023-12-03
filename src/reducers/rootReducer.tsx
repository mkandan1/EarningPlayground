import { combineReducers } from 'redux';
import userReducer from './userReducer';
import loadingReducer from './loadingReducer';

const rootReducer = combineReducers({
  userReducer, 
  loadingReducer,
});

export default rootReducer;