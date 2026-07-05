import { useState } from 'react';
import { Link } from 'react-router-dom';

// Form UI only in 6a; wired to the auth backend in 6b.
export default function Auth() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('Auth backend is wired up in the next step.');
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-gray-100 flex flex-col">
      <div className="h-14 border-b border-[#1f1f1f] flex items-center px-6">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-4 h-4 border border-gray-500 rounded-sm rotate-45 flex items-center justify-center">
            <div className="w-1 h-1 bg-gray-400 rounded-full" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-300">Workflow Engine</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-1">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
          <p className="text-sm text-gray-500 mb-6">
            {mode === 'login' ? 'Sign in to access your saved workflows.' : 'Sign up to save and run your own workflows.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-gray-500 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/30"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-gray-500 mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/30"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <button type="submit" className="w-full py-2.5 rounded-full text-sm font-bold bg-[#2563eb] text-white hover:bg-blue-500 transition">
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-5 text-center">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
              className="text-[#2563eb] hover:underline"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          <p className="text-center mt-6">
            <Link to="/app" className="text-xs text-gray-600 hover:text-gray-400">Or continue to the sandbox demo →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
