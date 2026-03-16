import { useState, useCallback } from 'react';
import { storage } from '../../shared/lib/storage';
import { AuthContext } from './authContext';

const USER_SESSION_KEY = 'auth:userProfile';
const USERS_LIST_KEY = 'app_study_users';

/**
 * Provedor de autenticação. Envolva o app em `<AuthProvider>` para expor
 * o contexto de sessão a todos os componentes filhos via `useAuth()`.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    storage.get(USER_SESSION_KEY, null, (v) => v || null),
  );

  const isAuthenticated = !!user;

  const login = useCallback((userData) => {
    storage.set(USER_SESSION_KEY, userData);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    storage.remove(USER_SESSION_KEY);
    setUser(null);
  }, []);

  const signup = useCallback(
    (name, email, password) => {
      const users = storage.get(USERS_LIST_KEY, [], (v) => (Array.isArray(v) ? v : []));
      if (users.find((u) => u.email === email)) {
        throw new Error('E-mail já está em uso.');
      }
      const newUser = { id: Date.now().toString(), name, email, password };
      users.push(newUser);
      storage.set(USERS_LIST_KEY, users);
      login(newUser);
      return newUser;
    },
    [login],
  );

  const loginWithCredentials = useCallback(
    (email, password) => {
      const users = storage.get(USERS_LIST_KEY, [], (v) => (Array.isArray(v) ? v : []));
      const foundUser = users.find((u) => u.email === email && u.password === password);
      if (foundUser) {
        login(foundUser);
        return foundUser;
      }
      throw new Error('E-mail ou senha incorretos.');
    },
    [login],
  );

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, signup, loginWithCredentials }}>
      {children}
    </AuthContext.Provider>
  );
}


