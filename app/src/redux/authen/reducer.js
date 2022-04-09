import * as TYPE from './type';

const initLogin = {
    loading: false,
    error: null,
    done: false,
    info: null,
    is_login: false
};

export const loginReducer = (state = initLogin, { type, payload }) => {
    switch (type) {
        case TYPE.AUTHEN_LOGIN_REQ:
            return { ...state, loading: true, done: false };
        case TYPE.AUTHEN_LOGIN_SUCCESS:
            return { ...state, loading: false, error: null, info: payload.data, done: true, is_login: true };
        case TYPE.AUTHEN_LOGIN_FAIL:
            return { ...state, loading: false, error: payload, done: true, is_login: false };
        default:
            return state;
    }
};

const initCurrent = {
    loading: false,
    error: null,
    done: false,
    info: null
};

export const currentReducer = (state = initCurrent, { type, payload }) => {
    switch (type) {
        case TYPE.AUTHEN_GET_CURRENT_REQ:
            return { ...state, loading: true, done: false };
        case TYPE.AUTHEN_GET_CURRENT_SUCCESS:
            return { ...state, loading: false, error: null, info: payload.data, done: true };
        case TYPE.AUTHEN_GET_CURRENT_FAIL:
            return { ...state, loading: false, error: payload, done: true, info: null };
        case TYPE.AUTHEN_GET_CURRENT_CLEAR:
            return { ...state, done: false };
        default:
            return state;
    }
};
