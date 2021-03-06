import { useDispatch, useSelector } from 'react-redux';
import * as ACTION from '../redux/invoice/action';

export const useInvoiceState = () => {
    const invoiceCreate = useSelector((state) => state.invoice.create);
    const invoiceList = useSelector((state) => state.invoice.list);
    const invoiceDelete = useSelector((state) => state.invoice.delete);
    const invoiceLatest = useSelector((state) => state.invoice.latest);
    const invoiceExport = useSelector((state) => state.invoice.export);
    return { invoiceCreate, invoiceList, invoiceDelete, invoiceLatest, invoiceExport };
};

export const useInvoiceDispatch = () => {
    const dispatch = useDispatch();
    const dispatchCreateInvoice = (data) => {
        dispatch(ACTION.createInvoiceAction(data));
    };

    const dispatchClearCreateInvoice = () => {
        dispatch(ACTION.createInvoiceAction({ clear: true }));
    };

    const dispatchGetInvoice = (params) => {
        dispatch(ACTION.getInvoiceListAction(params));
    };

    const dispatchDeleteInvoice = (data) => {
        dispatch(ACTION.deleteInvoiceAction(data));
    };

    const dispatchGetLatestInvoice = () => {
        dispatch(ACTION.getLatestInvoiceAction());
    }

    const dispatchExportInvoice = (invoiceNumber) => {
        dispatch(ACTION.exportInvoiceAction(invoiceNumber));
    }

    return {
        dispatchCreateInvoice,
        dispatchClearCreateInvoice,
        dispatchGetInvoice,
        dispatchDeleteInvoice,
        dispatchGetLatestInvoice,
        dispatchExportInvoice
    }
};