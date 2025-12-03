import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const linkClass =
    "h-auto p-0 text-gray-600 hover:text-blue-600 transition-colors";

  return (
    <footer className="mt-auto bg-gray-50 border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* About */}
          <div>
            <Link href="/" className="flex flex-col items-start gap-2 mb-4">
              <Image
                src="/scam-logo.png"
                alt="Logo"
                width={48}
                height={48}
                priority
              />
              <div className="text-lg font-semibold text-gray-900">
                Smart Campus System
              </div>
            </Link>
            <p className="text-gray-600">
              Simplifying room booking for educational institutions.
            </p>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-gray-900">Support</h3>
            <ul className="space-y-2">
              <li>
                <Button asChild variant="link" className={linkClass}>
                  <Link href="#">Help Center</Link>
                </Button>
              </li>
              <li>
                <Button asChild variant="link" className={linkClass}>
                  <Link href="#">Documentation</Link>
                </Button>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="mb-4 text-gray-900">Contact Us</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                Address: 268 Ly Thuong Kiet, Dien HongWard, Ho Chi Minh City
              </li>
              <li>Phone: 0987654321</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-gray-900">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Button asChild variant="link" className={linkClass}>
                  <Link href="#">Privacy Policy</Link>
                </Button>
              </li>
              <li>
                <Button asChild variant="link" className={linkClass}>
                  <Link href="#">Terms of Service</Link>
                </Button>
              </li>
              <li>
                <Button asChild variant="link" className={linkClass}>
                  <Link href="#">Cookie Policy</Link>
                </Button>
              </li>
            </ul>
          </div>
        </div>

        {/* line + copyright */}
        <div className="mt-8">
          <Separator className="mb-6" />
          <p className="text-center text-gray-600">
            &copy; 2025 Smart Campus System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
