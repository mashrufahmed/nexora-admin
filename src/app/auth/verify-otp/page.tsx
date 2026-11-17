'use client';

import { IconArrowLeft, IconShieldCheck } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState('');
  
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
          <form action="/reset-password" className="space-y-6">
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
              disabled={otp.length !== 6}
            >
              Verify code
            </Button>

            <p className="text-center font-medium text-xs text-muted-foreground">
              Didn&apos;t receive the code?{' '}
              <button
                type="button"
                className="font-medium text-primary hover:underline"
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
