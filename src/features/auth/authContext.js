import { createContext } from 'react';

/**
 * Contexto de autenticação. Consumido via `useAuth()`.
 * Não use este contexto diretamente — importe e use `useAuth`.
 */
export const AuthContext = createContext(null);
