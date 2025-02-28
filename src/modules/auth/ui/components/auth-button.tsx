import Link from 'next/link';

import { Button } from '@/components/ui/button';

export const AuthButton = () => {
  return (
    <Link href="/register">
      <Button className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
        Get started
      </Button>
    </Link>
  );
};
