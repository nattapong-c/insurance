import ENV from '../../env.json';
import axios from 'axios';
import { getHeaderAuthen } from '../../utils/authen';

export const login = async (data) => {
    return await axios.post(`${ENV.API_URL}/api/admin/login`, data);
};

export const current = async () => {
    return await axios.get(`${ENV.API_URL}/api/admin/current`, { headers: { authorization: getHeaderAuthen() } });
};
