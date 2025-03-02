import { ChevronLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UserAuthForm } from '@/modules/auth/ui/components/user-auth-form';

export const metadata = {
  title: 'Create an account',
  description: 'Create an account to get started.',
};

export default function RegisterPage() {
  return (
    <div className="relative container grid min-h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-1 lg:px-0">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: 'outline', size: 'sm' }),
          'absolute top-4 left-4 md:top-8 md:left-8',
        )}
      >
        <>
          <ChevronLeftIcon className="mr-2 size-4" />
          Back
        </>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 px-4 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter your email below to create your account
          </p>
        </div>
        <Suspense>
          <UserAuthForm type="register" />
        </Suspense>
        <p className="text-muted-foreground text-center text-sm">
          <Link
            href="/login"
            className="hover:text-brand underline underline-offset-4"
          >
            Already have an account? Sign in
          </Link>
        </p>
        <p className="text-muted-foreground text-center text-sm">
          By clicking continue, you agree to our{' '}
          <Link
            href="/terms"
            className="hover:text-brand underline underline-offset-4"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href="/privacy"
            className="hover:text-brand underline underline-offset-4"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
