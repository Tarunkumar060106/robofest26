import type { Metadata } from "next";
import SponsorsSection from "@/components/SponsorsSection/SponsorsSection";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://robofest26.vercel.app";

export const metadata: Metadata = {
  title: "Sponsors",
  description:
    "Explore the sponsor lineup for ROBOFEST 2026 and partner with us to support the next generation of robotics innovators.",
  alternates: {
    canonical: "/sponsors",
  },
  openGraph: {
    title: "Sponsors | ROBOFEST 2026",
    description:
      "Explore the sponsor lineup for ROBOFEST 2026 and partner with us to support the next generation of robotics innovators.",
    url: `${siteUrl}/sponsors`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sponsors | ROBOFEST 2026",
    description:
      "Explore the sponsor lineup for ROBOFEST 2026 and partner with us to support the next generation of robotics innovators.",
  },
};

export default function SponsorsPage() {
  return (
    <main>
      <SponsorsSection state="live" />
    </main>
  );
}
