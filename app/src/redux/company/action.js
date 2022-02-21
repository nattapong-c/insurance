import * as API from './api';
import * as TYPE from './type';

export const createCompanyAction = (data) => async (dispatch) => {  
    if (data?.clear) {
        dispatch({ type: TYPE.COMPANY_CREATE_CLEAR });
        return;
    }
    dispatch({ type: TYPE.COMPANY_CREATE_REQ });
    try {
        const response = await API.createCompany(data);
        dispatch({ type: TYPE.COMPANY_CREATE_SUCCESS, payload: response.data });
    } catch (err) {
        dispatch({ type: TYPE.COMPANY_CREATE_FAIL, payload: err.response.data.error });
    }
};

export const getCompanyListAction = (params) => async (dispatch) => {
    dispatch({ type: TYPE.COMPANY_GET_LIST_REQ });
    try {
        const response = await API.getCompanyList(params);
        dispatch({ type: TYPE.COMPANY_GET_LIST_SUCCESS, payload: response.data });
    } catch (err) {
        dispatch({ type: TYPE.COMPANY_GET_LIST_FAIL, payload: err.response.data.error });
    }
};

export const deleteCompanyAction = (data) => async (dispatch) => {  
    if (data?.clear) {
        dispatch({ type: TYPE.COMPANY_DELETE_CLEAR });
        return;
    }
    dispatch({ type: TYPE.COMPANY_DELETE_REQ });
    try {
        const response = await API.deleteCompanyList(data);
        dispatch({ type: TYPE.COMPANY_DELETE_SUCCESS, payload: response.data });
    } catch (err) {
        dispatch({ type: TYPE.COMPANY_DELETE_FAIL, payload: err.response.data.error });
    }
};

export const updateCompanyAction = (id, data) => async (dispatch) => {  
    if (data?.clear) {
        dispatch({ type: TYPE.COMPANY_UPDATE_CLEAR });
        return;
    }
    dispatch({ type: TYPE.COMPANY_UPDATE_REQ });
    try {
        const response = await API.updateCompany(id, data);
        dispatch({ type: TYPE.COMPANY_UPDATE_SUCCESS, payload: response.data });
    } catch (err) {
        dispatch({ type: TYPE.COMPANY_UPDATE_FAIL, payload: err.response.data.error });
    }
};