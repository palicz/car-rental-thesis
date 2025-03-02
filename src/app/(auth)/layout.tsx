import { AuthLayout } from '@/modules/auth/ui/layouts/auth-layouts';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <AuthLayout>{children}</AuthLayout>;
}
