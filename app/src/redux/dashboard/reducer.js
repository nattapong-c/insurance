import * as TYPE from './type';

const initCompanyInfo = {
    loading: false,
    error: null,
    count: 0
};

export const getCompanyInfoReducer = (state = initCompanyInfo, { type, payload }) => {
    switch (type) {
        case TYPE.COMPANY_GET_GENERAL_INFO_REQ:
            return { ...state, loading: true }
        case TYPE.COMPANY_GET_GENERAL_INFO_SUCCESS:
            return { ...state, loading: false, error: null, count: payload.data.count }
        case TYPE.COMPANY_GET_GENERAL_INFO_FAIL:
            return { ...state, loading: false, error: payload }
        default:
            return state;
    }
};

const initCustomerInfo = {
    loading: false,
    error: null,
    count: 0
};

export const getCustomerInfoReducer = (state = initCustomerInfo, { type, payload }) => {
    switch (type) {
        case TYPE.CUSTOMER_GET_GENERAL_INFO_REQ:
            return { ...state, loading: true }
        case TYPE.CUSTOMER_GET_GENERAL_INFO_SUCCESS:
            return { ...state, loading: false, error: null, count: payload.data.count }
        case TYPE.CUSTOMER_GET_GENERAL_INFO_FAIL:
            return { ...state, loading: false, error: payload }
        default:
            return state;
    }
};


const initInvoiceInfo = {
    loading: false,
    error: null,
    count: 0,
    latest_number: 100
};

export const getInvoiceInfoReducer = (state = initInvoiceInfo, { type, payload }) => {
    switch (type) {
        case TYPE.INVOICE_GET_GENERAL_INFO_REQ:
            return { ...state, loading: true }
        case TYPE.INVOICE_GET_GENERAL_INFO_SUCCESS:
            return { ...state, loading: false, error: null, count: payload.data.count, latest_number: payload.data.latest_number }
        case TYPE.INVOICE_GET_GENERAL_INFO_FAIL:
            return { ...state, loading: false, error: payload }
        default:
            return state;
    }
};
