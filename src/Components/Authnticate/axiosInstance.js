// src/axiosInstance.js
import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'https://localhost:44339/api/',
});

// Request Interceptor to add token to headers
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Response Interceptor to handle token expiration
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        if (error.response.status === 401) { // Unauthorized
            // Handle token refresh logic here (e.g., redirect to login, show message)
            localStorage.removeItem('authToken');
            localStorage.removeItem('tokenExpiry');
            window.location.href = '/login'; // Redirect to login
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
