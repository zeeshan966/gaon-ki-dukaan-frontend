import axios from 'axios';

const API = axios.create({
    baseURL: 'https://gaon-ki-dukaan-backend.onrender.com/api', // Aapka backend URL
});

// Agar localStorage mein token hai, to har request mein bhej do
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;