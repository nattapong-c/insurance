import * as API from './api';
import * as TYPE from './type';

export const createCompanyAction = (data) => async (dispatch) => {
    dispatch({ type: TYPE.COMPANY_CREATE_REQ });
    try {
        const response = await API.createCompany(data);
        dispatch({ type: TYPE.COMPANY_CREATE_SUCCESS, payload: response.data });
    } catch (err) {
        dispatch({ type: TYPE.COMPANY_CREATE_FAIL, payload: err.response.data.error });
    }
};

export const getCompanyListAction = () => async (dispatch) => {
    dispatch({ type: TYPE.COMPANY_GET_LIST_REQ });
    try {
        const response = await API.getCompanyList();
        dispatch({ type: TYPE.COMPANY_GET_LIST_SUCCESS, payload: response.data });
    } catch (err) {
        dispatch({ type: TYPE.COMPANY_GET_LIST_FAIL, payload: err.response.data.error });
    }
};