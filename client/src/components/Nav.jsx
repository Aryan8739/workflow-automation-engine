import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function Nav() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  return (
    <header className="w-full h-14 border-b border-[#1f1f1f] bg-[#0b0b0b]/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-4 h-4 border border-gray-500 rounded-sm rotate-45 flex items-center justify-center group-hover:border-[#2563eb] transition">
            <div className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-[#2563eb]" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-300">Workflow Engine</span>
        </Link>

        <nav className="flex items-center space-x-2">
          <Link to="/docs" className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white transition">Docs</Link>

          {user ? (
            <>
              <span className="px-3 py-1.5 text-xs text-gray-500 hidden sm:inline">{user.email}</span>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white transition">Sign in</Link>
          )}

          <Link
            to="/app"
            className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#2563eb] text-white hover:bg-blue-500 transition"
          >
            Launch app
          </Link>
        </nav>
      </div>
    </header>
  );
}
