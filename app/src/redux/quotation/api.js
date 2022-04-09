import ENV from '../../env.json';
import axios from 'axios';
import { getHeaderAuthen } from '../../utils/authen';

export const createQuotation = async (data) => {
    return await axios.post(`${ENV.API_URL}/api/quotation`, data, { responseType: 'arraybuffer', headers: { authorization: getHeaderAuthen() } });
};

export const getQuotationList = async (params) => {
    return await axios.get(`${ENV.API_URL}/api/quotation?${params}`, { headers: { authorization: getHeaderAuthen() } });
};

export const exportQuotation = async (id) => {
    return await axios.get(`${ENV.API_URL}/api/quotation/${id}/export`, { responseType: 'arraybuffer', headers: { authorization: getHeaderAuthen() } });
};

export const updateQuotation = async (id, data) => {
    return await axios.post(`${ENV.API_URL}/api/quotation/${id}`, data, { responseType: 'arraybuffer', headers: { authorization: getHeaderAuthen() } });
};

export const deleteQuotation = async (params) => {
    return await axios.delete(`${ENV.API_URL}/api/quotation?${params}`, { headers: { authorization: getHeaderAuthen() } });
};
