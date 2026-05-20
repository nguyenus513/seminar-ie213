import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 120000
});

axiosClient.interceptors.response.use(
  (response) => response.data.data,
  (error) => Promise.reject(error.response?.data?.message || error.message)
);

export default axiosClient;
