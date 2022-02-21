import * as TYPE from './type';

const initInfo = {
    loading: false,
    error: null,
    done: false,
    info: null
};

export const createInvoiceReducer = (state = initInfo, { type, payload }) => {
    switch (type) {
        case TYPE.INVOICE_CREATE_REQ:
            return { ...state, loading: true, done: false }
        case TYPE.INVOICE_CREATE_SUCCESS:
            return { ...state, loading: false, error: null, info: payload.data, done: true }
        case TYPE.INVOICE_CREATE_FAIL:
            return { ...state, loading: false, error: payload, done: true }
        case TYPE.INVOICE_CREATE_CLEAR:
            return state;
        default:
            return state;
    }
}

const initList = {
    list: [],
    totalItem: 0,
    loading: false,
    error: null
};

export const getInvoiceListReducer = (state = initList, { type, payload }) => {
    switch (type) {
        case TYPE.INVOICE_GET_LIST_REQ:
            return { ...state, loading: true }
        case TYPE.INVOICE_GET_LIST_SUCCESS:
            return { ...state, loading: false, error: null, list: payload.data, totalItem: payload.total_item }
        case TYPE.INVOICE_GET_LIST_FAIL:
            return { ...state, loading: false, error: payload }
        default:
            return state;
    }
}

const initDeleteList = {
    list: [],
    loading: false,
    error: null,
    done: false
};

export const deleteInvoiceReducer = (state = initDeleteList, { type, payload }) => {
    switch (type) {
        case TYPE.INVOICE_DELETE_REQ:
            return { ...state, loading: true, done: false }
        case TYPE.INVOICE_DELETE_SUCCESS:
            return { ...state, loading: false, error: null, list: payload.data, done: true }
        case TYPE.INVOICE_DELETE_FAIL:
            return { ...state, loading: false, error: payload, done: true }
        case TYPE.INVOICE_DELETE_CLEAR:
            return state
        default:
            return state;
    }
}

const initLatestInfo = {
    info: null,
    loading: false,
    error: null
};

export const getLatestInvoiceReducer = (state = initLatestInfo, { type, payload }) => {
    switch (type) {
        case TYPE.INVOICE_GET_LATEST_REQ:
            return { ...state, loading: true }
        case TYPE.INVOICE_GET_LATEST_SUCCESS:
            return { ...state, loading: false, error: null, info: payload.data }
        case TYPE.INVOICE_GET_LATEST_FAIL:
            return { ...state, loading: false, error: payload }
        default:
            return state;
    }
}