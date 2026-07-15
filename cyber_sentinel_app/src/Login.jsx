import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Shield, ChevronRight, Lock, Loader2 } from 'lucide-react';
import Logo from './Logo';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (isLogin) {
        login(data.token, data.user);
        navigate('/dashboard');
      } else {
        setIsLogin(true); // Switch to login after successful registration
        setEmail('');
        setPassword('');
        // We could show a toast here in a real app
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020610] text-slate-300 font-sans selection:bg-cyan-500/30 flex flex-col relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.05),transparent_50%)]"></div>

      <nav className="relative z-10 w-full border-b border-slate-800/80 bg-[#020610]/80 backdrop-blur-xl">
        <div className="max-w-[92%] mx-auto px-4 lg:px-8 py-5">
          <Link to="/" className="flex items-center gap-3 w-fit group">
            <Logo className="w-9 h-9 text-white group-hover:text-slate-300 transition-colors" />
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-slate-200 transition-colors">Cyber Sentinel</span>
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center relative z-10 px-4 py-12">
        <div className="w-full max-w-md bg-[#050b14] border border-slate-800 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
              <Lock className="text-cyan-400" size={28} />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white text-center mb-2">
            {isLogin ? 'Authenticate Session' : 'Request Access'}
          </h2>
          <p className="text-slate-400 text-sm text-center mb-8">
            {isLogin ? 'Enter your credentials to access the secure portal.' : 'Register a new enterprise operator ID.'}
          </p>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 px-4 py-3 rounded-lg text-sm mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Operator Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-600"
                placeholder="admin@cybersentinel.com"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Passcode</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-600"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white text-slate-950 font-bold rounded-lg px-4 py-3 mt-4 hover:bg-slate-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {isLogin ? 'Initiate Login' : 'Create Credentials'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Secure Enterprise Portal
          </div>
        </div>
      </main>
    </div>
  );
}
