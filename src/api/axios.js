import axios from 'axios';

const API = axios.create({
    baseURL: 'https://gaon-ki-dukaan-backend.onrender.com/api', // Backend API URL
});

// Send the token with every request when it is available in local storage.
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;