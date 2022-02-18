import { combineReducers } from 'redux';
import { createCompanyReducer, getCompanyListReducer, deleteCompanyReducer, updateCompanyReducer } from '../company/reducer';

const appReducer = combineReducers({
    company: combineReducers({
        create: createCompanyReducer,
        delete: deleteCompanyReducer,
        list: getCompanyListReducer,
        update: updateCompanyReducer
    })
});

const rootReducer = (state, action) => {
    return appReducer(state, action);
};

export default rootReducer;