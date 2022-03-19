import ENV from "../../env.json";
import axios from "axios";

export const createQuotation = async (data) => {
    return await axios.post(`${ENV.API_URL}/api/quotation`, data, { responseType: "arraybuffer" });
};

export const getQuotationList = async (params) => {
    return await axios.get(`${ENV.API_URL}/api/quotation?${params}`);
};

export const exportQuotation = async (id) => {
    return await axios.get(`${ENV.API_URL}/api/quotation/${id}/export`, { responseType: "arraybuffer" });
};

export const updateQuotation = async (id, data) => {
    return await axios.post(`${ENV.API_URL}/api/quotation/${id}`, data, { responseType: "arraybuffer" });
};

export const deleteQuotation = async (params) => {
    return await axios.delete(`${ENV.API_URL}/api/quotation?${params}`);
};