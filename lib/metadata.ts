// lib/metadata.ts
import { Metadata } from "next";

// 1. Define your default configuration here
const defaultMetadata = {
  title: "Helm | Steer Your Worth",
  description:
    "The operating system for your personal wealth. A minimalist budgeting tool that connects directly to your bank account for real-time clarity.",
  siteUrl: "https://helm-app.com",
  twitterHandle: "@helmapp", // Optional: Add if you have one
};

// 2. Define the arguments your function accepts
interface MetadataProps {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean; // Useful for internal pages like 'admin'
}

// 3. Export the reusable function
export function constructMetadata({
  title = defaultMetadata.title,
  description = defaultMetadata.description,
  image = "/thumbnail.png", // Make sure you have a default OG image in public folder
  icons = "/favicon.ico",
  noIndex = false,
}: MetadataProps = {}): Metadata {
  return {
    title: {
      template: `%s | Helm`,
      default: title,
    },
    description,
    openGraph: {
      title,
      description,
      url: defaultMetadata.siteUrl,
      siteName: "Helm",
      images: [
        {
          url: image,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: defaultMetadata.twitterHandle,
    },
    icons,
    metadataBase: new URL(defaultMetadata.siteUrl),
    keywords: [
      "Budgeting",
      "Personal Finance",
      "Fintech",
      "Expense Tracker",
      "Minimalist",
      "Bank Sync",
    ],
    appleWebApp: {
      capable: true,
      title: "Helm",
      statusBarStyle: "black-translucent",
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
