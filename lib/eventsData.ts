export interface EventItem {
  number: string;
  title: string;
  tag: string;
  description: string;
  prize: string;
  fee: string;
  earlyBirdFee?: string;
  venue: string;
  team: string;
  date?: string;
  color: string;
  backgroundImage?: string;
  rulebookUrl?: string;
  rulebookLabel?: string;
  rulebookUrl2?: string;
  rulebookLabel2?: string;
  registerUrl?: string;
}

export const DEFAULT_EVENTS: EventItem[] = [
  {
    number: "01",
    title: "Robo War",
    tag: "Combat",
    description:
      "Arena combat robotics. Build your bot, outmaneuver opponents, and survive the final clash.",
    prize: "₹3,50,000",
    fee: "₹4,800",
    earlyBirdFee: "₹4,320",
    venue: "Vendhir Square / BB Court",
    team: "4 members",
    color: "#b83224",
    backgroundImage: "/images/events/war.jpg",
    rulebookUrl: "",
    rulebookLabel: "15kg Rulebook",
    rulebookUrl2: "",
    rulebookLabel2: "60kg Rulebook",
  },
  {
    number: "02",
    title: "Robo Soccer 1v1",
    tag: "Battle",
    description:
      "One robot, one opponent, one goal. Head-to-head robotic football with pure control and aggression.",
    prize: "₹30,000",
    fee: "₹720",
    earlyBirdFee: "₹648",
    venue: "702 TP2",
    team: "2 members",
    color: "#1a1612",
    backgroundImage: "/images/events/soccer.jpg",
    rulebookUrl: "",
  },
  {
    number: "03",
    title: "Robo Soccer 2v2",
    tag: "Battle",
    description:
      "Team strategy meets machine control. Coordinate two bots and dominate the robotic pitch.",
    prize: "₹50,000",
    fee: "₹720",
    earlyBirdFee: "₹648",
    venue: "702 TP2",
    team: "4 members",
    color: "#c4410c",
    backgroundImage: "/images/events/soccer2.jpg",
    rulebookUrl: "",
  },
  {
    number: "04",
    title: "Robo Sumo",
    tag: "Combat",
    description:
      "Push or be pushed. Enter the ring and force your rival out to claim victory.",
    prize: "₹50,000",
    fee: "₹720",
    earlyBirdFee: "₹648",
    venue: "702 TP2",
    team: "2 members",
    color: "#2a2018",
    backgroundImage: "/images/events/sumo.png",
    rulebookUrl: "",
  },
  {
    number: "05",
    title: "OBS Race",
    tag: "Speed",
    description:
      "Race through obstacles at full throttle. Precision handling and speed decide the winner.",
    prize: "₹40,000",
    fee: "₹480",
    earlyBirdFee: "₹432",
    venue: "Milkha Singh Ground",
    team: "2 members",
    color: "#b83224",
    backgroundImage: "/images/events/obs.png",
    rulebookUrl: "",
  },
  {
    number: "06",
    title: "Drone Race",
    tag: "Speed",
    description:
      "High-speed aerial racing through technical gates. Reflexes, stability, and control are everything.",
    prize: "₹1,00,000",
    fee: "₹1,200",
    earlyBirdFee: "₹1,080",
    venue: "Milkha Singh Ground",
    team: "2 members",
    color: "#1a1612",
    backgroundImage: "/images/events/drone.jpg",
    rulebookUrl: "",
  },
  {
    number: "07",
    title: "LFR",
    tag: "Precision",
    description:
      "Line Follower Robot challenge. Build the fastest bot that can track the path without error.",
    prize: "₹30,000",
    fee: "₹360",
    earlyBirdFee: "₹324",
    venue: "712 TP2",
    team: "2 members",
    color: "#c4410c",
    backgroundImage: "/images/events/lfr.jpg",
    rulebookUrl: "",
  },
  {
    number: "08",
    title: "Expo",
    tag: "Open",
    description:
      "Showcase your engineering ideas and prototypes to judges, peers, and industry visitors.",
    prize: "₹25,000",
    fee: "₹200",
    earlyBirdFee: "₹200",
    venue: "702 TP2",
    team: "5 members",
    color: "#2a2018",
    backgroundImage: "/images/events/expo.jpg",
    rulebookUrl: "",
    registerUrl: "https://forms.gle/j7rTpoYgBip3Zc3s6",
  },
  {
    number: "09",
    title: "Boat Race",
    tag: "Speed",
    description:
      "Design and build a high-performance water bot that can race through the course with speed and stability.",
    prize: "₹25,000",
    fee: "₹240",
    earlyBirdFee: "₹216",
    venue: "Fountain opposite of TP Ganeshan",
    team: "3 members",
    color: "#b83224",
    backgroundImage: "/images/events/obs.png",
    rulebookUrl: "",
  },
];
