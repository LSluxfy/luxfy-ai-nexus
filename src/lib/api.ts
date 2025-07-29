
import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = 'https://api.luxfy.app';

// Criar instância do axios
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar JWT token nas requisições
api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('jwt-token');
    
    // Token de teste temporário se não houver token no localStorage
    if (!token) {
      token = 'TOKEN_DE_TESTE_TEMPORARIO';
      console.log('Usando token de teste temporário');
    }
    
    console.log('Token JWT encontrado:', token ? 'SIM' : 'NÃO');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Enviando requisição para:', config.url, 'com token');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com respostas e erros
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('jwt-token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
