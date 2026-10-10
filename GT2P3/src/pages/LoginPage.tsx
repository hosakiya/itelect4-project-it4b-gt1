import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
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
    <div className="relative w-full max-w-md mx-auto overflow-hidden rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-8 sm:p-10 shadow-sm">
      {/* Decorative top accent */}
      <div className="absolute inset-x-0 top-0 h-1.5 bg-[var(--accent-indigo)]" />
      
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-[var(--accent-indigo)]/10 text-[var(--accent-indigo)] flex items-center justify-center mx-auto mb-3">
          <BookOpen className="w-6 h-6" strokeWidth={2.2} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-[var(--text-primary)]">Student & Faculty Portal</h2>
        <p className="mt-1.5 text-xs text-[var(--text-secondary)]">Sign in with your registry credentials to access reservations.</p>
      </div>
      
      <form onSubmit={handleLogin} className="mt-8 space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="username" className="text-[var(--text-primary)]">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)]"
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-[var(--text-primary)]">Password</Label>
            <a href="#" className="text-xs font-medium text-[var(--accent-indigo)] hover:underline" onClick={(e) => e.preventDefault()}>
              Forgot password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)]"
          />
        </div>
        
        <div className="pt-2">
          <Button
            type="submit"
            className="h-12 w-full cursor-pointer rounded-full bg-[var(--accent-indigo)] text-[15px] font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg hover:opacity-95 focus:ring-2 focus:ring-[var(--accent-indigo)] focus:ring-offset-2 active:scale-95"
          >
            Login with demo account
          </Button>
        </div>
      </form>
      
      <p className="mt-8 text-center text-xs text-[var(--text-muted)]">
        Demo credentials: any username/password works
      </p>
    </div>
  );
}

