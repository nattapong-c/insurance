import * as API from './api';
import * as TYPE from './type';

export const createCustomerAction = (data) => async (dispatch) => {  
    if (data?.clear) {
        dispatch({ type: TYPE.CUSTOMER_CREATE_CLEAR });
        return;
    }
    dispatch({ type: TYPE.CUSTOMER_CREATE_REQ });
    try {
        const response = await API.createCustomer(data);
        dispatch({ type: TYPE.CUSTOMER_CREATE_SUCCESS, payload: response.data });
    } catch (err) {
        dispatch({ type: TYPE.CUSTOMER_CREATE_FAIL, payload: err.response.data.error });
    }
};

export const getCustomerListAction = () => async (dispatch) => {
    dispatch({ type: TYPE.CUSTOMER_GET_LIST_REQ });
    try {
        const response = await API.getCustomerList();
        dispatch({ type: TYPE.CUSTOMER_GET_LIST_SUCCESS, payload: response.data });
    } catch (err) {
        dispatch({ type: TYPE.CUSTOMER_GET_LIST_FAIL, payload: err.response.data.error });
    }
};

export const deleteCustomerAction = (data) => async (dispatch) => {  
    if (data?.clear) {
        dispatch({ type: TYPE.CUSTOMER_DELETE_CLEAR });
        return;
    }
    dispatch({ type: TYPE.CUSTOMER_DELETE_REQ });
    try {
        const response = await API.deleteCustomerList(data);
        dispatch({ type: TYPE.CUSTOMER_DELETE_SUCCESS, payload: response.data });
    } catch (err) {
        dispatch({ type: TYPE.CUSTOMER_DELETE_FAIL, payload: err.response.data.error });
    }
};

export const updateCustomerAction = (id, data) => async (dispatch) => {  
    if (data?.clear) {
        dispatch({ type: TYPE.CUSTOMER_UPDATE_CLEAR });
        return;
    }
    dispatch({ type: TYPE.CUSTOMER_UPDATE_REQ });
    try {
        const response = await API.updateCustomer(id, data);
        dispatch({ type: TYPE.CUSTOMER_UPDATE_SUCCESS, payload: response.data });
    } catch (err) {
        dispatch({ type: TYPE.CUSTOMER_UPDATE_FAIL, payload: err.response.data.error });
    }
};