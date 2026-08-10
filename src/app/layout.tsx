import type { Metadata } from "next";
import { Outfit, Source_Sans_3 } from "next/font/google";
import Script from "next/script";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-68S6SKWY4H";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  weight: ["500", "600", "700", "800"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "Wodoo — Track your calories with just a picture",
  description:
    "AI-powered fitness app to help you track your daily diet. Snap a photo or scan a barcode to track calories, nutrients, and daily intake. Join the Wodoo waitlist.",
  keywords: [
    "calorie tracker",
    "AI calorie tracking",
    "food scanner",
    "macro tracker",
    "Wodoo",
    "diet tracker",
  ],
  applicationName: "Wodoo",
  openGraph: {
    title: "Wodoo — Track your calories with just a picture",
    description:
      "AI-powered fitness app to help you track your daily diet. Snap a photo or scan a barcode to track calories and nutrients.",
    images: [
      {
        url: "/og.png",
        width: 1536,
        height: 1024,
        alt: "Wodoo — Track your calories with just a picture",
      },
    ],
    type: "website",
    siteName: "Wodoo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wodoo — Track your calories with just a picture",
    description:
      "AI-powered fitness app to help you track your daily diet. Snap a photo or scan a barcode to track calories and nutrients.",
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=wo", sizes: "any" },
      { url: "/favicon-16.png?v=wo", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png?v=wo", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png?v=wo", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png?v=wo", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png?v=wo", sizes: "180x180" }],
    shortcut: "/favicon.ico?v=wo",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${sourceSans.variable} h-full`}
    >
      <body className="min-h-full antialiased">
        {children}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
