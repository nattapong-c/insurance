import ENV from '../../env.json';
import axios from 'axios';

export const createInvoice = async (data) => {
    return await axios.post(`${ENV.API_URL}/api/invoice`, data, { responseType: 'arraybuffer' });
};

export const getInvoiceList = async (params) => {
    return await axios.get(`${ENV.API_URL}/api/invoice?${params}`);
};

export const deleteInvoiceList = async (params) => {
    return await axios.delete(`${ENV.API_URL}/api/invoice?${params}`);
};

export const getLatestInvoice = async () => {
    return await axios.get(`${ENV.API_URL}/api/invoice/latest`);
};

export const exportInvoice = async (invoiceNumber) => {
    return await axios.get(`${ENV.API_URL}/api/invoice/${invoiceNumber}/export`, { responseType: 'arraybuffer' });
};
// export const updateCompany = async (id, data) => {
//     return await axios.put(`${ENV.API_URL}/api/company/${id}`, data);
// };