import axios from 'axios';

const client = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Extract data or format error
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'ເກີດຂໍ້ຜິດພາດໃນການເຊື່ອມຕໍ່ (Network error)';
    return Promise.reject({
      status: error.response?.status,
      message,
      errors: error.response?.data?.errors,
      originalError: error,
    });
  }
);

export default client;
