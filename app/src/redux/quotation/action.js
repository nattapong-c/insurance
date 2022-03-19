import * as API from "./api";
import * as TYPE from "./type";
import moment from "moment";

const getQuotationFileName = (data) => {
    const issueDate = moment(data?.issue_date).toDate();
    const fileName = `ใบเสนอราคา ${new Intl.DateTimeFormat("th-TH", { month: "long", year: "numeric" }).format(issueDate)}`;
    return fileName;
};

const exportPDF = (data, response) => {
    const fileName = getQuotationFileName(data);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${fileName}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
};

export const createQuotationAction = (data) => async (dispatch) => {
    if (data?.clear) {
        dispatch({ type: TYPE.QUOTATION_CREATE_CLEAR });
        return;
    }
    dispatch({ type: TYPE.QUOTATION_CREATE_REQ });
    try {
        const response = await API.createQuotation(data);
        exportPDF(data, response);
        dispatch({ type: TYPE.QUOTATION_CREATE_SUCCESS, payload: response.data });
    } catch (err) {
        dispatch({ type: TYPE.QUOTATION_CREATE_FAIL, payload: err.response.data.error });
    }
};

export const getListQuotationAction = (params) => async (dispatch) => {
    dispatch({ type: TYPE.QUOTATION_GET_LIST_REQ });
    try {
        const response = await API.getQuotationList(params);
        dispatch({ type: TYPE.QUOTATION_GET_LIST_SUCCESS, payload: response.data });
    } catch (err) {
        dispatch({ type: TYPE.QUOTATION_GET_LIST_FAIL, payload: err.response.data.error });
    }
};

export const updateQuotationAction = (id, data) => async (dispatch) => {
    if (data?.clear) {
        dispatch({ type: TYPE.QUOTATION_UPDATE_CLEAR });
        return;
    }
    dispatch({ type: TYPE.QUOTATION_UPDATE_REQ });
    try {
        const response = await API.updateQuotation(id, data);
        exportPDF(data, response);
        dispatch({ type: TYPE.QUOTATION_UPDATE_SUCCESS, payload: response.data });
    } catch (err) {
        dispatch({ type: TYPE.QUOTATION_UPDATE_FAIL, payload: err.response.data.error });
    }
};

export const exportQuotationAction = (id, data) => async (dispatch) => {
    dispatch({ type: TYPE.QUOTATION_EXPORT_REQ });
    try {
        const response = await API.exportQuotation(id);
        exportPDF(data, response);
        dispatch({ type: TYPE.QUOTATION_EXPORT_SUCCESS, payload: response.data });
    } catch (err) {
        dispatch({ type: TYPE.QUOTATION_EXPORT_FAIL, payload: err.response.data.error });
    }
};



export const deleteQuotationAction = (params) => async (dispatch) => {
    dispatch({ type: TYPE.QUOTATION_DELETE_REQ });
    try {
        const response = await API.deleteQuotation(params);
        dispatch({ type: TYPE.QUOTATION_DELETE_SUCCESS, payload: response.data });
    } catch (err) {
        dispatch({ type: TYPE.QUOTATION_DELETE_FAIL, payload: err.response.data.error });
    }
};
