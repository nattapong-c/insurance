import ENV from '../../env.json';
import axios from 'axios';

export const createCompany = async (data) => {
    return await axios.post(`${ENV.API_URL}/api/company`, data);
};

export const getCompanyList = async () => {
    return await axios.get(`${ENV.API_URL}/api/company`);
};