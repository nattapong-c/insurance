import * as API from './api';
import * as TYPE from './type';

export const login = (data) => async (dispatch) => {
    dispatch({ type: TYPE.AUTHEN_LOGIN_REQ });
    try {
        const response = await API.login(data);
        dispatch({ type: TYPE.AUTHEN_LOGIN_SUCCESS, payload: response.data });
    } catch (err) {
        dispatch({ type: TYPE.AUTHEN_LOGIN_FAIL, payload: err.message ? err.message : err.response.data.error });
    }
};

export const current = (data) => async (dispatch) => {
    if (data?.clear) {
        dispatch({ type: TYPE.AUTHEN_GET_CURRENT_CLEAR });
    } else {
        dispatch({ type: TYPE.AUTHEN_GET_CURRENT_REQ });
        try {
            const response = await API.current();
            dispatch({ type: TYPE.AUTHEN_GET_CURRENT_SUCCESS, payload: response.data });
        } catch (err) {
            dispatch({ type: TYPE.AUTHEN_GET_CURRENT_FAIL, payload: err.response.data.error });
        }
    }
};
