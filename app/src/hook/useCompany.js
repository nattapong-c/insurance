import { useDispatch, useSelector } from 'react-redux';
import * as ACTION from '../redux/company/action';

export const useCompanyState = () => {
    const companyInfo = useSelector((state) => state.company.create);
    const companyList = useSelector((state) => state.company.list);
    return { companyInfo, companyList };
};

export const useCompanyDispatch = () => {
    const dispatch = useDispatch();
    const dispatchCreateCompany = (data) => {
        dispatch(ACTION.createCompanyAction(data));
    };

    const dispatchGetCompany = () => {
        dispatch(ACTION.getCompanyListAction());
    };

    return {
        dispatchCreateCompany,
        dispatchGetCompany
    };
};