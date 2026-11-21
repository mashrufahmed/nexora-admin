'use client';

import { authApi } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import { IconArrowLeft, IconShieldCheck } from '@tabler/icons-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';

function VerifyOtpForm() {
  const params = useSearchParams();
  const [email, setEmail] = useState(params.get('email') ?? '');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function verify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.verifyEmail(email, otp);
      setMessage('Email verified. You can now sign in.');
    } catch (cause) {
      setError(
        cause instanceof ApiError ? cause.message : 'Unable to verify email',
      );
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    setError('');
    try {
      setMessage((await authApi.resendEmailOtp(email)).message);
    } catch (cause) {
      setError(
        cause instanceof ApiError ? cause.message : 'Unable to resend code',
      );
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
      <Card className="w-full max-w-md border-border/70 bg-card/90 shadow-xl">
        <CardHeader className="space-y-3">
          <Link
            href="/auth/forgot-password"
            className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <IconArrowLeft size={16} />
            Back
          </Link>

          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <IconShieldCheck size={24} />
          </div>

          <CardTitle className="text-3xl font-medium">
            Verify your email
          </CardTitle>

          <CardDescription>
            We&apos;ve sent a 6-digit verification code to your email address.
            Enter the code below to continue.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={verify} className="space-y-6">
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
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              name="otp"
              required
            >
              <InputOTPGroup className="w-full justify-around">
                {Array.from({ length: 6 }).map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="size-11 rounded-lg border bg-background/60 text-lg"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>

            <Button
              type="submit"
              className="h-10 w-full"
              disabled={loading || otp.length !== 6}
            >
              {loading ? 'Verifying…' : 'Verify email'}
            </Button>
            {(error || message) && (
              <p
                role="alert"
                className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive"
              >
                {error || message}
              </p>
            )}

            <p className="text-center font-medium text-xs text-muted-foreground">
              Didn&apos;t receive the code?{' '}
              <button
                type="button"
                className="font-medium text-primary hover:underline"
                onClick={() => void resend()}
              >
                Resend code
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpForm />
    </Suspense>
  );
}
