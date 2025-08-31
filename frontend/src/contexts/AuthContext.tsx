// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

// Definir a interface para o payload do JWT
interface JwtPayload {
  nameid: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
}

// Definir a interface para o contexto de autenticação
interface AuthContextType {
  token: string | null;
  currentUser: CurrentUser | null;
  isAdmin: () => boolean;
  isBand: () => boolean;
  setToken: (token: string | null) => void;
}

// Criar o contexto de autenticação
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Criar o Provider do contexto de autenticação
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(localStorage.getItem('accessToken'));
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

    useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setCurrentUser({
          id: decoded.nameid,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role,
          avatarUrl: decoded.avatar
        });
        localStorage.setItem('accessToken', token);
      } catch (error) {
        console.error('Invalid token', error);
        setCurrentUser(null);
        localStorage.removeItem('accessToken');
      }
    } else {
      setCurrentUser(null);
      localStorage.removeItem('accessToken');
    }
  }, [token]);

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
  };

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
    <AuthContext.Provider value={{ token, currentUser, isAdmin, isBand, setToken }}>
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
