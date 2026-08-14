import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleLogin = () => {
    login('demo-token-123');
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-sm">
      <h2 className="text-2xl font-serif italic text-[var(--text-primary)]">Login</h2>
      <p className="mt-2 text-[var(--text-secondary)]">Sign in to access your personal dashboard.</p>
      <button
        type="button"
        onClick={handleLogin}
        className="mt-6 w-full rounded-full bg-[var(--accent-indigo)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
      >
        Login with demo account
      </button>
    </div>
  );
}
