/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata, ResolvingMetadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import GlobalProvider from "@/app/global-provider";
import { AuthProvider } from "@/provider/auth";
import { getUser } from "@/lib/auth/dal";
import localFont from "next/font/local";

const inter = localFont({
  src: "./fonts/ClashDisplay-Variable.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "200 700",
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, //  disable zooming and it makes the viewport behave more like a native app
  themeColor: "light", // set theme color to light mode
  interactiveWidget: "resizes-content", // optimize for interactive widgets
};

// ---------------------------------------------------------
// 1. THIS IS YOUR NEW FUNCTION
// Next.js looks for this specific exported function name.
// ---------------------------------------------------------
type Props = {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    // (Optional) If you needed to fetch site settings from a DB, you would do it here.
    // const siteSettings = await fetchSiteSettings();
    title: {
      template: "%s | Helm",
      default: "Helm | Steer Your Worth", // The default home page title
    },
    description:
      "The operating system for your personal wealth. A minimalist budgeting tool that connects directly to your bank account for real-time clarity.",
    // METADATA BASE (Your domain)
    metadataBase: new URL("https://helm-app.com"), // Replace with your Vercel URL
    // KEYWORDS (For Search)
    keywords: [
      "Budgeting",
      "Personal Finance",
      "Fintech",
      "Expense Tracker",
      "Minimalist",
      "Bank Sync",
    ],

    // ICONS (Favicons)
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png", // Important for iPhone home screen
    },

    // APPLE WEB APP CAPABILITIES
    appleWebApp: {
      capable: true,
      title: "Helm",
      statusBarStyle: "black-translucent", // Makes the top bar blend in
    },

    // ROBOTS (Control crawling)
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
        <GlobalProvider>
          <AuthProvider user={user}>{children}</AuthProvider>
        </GlobalProvider>
      </body>
    </html>
  );
}
