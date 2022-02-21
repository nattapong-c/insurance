import { useDispatch, useSelector } from 'react-redux';
import * as ACTION from '../redux/customer/action';

export const useCustomerState = () => {
    const customerCreate = useSelector((state) => state.customer.create);
    const customerList = useSelector((state) => state.customer.list);
    const customerDelete = useSelector((state) => state.customer.delete);
    const customerUpdate = useSelector((state) => state.customer.update);
    return { customerCreate, customerList, customerDelete, customerUpdate };
};

export const useCustomerDispatch = () => {
    const dispatch = useDispatch();
    const dispatchCreateCustomer = (data) => {
        dispatch(ACTION.createCustomerAction(data));
    };

    const dispatchClearCreateCustomer = () => {
        dispatch(ACTION.createCustomerAction({ clear: true }));
    };

    const dispatchGetCustomer = (params) => {
        dispatch(ACTION.getCustomerListAction(params));
    };

    const dispatchDeleteCustomer = (data) => {
        dispatch(ACTION.deleteCustomerAction(data));
    };

    const dispatchUpdateCustomer = (id, data) => {
        dispatch(ACTION.updateCustomerAction(id, data));
    };

    const dispatchClearUpdateCustomer = () => {
        dispatch(ACTION.updateCustomerAction("", { clear: true }));
    };

    return {
        dispatchCreateCustomer,
        dispatchClearCreateCustomer,
        dispatchGetCustomer,
        dispatchDeleteCustomer,
        dispatchUpdateCustomer,
        dispatchClearUpdateCustomer
    };
};