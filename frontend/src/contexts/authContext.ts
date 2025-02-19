import React, { useContext, createContext } from 'react';

export interface AuthContextType {
  user: string,
  setUser: React.Dispatch<React.SetStateAction<string>>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('internal error creating context');
  }
  return authContext;
}