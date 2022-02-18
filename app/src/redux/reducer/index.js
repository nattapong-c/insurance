import { combineReducers } from 'redux';
import { createCompanyReducer, getCompanyListReducer } from '../company/reducer';

const appReducer = combineReducers({
    company: combineReducers({
        create: createCompanyReducer,
        list: getCompanyListReducer
    })
});

const rootReducer = (state, action) => {
    return appReducer(state, action);
};

export default rootReducer;