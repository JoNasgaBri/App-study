import { useState } from 'react';
import { useAuth } from './hooks/useAuth';

export function AuthView({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup, loginWithCredentials } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        if (!email || !password) return setError('Preencha todos os campos!');
        const user = loginWithCredentials(email, password);
        onLogin(user);
      } else {
        if (!name || !email || !password) return setError('Preencha todos os campos!');
        const newUser = signup(name, email, password);
        onLogin(newUser);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-zinc-900 bg-opacity-70 backdrop-blur-md z-50 transition-all duration-500">
      <div className="bg-zinc-800/80 border border-zinc-700 p-8 rounded-2xl shadow-2xl w-full max-w-sm backdrop-blur-xl relative">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          {isLogin ? 'Bem-vindo de volta' : 'Criar Conta'}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Nome</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                placeholder="Seu nome"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">E-mail</label>
            <input 
              type="email" 
              className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Senha</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-md transition-colors"
          >
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-zinc-400 text-sm">
          {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)} 
            className="ml-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors focus:outline-none"
          >
            {isLogin ? 'Crie agora' : 'Faça login'}
          </button>
        </div>
      </div>
    </div>
  );
}
