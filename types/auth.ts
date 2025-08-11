export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  countryCode: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  phoneNumber?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginFormData) => Promise<void>;
  logout: () => void;
  register: (data: RegisterFormData) => Promise<void>;
}
