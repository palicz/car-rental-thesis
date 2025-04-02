'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Footer } from '@/modules/home/ui/components/footer';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'What documents do I need for renting?',
    answer:
      "You will need an ID card, address card, tax card, and driver's license.",
  },
  {
    question: 'When and what do I need to pay?',
    answer:
      'Both the rental fee and the deposit must be paid in advance at the time of rental.',
  },
  {
    question: 'Can I travel abroad with the rented vehicle?',
    answer:
      'Traveling to most countries is allowed. However, if you intend to leave the country with the vehicle, you must inform our customer service upon pickup. For more details, please contact our colleagues.',
  },
  {
    question: 'What is the maximum speed I can drive the vehicle at?',
    answer:
      'You must comply with the speed limits defined by traffic regulations. If the vehicle consistently exceeds the legal speed limit by more than 10 km/h, the full deposit will be forfeited. Our vehicles are equipped with GPS systems to monitor compliance with this rule.',
  },
  {
    question: 'How many kilometers are included in the rental?',
    answer:
      'The daily limit is 500 km. For additional kilometers, please check with our staff. In the case of international rentals, there is no mileage restriction. For more details, please contact our colleagues.',
  },
  {
    question: 'What is the duration of the rental?',
    answer:
      'One rental unit equals 24 hours. If the rental period is exceeded, an additional rental unit will be charged.',
  },
];

const FAQItem = ({ question, answer }: FAQItem) => {
  return (
    <Card className="bg-white">
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">{question}</h3>
          <p className="text-muted-foreground text-sm">{answer}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default function InfoPage() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <div className="relative mx-auto max-w-[1700px]">
        <div className="fixed top-0 left-1/2 hidden h-screen w-px -translate-x-[600px] bg-gray-200 lg:block"></div>
        <div className="fixed top-0 left-1/2 hidden h-screen w-px translate-x-[600px] bg-gray-200 lg:block"></div>

        <Card className="mx-auto w-full px-2 sm:px-4 lg:w-[1175px]">
          <div className="relative grid grid-cols-1 gap-4 pt-4 pb-8 sm:gap-8">
            <div className="flex flex-col justify-center space-y-4 sm:space-y-6">
              <div className="text-center">
                <div className="rounded-ful inline-flex items-center gap-2 px-3 py-1 text-sm">
                  <Badge className="border border-gray-300 bg-gray-200 text-gray-600">
                    FAQ
                  </Badge>
                </div>
                <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
                  Car Rental Information
                </h1>
                <p className="text-muted-foreground/70 mt-4 tracking-tight">
                  Find answers to frequently asked questions about our car
                  rental service
                </p>
              </div>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {faqData.map((item, index) => (
                  <FAQItem
                    key={index}
                    question={item.question}
                    answer={item.answer}
                  />
                ))}
              </div>

              <div className="mt-12 text-center">
                <p className="text-muted-foreground">
                  Still have questions? Contact our customer service team for
                  assistance.
                </p>
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
