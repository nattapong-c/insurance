import * as TYPE from './type';

const initCustomerInfo = {
    loading: false,
    error: null,
    done: false,
    info: null
};

export const createCustomerReducer = (state = initCustomerInfo, { type, payload }) => {
    switch (type) {
        case TYPE.CUSTOMER_CREATE_REQ:
            return { ...state, loading: true, done: false }
        case TYPE.CUSTOMER_CREATE_SUCCESS:
            return { ...state, loading: false, error: null, info: payload.data, done: true }
        case TYPE.CUSTOMER_CREATE_FAIL:
            return { ...state, loading: false, error: payload, done: true }
        case TYPE.CUSTOMER_CREATE_CLEAR:
            return state;
        default:
            return state;
    }
}

const initCustomerList = {
    customerList: [],
    totalItem: 0,
    loading: false,
    error: null
};

export const getCustomerListReducer = (state = initCustomerList, { type, payload }) => {
    switch (type) {
        case TYPE.CUSTOMER_GET_LIST_REQ:
            return { ...state, loading: true }
        case TYPE.CUSTOMER_GET_LIST_SUCCESS:
            return { ...state, loading: false, error: null, customerList: payload.data, totalItem: payload.total_item }
        case TYPE.CUSTOMER_GET_LIST_FAIL:
            return { ...state, loading: false, error: payload }
        default:
            return state;
    }
}


const initDeleteCustomerList = {
    customerList: [],
    loading: false,
    error: null,
    done: false
};

export const deleteCustomerReducer = (state = initDeleteCustomerList, { type, payload }) => {
    switch (type) {
        case TYPE.CUSTOMER_DELETE_REQ:
            return { ...state, loading: true, done: false }
        case TYPE.CUSTOMER_DELETE_SUCCESS:
            return { ...state, loading: false, error: null, customerList: payload.data, done: true }
        case TYPE.CUSTOMER_DELETE_FAIL:
            return { ...state, loading: false, error: payload, done: true }
        case TYPE.CUSTOMER_DELETE_CLEAR:
            return state
        default:
            return state;
    }
}

const initUpdateCustomer = {
    customer: null,
    loading: false,
    error: null,
    done: false
};

export const updateCustomerReducer = (state = initUpdateCustomer, { type, payload }) => {
    switch (type) {
        case TYPE.CUSTOMER_UPDATE_REQ:
            return { ...state, loading: true, done: false }
        case TYPE.CUSTOMER_UPDATE_SUCCESS:
            return { ...state, loading: false, error: null, customer: payload.data, done: true }
        case TYPE.CUSTOMER_UPDATE_FAIL:
            return { ...state, loading: false, error: payload, done: true }
        case TYPE.CUSTOMER_UPDATE_CLEAR:
            return state
        default:
            return state;
    }
}