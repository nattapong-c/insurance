import ENV from '../../env.json';
import axios from 'axios';

export const createCustomer = async (data) => {
    return await axios.post(`${ENV.API_URL}/api/customer`, data);
};

export const getCustomerList = async (params) => {
    return await axios.get(`${ENV.API_URL}/api/customer?${params}`);
};

export const deleteCustomerList = async (params) => {
    return await axios.delete(`${ENV.API_URL}/api/customer?${params}`);
};

export const updateCustomer = async (id, data) => {
    return await axios.put(`${ENV.API_URL}/api/customer/${id}`, data);
};