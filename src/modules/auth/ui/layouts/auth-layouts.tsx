interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return <div className="min-h-screen bg-[#f4f4f4]">{children}</div>;
};
