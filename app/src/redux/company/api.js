import ENV from '../../env.json';
import axios from 'axios';
import { getHeaderAuthen } from '../../utils/authen';

export const createCompany = async (data) => {
    return await axios.post(`${ENV.API_URL}/api/company`, data, { headers: { authorization: getHeaderAuthen() } });
};

export const getCompanyList = async (params) => {
    return await axios.get(`${ENV.API_URL}/api/company?${params}`, { headers: { authorization: getHeaderAuthen() } });
};

export const deleteCompanyList = async (params) => {
    return await axios.delete(`${ENV.API_URL}/api/company?${params}`, { headers: { authorization: getHeaderAuthen() } });
};

export const updateCompany = async (id, data) => {
    return await axios.put(`${ENV.API_URL}/api/company/${id}`, data, { headers: { authorization: getHeaderAuthen() } });
};
