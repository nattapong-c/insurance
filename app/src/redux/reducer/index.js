import { combineReducers } from 'redux';
import { createCompanyReducer, getCompanyListReducer, deleteCompanyReducer, updateCompanyReducer } from '../company/reducer';
import { createCustomerReducer, getCustomerListReducer, deleteCustomerReducer, updateCustomerReducer } from '../customer/reducer';

const appReducer = combineReducers({
    company: combineReducers({
        create: createCompanyReducer,
        delete: deleteCompanyReducer,
        list: getCompanyListReducer,
        update: updateCompanyReducer
    }),
    customer: combineReducers({
        create: createCustomerReducer,
        delete: deleteCustomerReducer,
        list: getCustomerListReducer,
        update: updateCustomerReducer
    })
});

const rootReducer = (state, action) => {
    return appReducer(state, action);
};

export default rootReducer;