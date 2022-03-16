import { useDispatch, useSelector } from 'react-redux';
import * as ACTION from '../redux/quotation/action';

export const useQuotationState = () => {
    const quotationCreate = useSelector((state) => state.quotation.create);
    const quotationList = useSelector((state) => state.quotation.list);
    // const quotationDelete = useSelector((state) => state.quotation.delete);
    // const quotationLatest = useSelector((state) => state.quotation.latest);
    // const quotationExport = useSelector((state) => state.quotation.export);
    return { quotationCreate, quotationList };
};

export const useQuotationDispatch = () => {
    const dispatch = useDispatch();

    const dispatchCreateQuotation = (data) => {
        dispatch(ACTION.createQuotationAction(data));
    };

    const dispatchClearCreateQuotation = () => {
        dispatch(ACTION.createQuotationAction({ clear: true }));
    };

    const dispatchGetQuotation = (params) => {
        dispatch(ACTION.getListQuotationAction(params));
    };

    return {
        dispatchCreateQuotation,
        dispatchClearCreateQuotation,
        dispatchGetQuotation
    };
}