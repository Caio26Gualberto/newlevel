// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

// Definir a interface para o payload do JWT
interface JwtPayload {
  name: string;
  email: string;
  role: string;
}

// Definir a interface para o contexto de autenticação
interface AuthContextType {
  token: string | null;
  isAdmin: () => boolean;
  isBand: () => boolean;
  setToken: (token: string) => void;
}

// Criar o contexto de autenticação
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Criar o Provider do contexto de autenticação
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Recuperar o token do localStorage quando o componente é montado
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Função para verificar se o usuário é Admin
  const isAdmin = (): boolean => {
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        return decodedToken.role === 'Admin';
      } catch (error) {
        console.error('Erro ao decodificar o token', error);
        return false;
      }
    }
    return false;
  };

  const isBand = (): boolean => {
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        return decodedToken.role === 'Band';
      } catch (error) {
        console.error('Erro ao decodificar o token', error);
        return false;
      }
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ token, isAdmin, isBand, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
