import type { Metadata } from "next";
import SponsorsComingSoon from "./SponsorsComingSoon";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://robofest26.vercel.app";

export const metadata: Metadata = {
  title: "Sponsors | Coming Soon",
  description:
    "Sponsor lineup and partnership opportunities for ROBOFEST 2026 are coming soon.",
  alternates: {
    canonical: "/sponsors",
  },
  openGraph: {
    title: "Sponsors | Coming Soon | ROBOFEST 2026",
    description:
      "Sponsor lineup and partnership opportunities for ROBOFEST 2026 are coming soon.",
    url: `${siteUrl}/sponsors`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sponsors | Coming Soon | ROBOFEST 2026",
    description:
      "Sponsor lineup and partnership opportunities for ROBOFEST 2026 are coming soon.",
  },
};

export default function SponsorsPage() {
  return <SponsorsComingSoon />;
}
