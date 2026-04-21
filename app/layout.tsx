import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://robofest26.in";
const siteName = "ROBOFEST 2.0";
const siteDescription =
  "ROBOFEST 2.0 – SRMIST's flagship robotics competition at SRM Kattankulathur. Robot battles, line followers, drone events & ₹3L+ prize pool. Register now.";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Event",
      name: "ROBOFEST 2.0",
      url: siteUrl,
      description: siteDescription,
      inLanguage: "en-IN",
      organizer: {
        "@type": "Organization",
        name: "SRM Institute of Science and Technology",
        url: "https://www.srmist.edu.in",
      },
      location: {
        "@type": "Place",
        name: "SRM Institute of Science and Technology",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Kattankulathur",
          addressRegion: "Tamil Nadu",
          addressCountry: "IN",
        },
      },
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    },
    {
      "@type": "WebSite",
      name: "ROBOFEST 2026",
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
    default: `${siteName}`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  category: "technology",
  keywords: [
    "ROBOFEST 2026",
    "SRMIST robotics fest",
    "SRM robotics competition 2026",
    "SRM Kattankulathur tech fest",
    "robotics event Chennai",
    "robot battle competition India",
    "line follower robot competition",
    "drone competition SRM",
    "engineering fest Tamil Nadu",
    "robotics festival India 2026",
    "SRM Institute robotics",
    "tech fest SRM 2026",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName,
    title: `${siteName} | SRM Robotics Festival`,
    description: siteDescription,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | SRM Robotics Festival`,
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
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "wf90yce2wq");`}
        </Script>
        <Script
          id="google-tag-manager"
          src="https://www.googletagmanager.com/gtag/js?id=G-ZGWKER2L1C"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-ZGWKER2L1C');`}
        </Script>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
