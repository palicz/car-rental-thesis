import { ReactNode } from 'react';

export default function BookingsLayout({ children }: { children: ReactNode }) {
  return <div className="h-full w-full">{children}</div>;
}
