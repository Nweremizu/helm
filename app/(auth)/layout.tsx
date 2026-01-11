import { AuthCTAProvider, AuthNavCTAs } from "@/components/auth/auth-cta";
import { constructMetadata } from "@/lib/metadata";
import Image from "next/image";
import Link from "next/link";

export const metadata = constructMetadata();

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthCTAProvider>
      <div className="auth min-h-screen bg-background text-primary font-sans">
        <nav className="sticky top-0 z-50 w-full backdrop-blur-md border-b border-neutral-50">
          {/* Navigation content goes here */}
          <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <div className="flex shrink-0 ml-10">
                <Link href="/">
                  <Image
                    src="/Logo.svg"
                    alt="Helm Logo"
                    width={120}
                    height={40}
                  />
                </Link>
              </div>

              {/* Call to Action Button (client-side; updates on navigation and respects page overrides) */}
              <AuthNavCTAs />
            </div>
          </div>
        </nav>
        <div className="flex flex-col w-full items-center relative justify-center min-h-[calc(100vh-100px)] h-full px-4 sm:px-6 lg:px-8">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-accent p-8 sm:p-10">
            {children}
          </div>
          <div className="absolute bottom-0 left-0 w-full py-4">
            <p className="text-xs text-gray-400 text-center">
              &copy; {new Date().getFullYear()} Helm. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </AuthCTAProvider>
  );
}
