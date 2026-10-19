import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookOpen } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { loginUser } from '../api/client';
import { loginSchema, type LoginFormValues } from '../schemas/authSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: { email: '', password: '' },
  });

  const logIn = useMutation({
    mutationFn: loginUser,
    onSuccess: (reply) => {
      setSession(reply.token, reply.user.name);
      navigate('/dashboard', { replace: true });
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    logIn.mutate(values);
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

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-[var(--text-primary)]">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="juan@dlsl.edu.ph"
            {...register('email')}
            aria-invalid={errors.email ? true : undefined}
            className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)]"
          />
          {errors.email && (
            <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-[var(--text-primary)]">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="At least 8 characters"
            {...register('password')}
            aria-invalid={errors.password ? true : undefined}
            className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)]"
          />
          {errors.password && (
            <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
          )}
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={logIn.isPending}
            className="h-12 w-full cursor-pointer rounded-full bg-[var(--accent-indigo)] text-[15px] font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg hover:opacity-95 focus:ring-2 focus:ring-[var(--accent-indigo)] focus:ring-offset-2 active:scale-95 disabled:opacity-50"
          >
            {logIn.isPending ? 'Signing in...' : 'Log In'}
          </Button>
        </div>
      </form>

      {/* API error response */}
      {logIn.isError && (
        <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
          <p className="text-xs text-red-600 dark:text-red-400 font-medium">
            {logIn.error instanceof Error ? logIn.error.message : 'Invalid email or password'}
          </p>
        </div>
      )}

      <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
        No account yet?{' '}
        <Link to="/register" className="font-semibold text-[var(--accent-indigo)] hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
}
