'use client';

import {
  IconArrowLeft,
  IconEye,
  IconEyeOff,
  IconLock,
} from '@tabler/icons-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
          <form action="/login" className="space-y-5">
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
                  minLength={8}
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
                  minLength={8}
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

            <Button type="submit" className="h-10 w-full">
              Reset password
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
