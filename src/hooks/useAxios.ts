import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// You can import your auth slice actions later
// import { logout } from '../store/slices/userSlice';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const useAxios = (): AxiosInstance => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response && error.response.status === 401) {
        // Token expired or invalid
        // dispatch(logout());
        localStorage.removeItem('token');
        navigate('/login');
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxios; 