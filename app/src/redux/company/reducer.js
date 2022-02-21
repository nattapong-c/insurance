import * as TYPE from './type';

const initCompanyInfo = {
    loading: false,
    error: null,
    done: false,
    info: null
};

export const createCompanyReducer = (state = initCompanyInfo, { type, payload }) => {
    switch (type) {
        case TYPE.COMPANY_CREATE_REQ:
            return { ...state, loading: true, done: false }
        case TYPE.COMPANY_CREATE_SUCCESS:
            return { ...state, loading: false, error: null, info: payload.data, done: true }
        case TYPE.COMPANY_CREATE_FAIL:
            return { ...state, loading: false, error: payload, done: true }
        case TYPE.COMPANY_CREATE_CLEAR:
            return state;
        default:
            return state;
    }
}

const initCompanyList = {
    companyList: [],
    loading: false,
    error: null
};

export const getCompanyListReducer = (state = initCompanyList, { type, payload }) => {
    switch (type) {
        case TYPE.COMPANY_GET_LIST_REQ:
            return { ...state, loading: true }
        case TYPE.COMPANY_GET_LIST_SUCCESS:
            return { ...state, loading: false, error: null, companyList: payload.data }
        case TYPE.COMPANY_GET_LIST_FAIL:
            return { ...state, loading: false, error: payload }
        default:
            return state;
    }
}


const initDeleteCompanyList = {
    companyList: [],
    loading: false,
    error: null,
    done: false
};

export const deleteCompanyReducer = (state = initDeleteCompanyList, { type, payload }) => {
    switch (type) {
        case TYPE.COMPANY_DELETE_REQ:
            return { ...state, loading: true, done: false }
        case TYPE.COMPANY_DELETE_SUCCESS:
            return { ...state, loading: false, error: null, companyList: payload.data, done: true }
        case TYPE.COMPANY_DELETE_FAIL:
            return { ...state, loading: false, error: payload, done: true }
        case TYPE.COMPANY_DELETE_CLEAR:
            return state
        default:
            return state;
    }
}

const initUpdateCompany = {
    company: null,
    loading: false,
    error: null,
    done: false
};

export const updateCompanyReducer = (state = initUpdateCompany, { type, payload }) => {
    switch (type) {
        case TYPE.COMPANY_UPDATE_REQ:
            return { ...state, loading: true, done: false }
        case TYPE.COMPANY_UPDATE_SUCCESS:
            return { ...state, loading: false, error: null, company: payload.data, done: true }
        case TYPE.COMPANY_UPDATE_FAIL:
            return { ...state, loading: false, error: payload, done: true }
        case TYPE.COMPANY_UPDATE_CLEAR:
            return state
        default:
            return state;
    }
}