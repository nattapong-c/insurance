import axios from 'axios';
import ENV from '../env.json';
import { getHeaderAuthen } from './authen';

export const sendAiChat = async ({ messages, files = [] }) => {
    const formData = new FormData();
    formData.append('messages', JSON.stringify(messages));
    files.forEach((file) => {
        formData.append('files', file);
    });

    const response = await axios.post(`${ENV.API_URL}/api/ai/chat`, formData, {
        timeout: 120000,
        headers: {
            authorization: getHeaderAuthen()
        }
    });
    return response.data;
};

export const executeAiAction = async ({ type, payload, prerequisiteActions }) => {
    const response = await axios.post(
        `${ENV.API_URL}/api/ai/execute`,
        { type, payload, prerequisiteActions },
        {
            timeout: 30000,
            headers: {
                authorization: getHeaderAuthen()
            }
        }
    );
    return response.data;
};

export const downloadInvoicePdf = async (invoiceNo) => {
    const response = await axios.get(`${ENV.API_URL}/api/invoice/${invoiceNo}/export`, {
        responseType: 'arraybuffer',
        timeout: 30000,
        headers: {
            authorization: getHeaderAuthen()
        }
    });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice-${invoiceNo}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};
