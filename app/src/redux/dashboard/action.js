import * as API from './api';
import * as TYPE from './type';

export const getCompanyGeneralInfoAction = () => async (dispatch) => {
    dispatch({ type: TYPE.COMPANY_GET_GENERAL_INFO_REQ });
    try {
        const response = await API.getCompanyGeneralInfo();
        dispatch({ type: TYPE.COMPANY_GET_GENERAL_INFO_SUCCESS, payload: response.data });
    } catch (err) {
        dispatch({ type: TYPE.COMPANY_GET_GENERAL_INFO_FAIL, payload: err.response.data.error });
    }
};

export const getCustomerGeneralInfoAction = () => async (dispatch) => {
    dispatch({ type: TYPE.CUSTOMER_GET_GENERAL_INFO_REQ });
    try {
        const response = await API.getCustomerGeneralInfo();
        dispatch({ type: TYPE.CUSTOMER_GET_GENERAL_INFO_SUCCESS, payload: response.data });
    } catch (err) {
        dispatch({ type: TYPE.CUSTOMER_GET_GENERAL_INFO_FAIL, payload: err.response.data.error });
    }
};

export const getInvoiceGeneralInfoAction = () => async (dispatch) => {
    dispatch({ type: TYPE.INVOICE_GET_GENERAL_INFO_REQ });
    try {
        const response = await API.getInvoiceGeneralInfo();
        dispatch({ type: TYPE.INVOICE_GET_GENERAL_INFO_SUCCESS, payload: response.data });
    } catch (err) {
        dispatch({ type: TYPE.INVOICE_GET_GENERAL_INFO_FAIL, payload: err.response.data.error });
    }
};