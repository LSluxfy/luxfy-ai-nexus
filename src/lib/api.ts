
import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = 'https://api.luxfy.app';

// Função para adicionar parâmetros anti-cache mais agressivos
const addCacheBustingParams = (url: string): string => {
  const separator = url.includes('?') ? '&' : '?';
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const sessionId = crypto.randomUUID().substring(0, 8);
  return `${url}${separator}_t=${timestamp}&_r=${random}&_s=${sessionId}&_v=${Date.now()}`;
};

// Criar instância do axios
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0',
    'ETag': '',
    'Last-Modified': '',
  },
});

// Interceptor para adicionar JWT token nas requisições e parâmetros anti-cache
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Adicionar timezone do cliente
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    config.headers['X-Client-Timezone'] = timezone;
    
    // Adicionar parâmetros anti-cache na URL
    if (config.url) {
      config.url = addCacheBustingParams(config.url);
    }
    
    // Headers anti-cache ultra agressivos para TODAS as requests
    config.headers['If-None-Match'] = '';
    config.headers['If-Modified-Since'] = '';
    config.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
    config.headers['Pragma'] = 'no-cache';
    config.headers['Expires'] = '0';
    config.headers['Surrogate-Control'] = 'no-store';
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    config.headers['X-Cache-Bust'] = Date.now().toString();
    
    // Headers extras para requests de autenticação
    if (config.url?.includes('/auth') || config.url?.includes('/user/auth')) {
      config.headers['X-Auth-Cache-Bust'] = `auth-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      config.headers['X-Force-Fresh'] = 'true';
    }
    
    // Log da requisição
    const timestamp = new Date().toISOString();
    console.log(`🚀 [API REQUEST] ${timestamp} - ${config.method?.toUpperCase()} ${config.url}`);
    
    return config;
  },
  (error) => {
    const timestamp = new Date().toISOString();
    console.error(`❌ [API REQUEST ERROR] ${timestamp}`, error);
    return Promise.reject(error);
  }
);

// Interceptor para lidar com respostas e erros
api.interceptors.response.use(
  (response: AxiosResponse) => {
    const timestamp = new Date().toISOString();
    const method = response.config.method?.toUpperCase();
    const url = response.config.url;
    const status = response.status;
    
    console.log(`✅ [API SUCCESS] ${timestamp} - ${method} ${url} - Status: ${status}`);
    console.log(`📦 [API DATA] ${timestamp}`, response.data);
    
    return response;
  },
  (error) => {
    const timestamp = new Date().toISOString();
    const method = error.config?.method?.toUpperCase();
    const url = error.config?.url;
    const status = error.response?.status;
    
    console.error(`❌ [API ERROR] ${timestamp} - ${method} ${url} - Status: ${status}`);
    console.error(`🔍 [ERROR DETAILS] ${timestamp}`, {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('jwt-token');
      window.location.href = '/login';
    }
    if (error.response?.status === 402) {
      // Sem plano
      window.location.href = '/select-plan';
    }
    return Promise.reject(error);
  }
);

export default api;
