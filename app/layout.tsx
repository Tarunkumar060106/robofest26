import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://robofest26.vercel.app";
const siteName = "ROBOFEST 2026";
const siteDescription =
  "ROBOFEST 2026 is an interactive robotics festival experience featuring events, sponsors, patrons, and updates.";
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: siteName,
      url: siteUrl,
      description: siteDescription,
      inLanguage: "en-IN",
    },
    {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
  ],
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const awesomeSerifItalic = localFont({
  src: [
    {
      path: "../public/fonts/AwesomeSerifItalicVAR.ttf",
      style: "italic",
      weight: "100 900",
    },
  ],
  variable: "--font-awesome-serif-italic",
  display: "swap",
});

const awesomeSerifVar = localFont({
  src: [
    {
      path: "../public/fonts/AwesomeSerifVAR.ttf",
      style: "normal",
      weight: "100 900",
    },
  ],
  variable: "--font-awesome-serif-var",
  display: "swap",
});

const spaceGrotesk = localFont({
  src: [
    {
      path: "../public/fonts/SpaceGrotesk-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/SpaceGrotesk-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/SpaceGrotesk-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Robotics Festival`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  category: "technology",
  keywords: [
    "ROBOFEST 2026",
    "robotics fest",
    "robotics event",
    "engineering festival",
    "tech fest",
    "robotics competition",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName,
    title: `${siteName} | Robotics Festival`,
    description: siteDescription,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Robotics Festival`,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${awesomeSerifItalic.variable} ${awesomeSerifVar.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Script id="zoho-salesiq-init" strategy="afterInteractive">
          {`window.$zoho=window.$zoho||{};$zoho.salesiq=$zoho.salesiq||{ready:function(){}};`}
        </Script>
        <Script
          id="zsiqscript"
          src="https://salesiq.zohopublic.in/widget?wc=siqe5af35de3fbd3b4214d534a2712885e2f1bf2973da60c6ab85e6fe4f208cacf1"
          strategy="afterInteractive"
        />
        <Analytics />
        {children}
      </body>
    </html>
  );
}
