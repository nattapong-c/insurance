import { useDispatch, useSelector } from 'react-redux';
import * as ACTION from '../redux/company/action';

export const useCompanyState = () => {
    const companyCreate = useSelector((state) => state.company.create);
    const companyList = useSelector((state) => state.company.list);
    const companyDelete = useSelector((state) => state.company.delete);
    const companyUpdate = useSelector((state) => state.company.update);
    return { companyCreate, companyList, companyDelete, companyUpdate };
};

export const useCompanyDispatch = () => {
    const dispatch = useDispatch();
    const dispatchCreateCompany = (data) => {
        dispatch(ACTION.createCompanyAction(data));
    };

    const dispatchClearCreateCompany = () => {
        dispatch(ACTION.createCompanyAction({ clear: true }));
    };

    const dispatchGetCompany = (params) => {
        dispatch(ACTION.getCompanyListAction(params));
    };

    const dispatchDeleteCompany = (data) => {
        dispatch(ACTION.deleteCompanyAction(data));
    };

    const dispatchUpdateCompany = (id, data) => {
        dispatch(ACTION.updateCompanyAction(id, data));
    };

    const dispatchClearUpdateCompany = () => {
        dispatch(ACTION.updateCompanyAction("", { clear: true }));
    };

    return {
        dispatchCreateCompany,
        dispatchClearCreateCompany,
        dispatchGetCompany,
        dispatchDeleteCompany,
        dispatchUpdateCompany,
        dispatchClearUpdateCompany
    };
};