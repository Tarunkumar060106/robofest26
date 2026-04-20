// app/privacy-policy/page.tsx

import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Robofest 2.0",
  description:
    "Privacy Policy for Robofest 2.0, covering participant data use for school and college registrations, communication, and scheduling.",
};

const EFFECTIVE_DATE = "April 20, 2025";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#0e0e0e] text-[#f5f0e8]">

      {/* Nav */}
      <nav className="px-6 md:px-12 py-4 flex items-center justify-between border-b border-white/[0.06]">
        <Link
          href="/"
          className="font-['SpaceGrotesk'] text-[11px] uppercase tracking-[0.18em] text-white/30 hover:text-white/70 transition-colors duration-200"
        >
          ← Robofest 2.0
        </Link>
        <span className="font-['SpaceGrotesk'] text-[11px] uppercase tracking-[0.18em] text-white/15">
          Privacy
        </span>
      </nav>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 md:px-0 pt-14 pb-22">

        {/* Header */}
        <header className="mb-14">
          <p className="font-['SpaceGrotesk'] text-[11px] uppercase tracking-[0.25em] text-[#b83224] mb-5">
            Legal
          </p>
          <h1 className="font-['AwesomeSerifVAR'] text-[clamp(2.3rem,5.4vw,3.7rem)] leading-[1.05] tracking-[-0.01em] mb-6">
            Privacy Policy
          </h1>
          <p className="font-['SpaceGrotesk'] text-[13px] text-white/25 tracking-wide">
            Effective {EFFECTIVE_DATE} · SRMIST, Chennai
          </p>
        </header>

        {/* Sections */}
        <div className="space-y-12">

          {/* 1 */}
          <Section n="01" title="Introduction">
            <P>
              Robofest 2.0 is a robotics competition open to school and college
              participants, organized by students of SRMIST, Chennai. This
              Privacy Policy explains how we collect, use, store, and protect
              personal information in connection with registration, scheduling,
              and communication, including our use of the Google Calendar API.
            </P>
            <P>
              By registering for or participating in Robofest 2.0, you consent
              to the practices described in this policy.
            </P>
          </Section>

          {/* 2 */}
          <Section n="02" title="Information We Collect">
            <Sub title="What you provide">
              <Bullets items={[
                "Full name, email address, and phone number",
                "School or college/institution name and class/year of study",
                "Team name and team member details",
                "Event preferences and category registrations",
              ]} />
            </Sub>
            <Sub title="Via Google Calendar API">
              <P>
                We use the Google Calendar API to communicate event timelines,
                round schedules, and deadlines. Through this integration we may
                process:
              </P>
              <Bullets items={[
                "Your Google account email (used as a calendar recipient)",
                "Calendar event data we create — names, descriptions, dates, times, and locations",
              ]} />
              <Note>
                We do not access, read, or modify any existing calendar data
                that belongs to you.
              </Note>
            </Sub>
            <Sub title="Automatically collected">
              <Bullets items={[
                "Website usage data (pages visited, browser type) via analytics",
                "Device and IP address for security and performance",
              ]} />
            </Sub>
          </Section>

          {/* 3 */}
          <Section n="03" title="How We Use Your Information">
            <Bullets items={[
              "Register participants and manage event logistics",
              "Send schedules, reminders, and updates via Google Calendar",
              "Communicate announcements, results, and changes",
              "Verify eligibility and manage team assignments across school and college categories",
              "Improve our website and participant experience",
              "Comply with applicable laws and regulations",
            ]} />
            <Note>
              We do not use your information for advertising, automated
              profiling, or any purpose unrelated to Robofest 2.0.
            </Note>
          </Section>

          {/* 4 */}
          <Section n="04" title="Google API Services">
            <P>
              Our use and transfer of information received from Google APIs
              adheres to the{" "}
              <A href="https://developers.google.com/terms/api-services-user-data-policy">
                Google API Services User Data Policy
              </A>
              , including the Limited Use requirements. Specifically:
            </P>
            <Bullets items={[
              "We request only the minimum data necessary to create and send calendar events",
              "We do not share Google user data with third parties beyond what is needed to operate the service",
              "We do not use Google user data for advertising or to train machine learning models",
              "We retain Google-provided data only as long as needed to deliver event communications",
            ]} />
            <P>
              For more information see{" "}
              <A href="https://policies.google.com/privacy">
                Google's Privacy Policy
              </A>
              .
            </P>
          </Section>

          {/* 5 */}
          <Section n="05" title="Data Sharing">
            <P>We do not sell or rent your personal information.</P>
            <Bullets items={[
              "Event co-organizers and faculty coordinators at SRMIST — for event management only",
              "Third-party service providers (e.g. Google) — solely to operate our tools",
              "Authorities — when required by law or court order",
            ]} />
          </Section>

          {/* 6 */}
          <Section n="06" title="Data Retention">
            <P>
              We retain participant information for the duration of Robofest 2.0
              and up to 12 months after the event concludes, after which data is
              securely deleted or anonymized. Google Calendar events we created
              may remain in your calendar until you remove them.
            </P>
          </Section>

          {/* 7 */}
          <Section n="07" title="Security">
            <Bullets items={[
              "Secure access controls for internal systems",
              "HTTPS for all web communications",
              "Restricted access on a need-to-know basis",
            ]} />
            <Note>
              No method of transmission over the internet is 100% secure. We
              encourage caution when sharing personal information online.
            </Note>
          </Section>

          {/* 8 */}
          <Section n="08" title="Your Rights">
            <Bullets items={[
              "Access — request a copy of the personal data we hold",
              "Correction — request correction of inaccurate information",
              "Deletion — request removal of your data, subject to operational requirements",
              "Withdrawal — decline or remove calendar events from your Google Calendar at any time",
              "For school participants who are minors, requests may be made by a parent/guardian or authorized school representative where applicable",
            ]} />
          </Section>

          {/* 9 */}
          <Section n="09" title="Children's Privacy">
            <P>
              Robofest 2.0 is open to both school and college participants.
              For participants under 18, registration and participation may be
              subject to parent/guardian consent or institutional authorization,
              based on applicable requirements and event rules.
            </P>
            <P>
              Our services are not directed to children under 13. We do not
              knowingly collect personal information from children under 13. If
              such data is identified, we will promptly delete it.
            </P>
          </Section>

          {/* 10 */}
          <Section n="10" title="Changes to This Policy">
            <P>
              We may update this policy from time to time. Significant changes
              will be reflected in an updated effective date and communicated via
              our website or email. Continued participation after changes
              constitutes acceptance of the updated policy.
            </P>
          </Section>

          {/* 11 */}
          <Section n="11" title="Contact">
            <P>
              For questions, concerns, or data requests, reach us at:
            </P>
            <div className="mt-5 pt-5 border-t border-white/[0.06] space-y-1.5">
              <p className="font-['SpaceGrotesk'] text-sm font-medium text-white/80">
                Robofest 2.0 Organizing Committee
              </p>
              <p className="font-['SpaceGrotesk'] text-sm text-white/35">
                SRMIST, Kattankulathur, Chennai, Tamil Nadu
              </p>
              <p className="font-['SpaceGrotesk'] text-sm">
                <a
                  href="mailto:robofest@srmist.edu.in"
                  className="text-[#b83224] hover:opacity-70 transition-opacity"
                >
                  robofest@srmist.edu.in
                </a>
              </p>
            </div>
          </Section>

        </div>

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t border-white/[0.06] flex items-center justify-between">
          <p className="font-['SpaceGrotesk'] text-[12px] text-white/15">
            Last updated {EFFECTIVE_DATE}
          </p>
          <Link
            href="/"
            className="font-['SpaceGrotesk'] text-[12px] uppercase tracking-[0.18em] text-white/25 hover:text-white/60 transition-colors duration-200"
          >
            ← Home
          </Link>
        </footer>
      </div>
    </main>
  );
}

/* ─── Sub-components ──────────────────────────────────────────────────────── */

function Section({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-baseline gap-3 mb-4">
        <span className="font-['SpaceGrotesk'] text-[10px] text-white/15 tracking-widest tabular-nums pt-0.5">
          {n}
        </span>
        <h2 className="font-['AwesomeSerifVAR'] text-[1.375rem] leading-snug">
          {title}
        </h2>
      </div>
      <div className="pl-6 space-y-4">{children}</div>
    </section>
  );
}

function Sub({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <p className="font-['SpaceGrotesk'] text-[11px] uppercase tracking-[0.2em] text-white/25">
        {title}
      </p>
      {children}
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-['SpaceGrotesk'] text-[14px] leading-[1.8] text-white/50">
      {children}
    </p>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-[8px] w-[3px] h-[3px] shrink-0 rounded-full bg-[#b83224]/50" />
          <span className="font-['SpaceGrotesk'] text-[14px] leading-[1.8] text-white/50">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-['SpaceGrotesk'] text-[13px] leading-[1.7] text-white/25 italic pl-4 border-l border-white/[0.08]">
      {children}
    </p>
  );
}

function A({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-white/50 underline underline-offset-2 decoration-white/15 hover:text-white/80 transition-colors duration-150"
    >
      {children}
    </a>
  );
}