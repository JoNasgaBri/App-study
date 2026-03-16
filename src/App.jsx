import { AppShell } from './app/AppShell';
import { AuthProvider } from './features/auth/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}