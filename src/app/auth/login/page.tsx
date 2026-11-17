'use client';

import { IconCrown, IconEye, IconEyeOff } from '@tabler/icons-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[42%] top-0 h-full w-20 bg-primary/10 blur-2xl" />
        <div className="absolute right-0 top-0 h-150 w-125 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative grid min-h-screen lg:grid-cols-2">
        {/* Left section */}
        <section className="flex flex-col justify-between p-8 sm:p-12 lg:p-10 xl:p-16">
          <Link
            href="/"
            className="flex w-fit items-center gap-2 font-semibold tracking-tight"
          >
            <IconCrown className="size-5 fill-primary text-primary" />
            Company Name
          </Link>

          <div className="my-16 max-w-lg">
            <div className="mb-8 border-t border-border pt-4">
              <p className="text-xs font-medium uppercase tracking-widest text-primary">
                Same you. New session.
              </p>
            </div>

            <h1 className="text-5xl font-semibold leading-[1.12] tracking-tight sm:text-6xl xl:text-7xl">
              You’re in
              <br />
              the right
              <br />
              place.
            </h1>

            <p className="mt-8 text-sm text-muted-foreground">
              Make yourself at home.
            </p>
          </div>

          <footer className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy policy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
          </footer>
        </section>

        {/* Right section */}
        <section className="relative flex items-center justify-center border-l border-border/50 p-6 sm:p-12">
          {/* Decorative frame */}
          <div className="absolute inset-x-8 inset-y-12 hidden border border-border/50 lg:block xl:inset-x-12 xl:inset-y-16" />

          <Card className="relative z-10 w-full max-w-md border-border/70 bg-card/90 shadow-xl backdrop-blur-xl">
            <CardHeader className="space-y-2 pb-6">
              <CardTitle className="text-3xl font-semibold tracking-tight">
                Welcome back
              </CardTitle>
              <CardDescription className="font-medium">
                Sign in to continue to your account.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form className="space-y-5">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="h-10 bg-background/60 font-medium"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>

                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className="h-10 bg-background/60 pr-16 font-medium"
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-1 top-1/2 h-8 -translate-y-1/2 px-2 text-xs text-primary hover:text-primary"
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

                {/* Remember me */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Checkbox id="remember" />
                    <Label
                      htmlFor="remember"
                      className="cursor-pointer font-medium text-xs text-muted-foreground"
                    >
                      Remember me
                    </Label>
                  </div>

                  <Link
                    href="/auth/forgot-password"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Sign in */}
                <Button type="submit" className="h-10 w-full font-semibold">
                  Sign in
                </Button>
                <p className="text-center text-xs font-medium text-muted-foreground">
                  Securely recover access to your account anytime.
                </p>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
