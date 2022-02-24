import ENV from '../../env.json';
import axios from 'axios';

export const getCompanyGeneralInfo = async () => {
    return await axios.get(`${ENV.API_URL}/api/company/info`);
};


export const getCustomerGeneralInfo = async () => {
    return await axios.get(`${ENV.API_URL}/api/customer/info`);
};


export const getInvoiceGeneralInfo = async () => {
    return await axios.get(`${ENV.API_URL}/api/invoice/info`);
};