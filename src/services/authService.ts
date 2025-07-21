
import api from '@/lib/api';
import {
  RegisterRequest,
  LoginRequest,
  VerifyUserRequest,
  RedeemPasswordRequest,
  RedeemPasswordCodeRequest,
  LoginResponse,
  AuthResponse,
  DefaultResponse,
} from '@/types/api';

export class AuthService {
  // Registrar usuário
  static async register(data: RegisterRequest): Promise<DefaultResponse> {
    const response = await api.post('/v1/user/register', data);
    return response.data;
  }

  // Verificar usuário
  static async verify(data: VerifyUserRequest): Promise<DefaultResponse> {
    const response = await api.put('/v1/user/verify', data);
    return response.data;
  }

  // Login
  static async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post('/v1/user/login', data);
    return response.data;
  }

  // Autenticar usuário (verificar se está logado)
  static async auth(): Promise<AuthResponse> {
    const response = await api.get('/v1/user/auth');
    return response.data;
  }

  // Solicitar recuperação de senha
  static async redeemPassword(data: RedeemPasswordRequest): Promise<DefaultResponse> {
    const response = await api.post('/v1/user/redeem-password', data);
    return response.data;
  }

  // Confirmar recuperação de senha
  static async redeemPasswordCode(data: RedeemPasswordCodeRequest): Promise<DefaultResponse> {
    const response = await api.post('/v1/user/redeem-password/code', data);
    return response.data;
  }

  // Salvar token JWT
  static saveToken(token: string): void {
    localStorage.setItem('jwt-token', token);
  }

  // Remover token JWT
  static removeToken(): void {
    localStorage.removeItem('jwt-token');
  }

  // Verificar se tem token
  static hasToken(): boolean {
    return !!localStorage.getItem('jwt-token');
  }
}
