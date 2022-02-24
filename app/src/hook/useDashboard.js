import { useDispatch, useSelector } from 'react-redux';
import * as ACTION from '../redux/dashboard/action';


export const useDashboardState = () => {
    const companyInfo = useSelector((state) => state.dashboard.company);
    const customerInfo = useSelector((state) => state.dashboard.customer);
    const invoiceInfo = useSelector((state) => state.dashboard.invoice);
    return { companyInfo, customerInfo, invoiceInfo };
};

export const useDashboardDispatch = () => {
    const dispatch = useDispatch();

    const dispatchGetCompanyInfo = () => {
        dispatch(ACTION.getCompanyGeneralInfoAction());
    };

    const dispatchGetCustomerInfo = () => {
        dispatch(ACTION.getCustomerGeneralInfoAction());
    };

    const dispatchGetInvoiceInfo = () => {
        dispatch(ACTION.getInvoiceGeneralInfoAction());
    };


    return {
        dispatchGetCompanyInfo,
        dispatchGetCustomerInfo,
        dispatchGetInvoiceInfo
    }
};