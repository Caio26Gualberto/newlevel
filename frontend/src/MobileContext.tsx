import { useMediaQuery, useTheme } from '@mui/material';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isMobile: boolean | null;
}

const mobileContext = createContext<AuthContextType | undefined>(undefined);

export const MobileProvider = ({ children }: { children: ReactNode }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <mobileContext.Provider value={{ isMobile }}>
      {children}
    </mobileContext.Provider>
  );
};

export const useMobile = () => {
  const context = useContext(mobileContext);
  if (context === undefined) {
    throw new Error('useMobile must be used within a MobileProvider');
  }
  return context;
};

