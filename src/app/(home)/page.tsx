import { ArrowUpRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Announcement,
  AnnouncementTitle,
} from '@/modules/home/ui/components/announcement';
import { Features } from '@/modules/home/ui/components/features';
import { Footer } from '@/modules/home/ui/components/footer';
import { LogoCarousel } from '@/modules/home/ui/components/logo-carousel';

const logos = [
  { id: 1, name: 'BMW', src: '/images/car-icons/bmw.svg' },
  {
    id: 2,
    name: 'Mercedes',
    src: '/images/car-icons/mercedes-benz-alt.svg',
  },
  { id: 3, name: 'Ford', src: '/images/car-icons/ford.svg' },
  {
    id: 4,
    name: 'Volkswagen',
    src: '/images/car-icons/volkswagen.svg',
  },
  { id: 5, name: 'Peugeot', src: '/images/car-icons/peugeot.svg' },
];

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <div className="relative mx-auto max-w-[1700px]">
        {/* Vertical side lines */}
        <div className="fixed top-0 left-1/2 hidden h-screen w-px -translate-x-[600px] bg-gray-200 lg:block"></div>
        <div className="fixed top-0 left-1/2 hidden h-screen w-px translate-x-[600px] bg-gray-200 lg:block"></div>

        {/* Main content container */}
        <Card className="mx-auto w-full px-2 sm:px-4 lg:w-[1175px]">
          {/* Hero section */}
          <div className="relative grid grid-cols-1 gap-4 pt-4 pb-8 sm:gap-8 md:grid-cols-2">
            {/* Left column - TITLE with BUTTONS */}
            <div className="flex flex-col justify-center space-y-4 sm:space-y-6">
              <Link href="/cars">
                <Announcement className="mx-2 cursor-pointer bg-gray-200/40 sm:ml-4">
                  <AnnouncementTitle className="text-sm tracking-tight sm:text-base">
                    Book a car the right way
                    <ArrowUpRightIcon
                      size={16}
                      className="text-muted-foreground shrink-0"
                    />
                  </AnnouncementTitle>
                </Announcement>
              </Link>

              <h1 className="mx-2 text-3xl font-bold tracking-tight text-gray-900 sm:mx-4 sm:text-4xl md:text-6xl lg:text-7xl">
                Rent a car with confidence and ease
              </h1>

              <p className="text-muted-foreground mx-2 text-sm tracking-tight sm:mx-4 sm:text-base md:text-lg">
                Experience hassle-free car rentals with our extensive fleet of
                vehicles.
              </p>

              <div className="flex flex-col space-y-3">
                <Button
                  variant="custom"
                  className="mx-2 w-full tracking-tight sm:mx-4 sm:w-auto"
                  asChild
                >
                  <Link href="/register">Sign up</Link>
                </Button>

                <p className="mx-2 text-center text-xs tracking-tight text-gray-500 sm:mx-4 sm:text-sm">
                  No credit card required
                </p>
              </div>
            </div>
            {/* Right column - GIF / ANIMATION / PHOTO */}
            <div className="relative aspect-[16/9] w-full rounded-lg border border-gray-200 bg-white p-2 shadow-sm sm:h-[300px] sm:p-4 md:aspect-auto md:h-full">
              <Image
                src="/images/hero-image.png"
                alt="Car rental hero image"
                fill
                className="rounded-lg object-cover"
                priority
              />
            </div>
          </div>
        </Card>

        {/*  Horizontal line */}
        <div className="relative hidden pt-12 lg:block">
          {/* Horizontal line full width */}
          <div className="absolute left-1/2 h-px w-screen -translate-x-1/2 bg-gray-200"></div>
        </div>

        {/* Logos section */}
        <div className="mx-auto w-full px-4 py-12 lg:w-[1000px]">
          <p className="mb-8 text-center text-sm text-gray-500">
            Featuring the world&apos;s leading automotive brands
          </p>
          <div className="flex justify-center pb-12">
            <LogoCarousel logos={logos} columns={4} />
          </div>
        </div>

        {/*  Horizontal line */}
        <div className="relative -mt-12 hidden lg:block">
          {/* Horizontal line full width */}
          <div className="absolute left-1/2 h-px w-screen -translate-x-1/2 bg-gray-200"></div>
        </div>

        {/* How it works section */}
        <div className="mx-auto w-full px-4 py-16 text-center lg:w-[1000px]">
          <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm">
            <Badge className="border border-gray-300 bg-white text-gray-600">
              How it works?
            </Badge>
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
            With us, booking is easy
          </h2>
          <div className="mt-4">
            <p className="text-muted-foreground/70 tracking-tight">
              Select your dream car and book instantly with our lightning fast,
              user-friendly, secure system.
              <br />
              It&apos;s that simple.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="p-6">
              <div className="flex flex-col items-start text-left">
                <Badge
                  variant="outline"
                  className="bg-gray-100 tracking-widest"
                >
                  01
                </Badge>
                <h3 className="mt-4 font-semibold">Choose your vehicle</h3>
                <p className="tracking-tightest mt-2 text-sm text-gray-500">
                  Browse our collection of vehicles and choose the one that best
                  suits your needs.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex flex-col items-start text-left">
                <Badge
                  variant="outline"
                  className="bg-gray-100 tracking-widest"
                >
                  02
                </Badge>
                <h3 className="mt-4 font-semibold">Fill out the forms</h3>
                <p className="tracking-tightest mt-2 text-sm text-gray-500">
                  Fill out the required forms with your personal details,
                  driver&apos;s license information. Our process ensures a quick
                  booking experience.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex flex-col items-start text-left">
                <Badge
                  variant="outline"
                  className="bg-gray-100 tracking-widest"
                >
                  03
                </Badge>
                <h3 className="mt-4 font-semibold">
                  Track your booking status
                </h3>
                <p className="tracking-tightest mt-2 text-sm text-gray-500">
                  Get real-time updates on your reservation.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/*  Horizontal line */}
        <div className="relative hidden pt-12 lg:block">
          {/* Horizontal line full width */}
          <div className="absolute left-1/2 h-px w-screen -translate-x-1/2 bg-gray-200"></div>
        </div>

        {/* Features Section */}
        <Features />
      </div>
      <Footer />
    </div>
  );
}
