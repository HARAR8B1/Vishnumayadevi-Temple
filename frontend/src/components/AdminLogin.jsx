import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (userId === 'admin' && token.trim().startsWith('github_pat_')) {
      sessionStorage.setItem('isAdminLoggedIn', 'true');
      sessionStorage.setItem('githubToken', token.trim());
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials or token format. Token must start with github_pat_');
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="glass rounded-2xl p-8 max-w-md w-full shadow-2xl border border-white/50">
        <h2 className="text-3xl font-heading font-bold text-maroon text-center mb-6">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">User ID</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-white/50 border border-saffron/20 focus:outline-none focus:ring-2 focus:ring-maroon text-charcoal placeholder-charcoal/40"
              placeholder="Enter User ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">GitHub PAT</label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-white/50 border border-saffron/20 focus:outline-none focus:ring-2 focus:ring-maroon text-charcoal placeholder-charcoal/40"
              placeholder="github_pat_..."
            />
            <p className="text-xs text-charcoal/60 mt-1">Requires 'Contents: Read and Write' access.</p>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-maroon hover:bg-maroon/90 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
