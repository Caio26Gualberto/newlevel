import React, { createContext, useContext, useState } from 'react';

// Definindo o tipo para o contexto do usuário
interface UserContextType {
  userId: number | null;
  setUserId: (userId: number | null) => void;
}

// Criando um contexto para armazenar o ID do usuário
const UserContext = createContext<UserContextType | undefined>(undefined);

// Componente de provedor para fornecer o ID do usuário para toda a aplicação
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<number | null>(null);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para acessar o contexto do usuário
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
};