import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login('demo-token-123');
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-sm">
      <h2 className="text-2xl font-serif italic text-[var(--text-primary)]">Login</h2>
      <p className="mt-2 text-[var(--text-secondary)]">Sign in to access your personal dashboard.</p>
      
      <form onSubmit={handleLogin} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1"
          />
        </div>
        <Button
          type="submit"
          className="mt-2 w-full rounded-full bg-[var(--accent-indigo)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 cursor-pointer"
        >
          Login with demo account
        </Button>
      </form>
    </div>
  );
}

