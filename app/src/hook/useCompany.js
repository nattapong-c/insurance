import { useDispatch, useSelector } from 'react-redux';
import * as ACTION from '../redux/company/action';

export const useCompanyState = () => {
    const companyCreate = useSelector((state) => state.company.create);
    const companyList = useSelector((state) => state.company.list);
    const companyDelete = useSelector((state) => state.company.delete);
    return { companyCreate, companyList, companyDelete };
};

export const useCompanyDispatch = () => {
    const dispatch = useDispatch();
    const dispatchCreateCompany = (data) => {
        dispatch(ACTION.createCompanyAction(data));
    };

    const dispatchClearCreateCompany = () => {
        dispatch(ACTION.createCompanyAction({clear: true}));
    };

    const dispatchGetCompany = () => {
        dispatch(ACTION.getCompanyListAction());
    };

    const dispatchDeleteCompany = (data) => {
        dispatch(ACTION.deleteCompanyAction(data));
    };

    return {
        dispatchCreateCompany,
        dispatchClearCreateCompany,
        dispatchGetCompany,
        dispatchDeleteCompany
    };
};