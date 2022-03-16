import * as API from './api';
import * as TYPE from './type';

export const createQuotationAction = (data) => async (dispatch) => {
    if (data?.clear) {
        dispatch({ type: TYPE.QUOTATION_CREATE_CLEAR });
        return;
    }
    dispatch({ type: TYPE.QUOTATION_CREATE_REQ });
    try {
        const response = await API.createQuotation(data);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `month-year.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        dispatch({ type: TYPE.QUOTATION_CREATE_SUCCESS, payload: response.data });
    } catch (err) {
        dispatch({ type: TYPE.QUOTATION_CREATE_FAIL, payload: err.response.data.error });
    }
};

export const getListQuotationAction = (params) => async (dispatch) => {
    dispatch({ type: TYPE.QUOTATION_GET_LIST_REQ });
    try {
        const response = await API.getQuotationList(params);
        dispatch({ type: TYPE.QUOTATION_GET_LIST_SUCCESS, payload: response.data });
    } catch (err) {
        dispatch({ type: TYPE.QUOTATION_GET_LIST_FAIL, payload: err.response.data.error });
    }
}