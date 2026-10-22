import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus, User, Mail, Lock, AlertCircle } from 'lucide-react';
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
    <div className="w-full max-w-md mx-auto my-6">
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-8 sm:p-10 shadow-lg">
        {/* Decorative Top Emerald Bar */}
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[var(--accent-emerald)] to-[var(--accent-indigo)]" />

        <div className="text-center mb-6">
          <div className="w-13 h-13 rounded-2xl bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)] flex items-center justify-center mx-auto mb-3 shadow-xs">
            <UserPlus className="w-7 h-7" strokeWidth={2.2} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent-emerald)] font-mono">
            De La Salle Lipa
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] mt-1">
            Create Library Account
          </h2>
          <p className="mt-1.5 text-xs text-[var(--text-secondary)]">
            Register with your student details to reserve library titles.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold text-[var(--text-primary)]">
              Full Name
            </Label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
                <User className="w-4 h-4" />
              </span>
              <Input
                id="name"
                type="text"
                placeholder="Juan dela Cruz"
                {...register('name')}
                aria-invalid={errors.name ? true : undefined}
                className="w-full pl-10 h-11 bg-[var(--bg-secondary)] text-sm rounded-xl text-[var(--text-primary)]"
              />
            </div>
            {errors.name && (
              <p className="text-xs text-rose-500 font-medium">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-[var(--text-primary)]">
              Institutional Email
            </Label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
                <Mail className="w-4 h-4" />
              </span>
              <Input
                id="email"
                type="email"
                placeholder="student@dlsl.edu.ph"
                {...register('email')}
                aria-invalid={errors.email ? true : undefined}
                className="w-full pl-10 h-11 bg-[var(--bg-secondary)] text-sm rounded-xl text-[var(--text-primary)]"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-500 font-medium">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold text-[var(--text-primary)]">
              Password
            </Label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <Input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                {...register('password')}
                aria-invalid={errors.password ? true : undefined}
                className="w-full pl-10 h-11 bg-[var(--bg-secondary)] text-sm rounded-xl text-[var(--text-primary)]"
              />
            </div>
            {errors.password && (
              <p className="text-xs text-rose-500 font-medium">{errors.password.message}</p>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={signUp.isPending}
              className="h-12 w-full cursor-pointer rounded-2xl bg-[var(--accent-indigo)] hover:bg-[var(--accent-indigo-hover)] text-sm font-semibold text-white shadow-md shadow-[var(--accent-indigo)]/20 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
            >
              {signUp.isPending ? 'Creating Account...' : 'Complete Registration'}
            </Button>
          </div>
        </form>

        {/* API Error Message */}
        {signUp.isError && (
          <div className="mt-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
              {signUp.error instanceof Error ? signUp.error.message : 'Registration failed. Please try again.'}
            </p>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[var(--accent-emerald)] hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}
