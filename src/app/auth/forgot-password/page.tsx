'use client';

import { IconArrowLeft, IconMail } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
import { authApi } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      router.replace(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause.message
          : 'Unable to request a reset link',
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
            href="/auth/login"
            className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <IconArrowLeft size={16} />
            Back to login
          </Link>

          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <IconMail size={24} />
          </div>

          <CardTitle className="text-3xl font-medium">
            Forgot password?
          </CardTitle>

          <CardDescription>
            No worries. Enter your email address and we&apos;ll send you a
            verification code to reset your password.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-10 bg-background/60"
              />
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
              {loading ? 'Sending…' : 'Send reset link'}
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
