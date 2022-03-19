import { useDispatch, useSelector } from 'react-redux';
import * as ACTION from '../redux/quotation/action';

export const useQuotationState = () => {
    const quotationCreate = useSelector((state) => state.quotation.create);
    const quotationList = useSelector((state) => state.quotation.list);
    const quotationDelete = useSelector((state) => state.quotation.delete);
    const quotationUpdate = useSelector((state) => state.quotation.update);
    const quotationExport = useSelector((state) => state.quotation.export);
    return { quotationCreate, quotationList, quotationUpdate, quotationExport, quotationDelete };
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

    const dispatchUpdateQuotation = (id, data) => {
        dispatch(ACTION.updateQuotationAction(id,data));
    };

    const dispatchExportQuotation = (id, data) => {
        dispatch(ACTION.exportQuotationAction(id, data));
    }

    const dispatchDeleteQuotation = (params) => {
        dispatch(ACTION.deleteQuotationAction(params));
    }

    return {
        dispatchCreateQuotation,
        dispatchClearCreateQuotation,
        dispatchGetQuotation,
        dispatchUpdateQuotation,
        dispatchExportQuotation,
        dispatchDeleteQuotation
    };
}