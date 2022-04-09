export const getToken = () => {
    return localStorage.getItem('_token');
};

export const getHeaderAuthen = () => {
    return `Bearer ${getToken()}`;
};
