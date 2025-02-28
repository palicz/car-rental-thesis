import { HomeLayout } from '@/modules/home/ui/layouts/home-layout';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Root layout for the home section of the application.
 * Wraps all home pages with the HomeLayout component to maintain
 * consistent styling and structure.
 */
const Layout = ({ children }: LayoutProps) => {
  return <HomeLayout>{children}</HomeLayout>;
};

export default Layout;
