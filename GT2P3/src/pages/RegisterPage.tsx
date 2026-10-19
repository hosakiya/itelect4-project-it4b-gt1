import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { registerUser, loginUser } from '../api/client';
import { registerSchema, type RegisterFormValues } from '../schemas/authSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegisterPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: { name: '', email: '', password: '' },
  });

  const signUp = useMutation({
    mutationFn: async (values: RegisterFormValues) => {
      await registerUser(values);
      return loginUser({ email: values.email, password: values.password });
    },
    onSuccess: (reply) => {
      setSession(reply.token, reply.user.name);
      navigate('/dashboard', { replace: true });
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    signUp.mutate(values);
  };

  return (
    <div className="relative w-full max-w-md mx-auto overflow-hidden rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-8 sm:p-10 shadow-sm">
      {/* Decorative top accent */}
      <div className="absolute inset-x-0 top-0 h-1.5 bg-[var(--accent-indigo)]" />

      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-[var(--accent-indigo)]/10 text-[var(--accent-indigo)] flex items-center justify-center mx-auto mb-3">
          <UserPlus className="w-6 h-6" strokeWidth={2.2} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-[var(--text-primary)]">Create Library Account</h2>
        <p className="mt-1.5 text-xs text-[var(--text-secondary)]">Register with your DLSL credentials to reserve library books.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-[var(--text-primary)]">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Juan dela Cruz"
            {...register('name')}
            aria-invalid={errors.name ? true : undefined}
            className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)]"
          />
          {errors.name && (
            <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>
          )}
        </div>

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
            disabled={signUp.isPending}
            className="h-12 w-full cursor-pointer rounded-full bg-[var(--accent-indigo)] text-[15px] font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg hover:opacity-95 focus:ring-2 focus:ring-[var(--accent-indigo)] focus:ring-offset-2 active:scale-95 disabled:opacity-50"
          >
            {signUp.isPending ? 'Creating Account...' : 'Register'}
          </Button>
        </div>
      </form>

      {/* API error response */}
      {signUp.isError && (
        <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
          <p className="text-xs text-red-600 dark:text-red-400 font-medium">
            {signUp.error instanceof Error ? signUp.error.message : 'Registration failed'}
          </p>
        </div>
      )}

      <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-[var(--accent-indigo)] hover:underline">
          Log In
        </Link>
      </p>
    </div>
  );
}
