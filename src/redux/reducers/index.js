import { combineReducers } from 'redux';

import changeStatus from './usersReducer';

const rootReducer = combineReducers({ 
    changeStatus 
});

export default rootReducer;