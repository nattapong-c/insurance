import ENV from '../../env.json';
import axios from 'axios';
import { getHeaderAuthen } from '../../utils/authen';

export const getCompanyGeneralInfo = async () => {
    return await axios.get(`${ENV.API_URL}/api/company/info`, { headers: { authorization: getHeaderAuthen() } });
};

export const getCustomerGeneralInfo = async () => {
    return await axios.get(`${ENV.API_URL}/api/customer/info`, { headers: { authorization: getHeaderAuthen() } });
};

export const getInvoiceGeneralInfo = async () => {
    return await axios.get(`${ENV.API_URL}/api/invoice/info`, { headers: { authorization: getHeaderAuthen() } });
};
