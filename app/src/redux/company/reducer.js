import * as TYPE from './type';

const initCompanyInfo = {
    loading: false,
    error: null,
    newCompany: null
};

export const createCompanyReducer = (state = initCompanyInfo, { type, payload }) => {
    switch (type) {
        case TYPE.COMPANY_CREATE_REQ:
            return { ...state, loading: true }
        case TYPE.COMPANY_CREATE_SUCCESS:
            return { ...state, loading: false, error: null, companyList: payload.data }
        case TYPE.COMPANY_CREATE_FAIL:
            return { ...state, loading: false, error: payload }
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
