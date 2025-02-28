import { Header } from '../components/home-navbar/header';

interface HomeLayoutProps {
  children: React.ReactNode;
}

/**
 * Main layout component for the home section.
 * Provides consistent styling with a light background and proper spacing.
 * Includes the header and adjusts content positioning to prevent overlap with the fixed header.
 */
export const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <div className="w-full">
        <Header />
        {/* Add padding to prevent page content from being hidden under the fixed header */}
        <div className="flex min-h-screen pt-16 lg:pt-24">{children}</div>
      </div>
    </div>
  );
};
