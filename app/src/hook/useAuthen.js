import { useDispatch, useSelector } from 'react-redux';
import * as ACTION from '../redux/authen/action';

export const useAuthenState = () => {
    const authenLogin = useSelector((state) => state.authen.login);
    const authenCurrent = useSelector((state) => state.authen.current);

    return { authenCurrent, authenLogin };
};

export const useAuthenDispatch = () => {
    const dispatch = useDispatch();
    const dispatchLogin = (data) => {
        dispatch(ACTION.login(data));
    };

    const dispatchGetCurrent = () => {
        dispatch(ACTION.current());
    };

    const dispatchClearCurrentDone = () => {
        dispatch(ACTION.current({ clear: true }));
    };

    return {
        dispatchLogin,
        dispatchGetCurrent,
        dispatchClearCurrentDone
    };
};
