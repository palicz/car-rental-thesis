import { CarIcon, CheckCircleIcon, ShieldIcon } from 'lucide-react';
import { FaQuestion } from 'react-icons/fa';

import { Card } from '@/components/ui/card';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <Card className="group relative flex h-40 flex-col items-center justify-center p-6 text-center transition-all duration-300">
    {/* Hover dots */}
    <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      <div className="absolute top-2 left-2 h-2 w-2 rounded-full bg-gray-300"></div>
      <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-gray-300"></div>
      <div className="absolute bottom-2 left-2 h-2 w-2 rounded-full bg-gray-300"></div>
      <div className="absolute right-2 bottom-2 h-2 w-2 rounded-full bg-gray-300"></div>
    </div>
    <div className="absolute inset-0 flex items-center justify-center p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      <p className="text-sm text-gray-600">{description}</p>
    </div>
    <div className="flex flex-col items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
      <Card className="relative flex h-18 w-18 flex-col items-center justify-center bg-gray-100 p-6 text-center shadow-none">
        <div className="absolute top-2 left-2 h-1 w-1 rounded-full bg-gray-300"></div>
        <div className="absolute top-2 right-2 h-1 w-1 rounded-full bg-gray-300"></div>
        <div className="absolute bottom-2 left-2 h-1 w-1 rounded-full bg-gray-300"></div>
        <div className="absolute right-2 bottom-2 h-1 w-1 rounded-full bg-gray-300"></div>
        {icon}
      </Card>
      <p className="mt-4 font-bold tracking-tight">{title}</p>
    </div>
  </Card>
);

const features = [
  {
    icon: <ShieldIcon />,
    title: 'Secure',
    description:
      'Secure payment processing and data protection for your peace of mind',
  },
  {
    icon: <CarIcon />,
    title: 'Fast',
    description: 'Lightning-fast booking process with instant confirmation',
  },
  {
    icon: <CheckCircleIcon />,
    title: 'Reliable',
    description: '24/7 customer support and roadside assistance',
  },
  {
    icon: <FaQuestion className="h-6 w-6" />,
    title: 'Easy',
    description: 'Simple and intuitive booking process for everyone',
  },
];

export function Features() {
  return (
    <div className="mx-auto w-full max-w-[800px] px-4 py-16">
      <div className="mx-auto grid max-w-xs grid-cols-1 gap-8 sm:max-w-2xl sm:grid-cols-2 lg:max-w-none lg:grid-cols-4">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>

      {/* Horizontal line */}
      <div className="relative hidden pt-12 lg:block">
        <div className="absolute left-1/2 h-px w-screen -translate-x-1/2 bg-gray-200"></div>
      </div>
    </div>
  );
}
