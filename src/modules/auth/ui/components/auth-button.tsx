import Link from 'next/link';

import { Button } from '@/components/ui/button';

export const AuthButton = () => {
  return (
    <Link href="/register">
      <Button variant="custom">Get started</Button>
    </Link>
  );
};
