'use client';

import { IconArrowLeft, IconMail } from '@tabler/icons-react';
import Link from 'next/link';

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

export default function ForgotPasswordPage() {
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
          <form action="/verify-otp" className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="h-10 bg-background/60"
              />
            </div>

            <Button type="submit" className="h-10 w-full">
              Send verification code
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
