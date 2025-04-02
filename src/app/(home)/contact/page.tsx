'use client';

import { Building2, Clock, Mail, MapPin, Phone } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Footer } from '@/modules/home/ui/components/footer';

const contactInfo = [
  {
    title: 'Visit Us',
    description: '123 Car Street\nCity, State 12345',
    icon: MapPin,
    details:
      'Our office is located in the heart of the city, easily accessible by public transport.',
  },
  {
    title: 'Call Us',
    description: '(123) 456-7890',
    icon: Phone,
    details: 'Available Monday to Friday, 9:00 AM - 6:00 PM',
  },
  {
    title: 'Email Us',
    description: 'info@carrental.com',
    icon: Mail,
    details: 'We typically respond within 24 hours',
  },
];

const additionalInfo = [
  {
    title: 'Business Hours',
    description:
      'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed',
    icon: Clock,
  },
  {
    title: 'Office Location',
    description: 'Main Office Building\nFloor 3, Suite 304',
    icon: Building2,
  },
];

const ContactInfoCard = ({
  title,
  description,
  icon: Icon,
  details,
}: {
  title: string;
  description: string;
  icon: any;
  details?: string;
}) => {
  return (
    <Card className="bg-white">
      <CardContent className="flex flex-col gap-4 p-6">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 rounded-full p-3">
            <Icon className="text-primary size-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-muted-foreground mt-1 text-sm whitespace-pre-line">
              {description}
            </p>
          </div>
        </div>
        {details && (
          <p className="text-muted-foreground/80 ml-[3.25rem] text-sm italic">
            {details}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default function ContactPage() {
  return (
    <div className="relative w-full overflow-x-hidden">
      <div className="relative mx-auto max-w-[1700px]">
        <div className="fixed top-0 left-1/2 hidden h-screen w-px -translate-x-[600px] bg-gray-200 lg:block"></div>
        <div className="fixed top-0 left-1/2 hidden h-screen w-px translate-x-[600px] bg-gray-200 lg:block"></div>

        <Card className="mx-auto w-full px-2 sm:px-4 lg:w-[1175px]">
          <div className="relative grid grid-cols-1 gap-4 pt-4 pb-8 sm:gap-8">
            <div className="flex flex-col justify-center space-y-4 sm:space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm">
                  <Badge className="border border-gray-300 bg-gray-200 text-gray-600">
                    Contact
                  </Badge>
                </div>
                <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
                  Contact Information
                </h1>
                <p className="text-muted-foreground/70 mt-4 tracking-tight">
                  Get in touch with us through any of the following channels
                </p>
              </div>

              <div className="mt-8 grid gap-6 sm:grid-cols-3">
                {contactInfo.map((info, index) => (
                  <ContactInfoCard
                    key={index}
                    title={info.title}
                    description={info.description}
                    icon={info.icon}
                    details={info.details}
                  />
                ))}
              </div>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {additionalInfo.map((info, index) => (
                  <Card key={index} className="bg-white">
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="rounded-full bg-gray-100 p-3">
                        <info.icon className="size-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {info.title}
                        </h3>
                        <p className="text-muted-foreground mt-1 text-sm whitespace-pre-line">
                          {info.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="relative hidden pt-12 lg:block">
          <div className="absolute left-1/2 h-px w-screen -translate-x-1/2 bg-gray-200"></div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
