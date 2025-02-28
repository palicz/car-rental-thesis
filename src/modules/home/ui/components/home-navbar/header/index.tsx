import Image from 'next/image';
import Link from 'next/link';

import { AuthButton } from '@/modules/auth/ui/components/auth-button';

import { AnimatedHeaderBackground } from './animated-background';
import { HeaderNavigation } from './nav';

export const Header = () => {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 w-full lg:top-4">
      <AnimatedHeaderBackground />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left section - Logo and brand name */}
          <div className="flex shrink-0 items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="Autókölcsönző"
                width={32}
                height={32}
              />
              <h1 className="text-xl font-bold">
                Rental.com<sup>®</sup>
              </h1>
            </Link>
          </div>

          {/* Center section - Navigation */}
          <div className="hidden md:block">
            <div className="mx-auto flex items-center justify-center">
              <HeaderNavigation />
            </div>
          </div>

          {/* Right section - Auth buttons */}
          {/* TODO: Implement authentication */}
          <div className="flex items-center gap-4">
            <Link
              href="/signin"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Sign in
            </Link>
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
};
