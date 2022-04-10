export const getToken = () => {
    return localStorage.getItem('_token');
};

export const getHeaderAuthen = () => {
    return `Bearer ${getToken()}`;
};

export const deleteToken = () => {
    localStorage.removeItem('_token');
};
