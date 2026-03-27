import axios from 'axios';

const api = axios.create({
    baseURL: "http://192.168.100.6:8080/api",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor para adjuntar el JWT automáticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;