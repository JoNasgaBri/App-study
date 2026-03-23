import { AppShell } from './app/AppShell';
// AUTH: import kept for when auth is re-enabled
// import { AuthProvider } from './features/auth/AuthContext';

export default function App() {
  // AUTH: wrap with <AuthProvider> to re-enable authentication
  return <AppShell />;
}