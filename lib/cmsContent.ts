import { DEFAULT_EVENTS, type EventItem } from "@/lib/eventsData";

export interface SiteSettings {
  eventDateIso: string;
  registrationUrl: string;
  ctaLabel: string;
  menuRegisterSubtext: string;
  heroDepartment: string;
  heroTitle: string;
  heroCollabPrefix: string;
  heroCollabOrg: string;
  heroAnimatedLines: string[];
  sponsorsState: "live" | "coming-soon";
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface SponsorsContent {
  eyebrow: string;
  headingPrefix: string;
  headingEmphasis: string;
  subtext: string;
  ctaText: string;
  ctaUrl: string;
  row1: string[];
  row2: string[];
}

export interface RuleItem {
  title: string;
  content: string;
}

export interface RulesContent {
  pageTitle: string;
  sectionTitle: string;
  registerUrl: string;
  accommodationTitle: string;
  accommodationParagraphs: string[];
  accommodationBullets: string[];
  generalRules: RuleItem[];
}

export interface CmsContent {
  siteSettings: SiteSettings;
  events: EventItem[];
  faqs: FaqItem[];
  sponsors: SponsorsContent;
  rules: RulesContent;
}

export const DEFAULT_CMS_CONTENT: CmsContent = {
  siteSettings: {
    eventDateIso: "2026-08-19T00:10:00+05:30",
    registrationUrl: "https://registration.isdlabsrm.in/",
    ctaLabel: "Register Now",
    menuRegisterSubtext: "Limited slots",
    heroDepartment: "Department of Computing Technologies",
    heroTitle: "ROBOFEST 2.0",
    heroCollabPrefix: "In collaboration with",
    heroCollabOrg: "SRM Directorate of Sports",
    heroAnimatedLines: [
      "Build the future",
      "compete with precision.",
      "Push your limits",
      "in robotics",
      "innovation and speed",
      "at Robofest.",
    ],
    sponsorsState: "coming-soon",
  },
  events: DEFAULT_EVENTS,
  faqs: [
    {
      q: "What is Robofest?",
      a: "Robofest is SRMIST's flagship annual robotics competition and festival - bringing together students, engineers, and innovators to compete, build, and push the limits of autonomous machines.",
    },
    {
      q: "Who can participate?",
      a: "Anyone passionate about robotics - from school students to college teams. Teams of up to 4 members can register across multiple event categories.",
    },
    {
      q: "What events are part of Robofest 2.0?",
      a: "Robofest 2.0 features multiple events including line following, maze solving, sumo bots, freestyle robotics, and more.",
    },
    {
      q: "How do I register?",
      a: "Click the Register Now button in the CTA bar or menu to use the official registration portal.",
    },
    {
      q: "What is the prize pool?",
      a: "Robofest 2.0 has a total prize pool of ₹7,00,000 across 9 event categories.",
    },
    {
      q: "Where is Robofest held?",
      a: "Robofest takes place at the SRM Institute of Science and Technology, Kattankulathur, Chennai.",
    },
    {
      q: "Is accommodation provided?",
      a: "Outstation participants may avail campus accommodation at a nominal fee. Details will be shared upon registration confirmation.",
    },
  ],
  sponsors: {
    eyebrow: "Sponsors",
    headingPrefix: "Our",
    headingEmphasis: "Partners",
    subtext:
      "Proudly backed by industry leaders who believe in the next generation of robotics innovators.",
    ctaText: "Become a Sponsor",
    ctaUrl: "#",
    row1: [
      "TechCore",
      "NovaSys",
      "ArcFlux",
      "Quantum",
      "ByteForge",
      "PulseAI",
      "IronGrid",
      "VoltEdge",
      "NexGen",
      "CoreMind",
    ],
    row2: [
      "SkyLoop",
      "DriveX",
      "CypherLab",
      "OmniBot",
      "FusionHub",
      "SignalWave",
      "MetaFrame",
      "SonicPath",
      "BitRover",
      "EchoSpark",
    ],
  },
  rules: {
    pageTitle: "Robofest Rule Book",
    sectionTitle: "General Rules",
    registerUrl: "https://registration.isdlabsrm.in/",
    accommodationTitle: "Accommodation Details",
    accommodationParagraphs: [
      "Accommodation will be provided on the spot for participants, strictly on a first-come, first-served basis.",
      "Limited slots are available, so participants are strongly advised to confirm early at the venue.",
    ],
    accommodationBullets: [
      "Allotment will be handled by the organizing team.",
      "Participants must carry a valid government ID and college ID for verification.",
      "Basic amenities such as bedding, water, and security will be provided.",
      "Personal requirements should be managed by the participants themselves.",
      "Accommodation is strictly for registered RoboFest participants - no outside guests are allowed.",
      "Accommodation for boys will be provided in dormitory-type Non-AC rooms on a first-come, first-served basis.",
      "The cost is ₹600 per day, inclusive of three meals. Participants opting for 3 days can avail it at a discounted rate of ₹1600.",
    ],
    generalRules: [
      {
        title: "Safety First",
        content:
          "All participants must prioritize safety in design, testing, and competition. Dangerous behavior or unsafe bots will be disqualified.",
      },
      {
        title: "No Physical Harm",
        content:
          "Robots must not cause intentional harm to humans, other teams, or the event venue.",
      },
      {
        title: "Fair Play",
        content:
          "Maintain integrity and honesty in all activities, including coding, designing, and during matches. Cheating or tampering with other robots is strictly prohibited.",
      },
      {
        title: "Environmental Responsibility",
        content:
          "Use eco-friendly materials wherever possible and dispose of electronic waste responsibly.",
      },
    ],
  },
};
