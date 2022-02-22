import * as API from './api';
import * as TYPE from './type';

export const createInvoiceAction = (data) => async (dispatch) => {
    if (data?.clear) {
        dispatch({ type: TYPE.INVOICE_CREATE_CLEAR });
        return;
    }
    dispatch({ type: TYPE.INVOICE_CREATE_REQ });
    try {
        const response = await API.createInvoice(data);
        dispatch({ type: TYPE.INVOICE_CREATE_SUCCESS, payload: response.data });
    } catch (err) {
        dispatch({ type: TYPE.INVOICE_CREATE_FAIL, payload: err.response.data.error });
    }
};

export const getInvoiceListAction = (params) => async (dispatch) => {
    dispatch({ type: TYPE.INVOICE_GET_LIST_REQ });
    try {
        const response = await API.getInvoiceList(params);
        dispatch({ type: TYPE.INVOICE_GET_LIST_SUCCESS, payload: response.data });
    } catch (err) {
        dispatch({ type: TYPE.INVOICE_GET_LIST_FAIL, payload: err.response.data.error });
    }
};

export const deleteInvoiceAction = (data) => async (dispatch) => {
    if (data?.clear) {
        dispatch({ type: TYPE.INVOICE_UPDATE_CLEAR });
        return;
    }
    dispatch({ type: TYPE.INVOICE_UPDATE_REQ });
    try {
        const response = await API.deleteInvoiceList(data);
        dispatch({ type: TYPE.INVOICE_UPDATE_SUCCESS, payload: response.data });
    } catch (err) {
        dispatch({ type: TYPE.INVOICE_UPDATE_FAIL, payload: err.response.data.error });
    }
};

export const getLatestInvoiceAction = () => async (dispatch) => {
    dispatch({ type: TYPE.INVOICE_GET_LATEST_REQ });
    try {
        const response = await API.getLatestInvoice();
        dispatch({ type: TYPE.INVOICE_GET_LATEST_SUCCESS, payload: response.data });
    } catch (err) {
        dispatch({ type: TYPE.INVOICE_GET_LATEST_FAIL, payload: err.response.data.error });
    }
};