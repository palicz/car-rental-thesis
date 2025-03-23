import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative z-10 w-full border-t bg-white">
      <div className="mx-auto max-w-[1700px] px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Rental.com®</h3>
            <p className="text-sm text-gray-600">
              Experience hassle-free car rentals with our extensive fleet of
              vehicles.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/cars"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/informations"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Informations
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4"></div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-600">
                123 Car Street
                <br />
                City, State 12345
              </li>
              <li className="text-sm text-gray-600">
                Phone: (123) 456-7890
                <br />
                Email: info@carrental.com
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Rental.com® All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
