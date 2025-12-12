import axios from "axios";

export const api = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,

    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',

    headers: {
        Accept: 'application/json',
    },
});

export default api;