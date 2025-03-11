import { AdminLayout } from '@/modules/admin/layouts/admin-layout';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return <AdminLayout>{children}</AdminLayout>;
};

export default Layout;
