import * as TYPE from './type';

const initInfo = {
    loading: false,
    error: null,
    done: false,
    info: null
};

export const createQuotationReducer = (state = initInfo, { type, payload }) => {
    switch (type) {
        case TYPE.QUOTATION_CREATE_REQ:
            return { ...state, loading: true, done: false }
        case TYPE.QUOTATION_CREATE_SUCCESS:
            return { ...state, loading: false, error: null, info: payload.data, done: true }
        case TYPE.QUOTATION_CREATE_FAIL:
            return { ...state, loading: false, error: payload, done: true }
        case TYPE.QUOTATION_CREATE_CLEAR:
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

export const getQuotationListReducer = (state = initList, { type, payload }) => {
    switch (type) {
        case TYPE.QUOTATION_GET_LIST_REQ:
            return { ...state, loading: true }
        case TYPE.QUOTATION_GET_LIST_SUCCESS:
            return { ...state, loading: false, error: null, list: payload.data, totalItem: payload.total_item }
        case TYPE.QUOTATION_GET_LIST_FAIL:
            return { ...state, loading: false, error: payload }
        default:
            return state;
    }
}

const initExport = {
    loading: false,
    error: null
};

export const exportQuotationReducer = (state = initExport, { type, payload }) => {
    switch (type) {
        case TYPE.QUOTATION_EXPORT_REQ:
            return { ...state, loading: true }
        case TYPE.QUOTATION_EXPORT_SUCCESS:
            return { ...state, loading: false, error: null }
        case TYPE.QUOTATION_EXPORT_FAIL:
            return { ...state, loading: false, error: payload }
        default:
            return state;
    }
}

const initUpdate = {
    loading: false,
    error: null,
    done: false
};

export const updateQuotationReducer = (state = initUpdate, {type, payload}) => {
    switch (type) {
        case TYPE.QUOTATION_UPDATE_REQ:
            return { ...state, loading: true, done: false }
        case TYPE.QUOTATION_UPDATE_SUCCESS:
            return { ...state, loading: false, error: null, done: true }
        case TYPE.QUOTATION_UPDATE_FAIL:
            return { ...state, loading: false, error: payload, done: true }
        case TYPE.QUOTATION_UPDATE_CLEAR:
            return state;
        default:
            return state;
    }
}

const initDelete = {
    loading: false,
    error: null,
    done: false
};

export const deleteQuotationReducer = (state = initDelete, {type, payload}) => {
    switch (type) {
        case TYPE.QUOTATION_DELETE_REQ:
            return { ...state, loading: true, done: false }
        case TYPE.QUOTATION_DELETE_SUCCESS:
            return { ...state, loading: false, error: null, done: true }
        case TYPE.QUOTATION_DELETE_FAIL:
            return { ...state, loading: false, error: payload, done: true }
        case TYPE.QUOTATION_DELETE_CLEAR:
            return state;
        default:
            return state;
    }
}