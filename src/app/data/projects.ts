export interface ProjectMetric {
  value: string;
  label: string;
}

export interface Project {
  id: number;
  slug: string;
  idx: string;
  title: string;
  category: string;
  year: string;
  role: string;
  duration: string;
  img: string;
  heroImg: string;
  secondImg: string;
  tags: readonly string[];
  tagline: string;
  overview: string;
  challenge: string;
  approach: string[];
  outcome: string;
  metrics: ProjectMetric[];
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    slug: "jalan-square",
    idx: "01",
    title: "JALAN SQUARE",
    category: "003 //",
    year: "2026",
    role: "Designer",
    duration: "4 weeks",
    img: "/jalan-square-cover.jpg",
    heroImg: "/jalan-square-cover.jpg",
    secondImg: "/jalan-square-cover.jpg",
    tags: ["UI/UX", "Interactive"],
    tagline: "Live Preview: https://www.figma.com/proto/UvyZ4mWLooxRDjwbhJFRAj/Jalan-Square?node-id=451-610&t=c2dQCzUzX64cykse-1",
    overview: "Jalan Square is an interactive design prototype created to explore spatial UI elements.",
    challenge: "Designing an intuitive interactive layout within a constrained space.",
    approach: ["Figma Prototyping", "Interactive Design"],
    outcome: "Successfully created an interactive prototype for user testing.",
    metrics: [{ value: "100%", label: "Completion" }],
  },
  {
    id: 2,
    slug: "imperfect-vessel",
    idx: "02",
    title: "IMPERFECT VESSEL",
    category: "002 //",
    year: "2026",
    role: "Designer & Developer",
    duration: "4 weeks",
    img: "/imperfect-vessel.jpg",
    heroImg: "/imperfect-vessel.jpg",
    secondImg: "/imperfect-vessel.jpg",
    tags: ["Web Design", "Development"],
    tagline: "Live Preview: https://yikian44.github.io/Imperfect-vessel-1/",
    overview: "Imperfect Vessel explores creative web experiences and storytelling.",
    challenge: "Developing a creative web experience while maintaining smooth performance.",
    approach: ["Web Development", "Design", "CSS Animations"],
    outcome: "Successfully launched the site with engaging visuals.",
    metrics: [{ value: "100%", label: "Completion" }],
  },
  {
    id: 3,
    slug: "daily-sedap",
    idx: "03",
    title: "DAILY SEDAP",
    category: "003 //",
    year: "2025",
    role: "Content Creator",
    duration: "Ongoing",
    img: "/daily-sedap.png",
    heroImg: "/daily-sedap.png",
    secondImg: "/daily-sedap.png",
    tags: ["Social Media", "Video"],
    tagline: "Live Preview: https://www.tiktok.com/@dailysedap?refer=creator_embed",
    overview: "Daily Sedap is a TikTok content series focusing on food and culinary experiences.",
    challenge: "Creating engaging content that stands out in a crowded social media space.",
    approach: ["Video Editing", "Content Strategy", "Trend Analysis"],
    outcome: "Achieved high engagement and views on TikTok.",
    metrics: [{ value: "High", label: "Engagement" }],
  },

  {
    id: 4,
    slug: "lobster-atlas",
    idx: "04",
    title: "LOBSTER ATLAS",
    category: "002 //",
    year: "2025",
    role: "Designer & Developer",
    duration: "4 weeks",
    img: "/lobster-atlas-cover-2.jpg",
    heroImg: "/lobster-atlas-cover-2.jpg",
    secondImg: "/lobster-atlas-cover-2.jpg",
    tags: ["Web Design", "Development"],
    tagline: "Live Preview: https://lobsteryikian.netlify.app/",
    overview: "Lobster Atlas is an informational and interactive project mapping out lobster species.",
    challenge: "Creating an interactive atlas that is both informative and visually engaging.",
    approach: ["Data Mapping", "Web Development", "UI Design"],
    outcome: "An engaging informational site successfully deployed.",
    metrics: [{ value: "100%", label: "Completion" }],
  }
];
