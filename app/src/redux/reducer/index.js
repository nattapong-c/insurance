import { combineReducers } from 'redux';
import { createCompanyReducer, getCompanyListReducer, deleteCompanyReducer, updateCompanyReducer } from '../company/reducer';
import { createCustomerReducer, getCustomerListReducer, deleteCustomerReducer, updateCustomerReducer } from '../customer/reducer';
import { getInvoiceListReducer, getLatestInvoiceReducer, createInvoiceReducer, deleteInvoiceReducer, exportInvoiceReducer } from '../invoice/reducer';
import { getCompanyInfoReducer, getCustomerInfoReducer, getInvoiceInfoReducer } from '../dashboard/reducer';
import { createQuotationReducer, getQuotationListReducer } from '../quotation/reducer';

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
    }),
    invoice: combineReducers({
        create: createInvoiceReducer,
        delete: deleteInvoiceReducer,
        list: getInvoiceListReducer,
        latest: getLatestInvoiceReducer,
        export: exportInvoiceReducer
    }),
    dashboard: combineReducers({
        company: getCompanyInfoReducer,
        customer: getCustomerInfoReducer,
        invoice: getInvoiceInfoReducer,
    }),
    quotation: combineReducers({
        create: createQuotationReducer,
        list: getQuotationListReducer,
    }),
});

const rootReducer = (state, action) => {
    return appReducer(state, action);
};

export default rootReducer;