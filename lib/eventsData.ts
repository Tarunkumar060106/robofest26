export interface EventItem {
  number: string;
  title: string;
  tag: string;
  description: string;
  prize: string;
  fee: string;
  venue: string;
  team: string;
  color: string;
  backgroundImage?: string;
}

export const DEFAULT_EVENTS: EventItem[] = [
  {
    number: "01",
    title: "Robo War",
    tag: "Combat",
    description:
      "Arena combat robotics. Build your bot, outmaneuver opponents, and survive the final clash.",
    prize: "₹3,50,000",
    fee: "₹2,000",
    venue: "Vendhir Square",
    team: "4 members",
    color: "#b83224",
    backgroundImage: "/images/events/war.jpg",
  },
  {
    number: "02",
    title: "Robo Soccer 1v1",
    tag: "Battle",
    description:
      "One robot, one opponent, one goal. Head-to-head robotic football with pure control and aggression.",
    prize: "₹50,000",
    fee: "₹500",
    venue: "Vendhir Square, TP2, Hangar",
    team: "2 members",
    color: "#1a1612",
    backgroundImage: "/images/events/soccer.jpg",
  },
  {
    number: "03",
    title: "Robo Soccer 2v2",
    tag: "Battle",
    description:
      "Team strategy meets machine control. Coordinate two bots and dominate the robotic pitch.",
    prize: "₹30,000",
    fee: "₹800",
    venue: "Vendhir Square, TP2, Hangar",
    team: "4 members",
    color: "#c4410c",
  },
  {
    number: "04",
    title: "Robo Sumo",
    tag: "Combat",
    description:
      "Push or be pushed. Enter the ring and force your rival out to claim victory.",
    prize: "₹50,000",
    fee: "₹600",
    venue: "TP2",
    team: "2 members",
    color: "#2a2018",
    backgroundImage: "/images/events/sumo.png",
  },
  {
    number: "05",
    title: "OBS Race",
    tag: "Speed",
    description:
      "Race through obstacles at full throttle. Precision handling and speed decide the winner.",
    prize: "₹40,000",
    fee: "₹1,000",
    venue: "Milkha Singh Ground",
    team: "2 members",
    color: "#b83224",
    backgroundImage: "/images/events/obs.png",
  },
  {
    number: "06",
    title: "Drone Race",
    tag: "Speed",
    description:
      "High-speed aerial racing through technical gates. Reflexes, stability, and control are everything.",
    prize: "₹1,00,000",
    fee: "₹400",
    venue: "Milkha Singh Ground",
    team: "2 members",
    color: "#1a1612",
    backgroundImage: "/images/events/drone.jpg",
  },
  {
    number: "07",
    title: "LFR",
    tag: "Precision",
    description:
      "Line Follower Robot challenge. Build the fastest bot that can track the path without error.",
    prize: "₹30,000",
    fee: "₹300",
    venue: "TP2",
    team: "2 members",
    color: "#c4410c",
    backgroundImage: "/images/events/lfr.jpg",
  },
  {
    number: "08",
    title: "Expo",
    tag: "Open",
    description:
      "Showcase your engineering ideas and prototypes to judges, peers, and industry visitors.",
    prize: "₹25,000",
    fee: "₹1,000",
    venue: "Mini Hall",
    team: "5 members",
    color: "#2a2018",
  },
  {
    number: "09",
    title: "Boat Race",
    tag: "Speed",
    description:
      "Design and build a high-performance water bot that can race through the course with speed and stability.",
    prize: "₹25,000",
    fee: "₹500",
    venue: "Fountain opposite of TP Gate",
    team: "3 members",
    color: "#b83224",
    backgroundImage: "/images/events/obs.png",
  },
];
