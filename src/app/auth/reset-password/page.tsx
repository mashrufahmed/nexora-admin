'use client';

import { authApi } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import {
  IconArrowLeft,
  IconEye,
  IconEyeOff,
  IconLock,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function ResetPasswordForm() {
  const params = useSearchParams();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState(params.get('email') ?? '');
  const [token, setToken] = useState(params.get('token') ?? '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword(email, token, password);
      router.replace('/auth/login');
    } catch (cause) {
      setError(
        cause instanceof ApiError ? cause.message : 'Unable to reset password',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
      <Card className="w-full max-w-md border-border/70 bg-card/90 shadow-xl">
        <CardHeader className="space-y-3">
          <Link
            href="/auth/verify-otp"
            className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <IconArrowLeft size={16} />
            Back
          </Link>

          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <IconLock size={24} />
          </div>

          <CardTitle className="text-3xl font-medium">
            Create new password
          </CardTitle>

          <CardDescription>
            Your new password must be different from previously used passwords.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="token">Reset token</Label>
              <Input
                id="token"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                required
              />
            </div>
            {/* New password */}
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  required
                  minLength={12}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-10 bg-background/60 pr-16 font-medium"
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1/2 h-8 -translate-y-1/2 px-2 text-xs text-primary hover:text-primary active:translate-y-[-50%]"
                >
                  {showPassword ? (
                    <IconEyeOff className="mr-1 size-3.5" />
                  ) : (
                    <IconEye className="mr-1 size-3.5" />
                  )}
                  {showPassword ? 'Hide' : 'Show'}
                </Button>
              </div>
            </div>

            {/* Confirm password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>

              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  required
                  minLength={12}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="h-10 bg-background/60 pr-16 font-medium"
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-1 top-1/2 h-8 -translate-y-1/2 px-2 text-xs text-primary hover:text-primary active:translate-y-[-50%]"
                >
                  {showConfirmPassword ? (
                    <IconEyeOff className="mr-1 size-3.5" />
                  ) : (
                    <IconEye className="mr-1 size-3.5" />
                  )}
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </Button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive"
              >
                {error}
              </p>
            )}
            <Button type="submit" className="h-10 w-full" disabled={loading}>
              {loading ? 'Resetting…' : 'Reset password'}
            </Button>

            <p className="text-center text-xs text-muted-foreground font-medium">
              Remember your password?{' '}
              <Link href="/auth/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
