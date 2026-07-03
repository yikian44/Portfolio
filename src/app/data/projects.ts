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
    slug: "meridian-finance",
    idx: "01",
    title: "Meridian Finance",
    category: "Product Design",
    year: "2024",
    role: "Lead Product Designer",
    duration: "6 months",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=640&fit=crop&auto=format",
    heroImg: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1600&h=900&fit=crop&auto=format",
    secondImg: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=700&fit=crop&auto=format",
    tags: ["Research", "Systems", "Prototyping"],
    tagline: "Redesigning wealth management for 2.4M users",
    overview: "Meridian Finance tasked us with a complete overhaul of their flagship wealth management platform — a system used daily by over 2.4 million retail investors and financial advisors across North America. The brief was clear: make complex financial decisions feel intuitive without stripping away the depth that power users depend on.",
    challenge: "The existing interface had accumulated years of feature additions without coherent design governance. Users struggled to navigate between portfolio management, trading, and reporting tools. Average task completion times were 40% above industry benchmarks, support costs were rising, and premium-tier client retention was declining quarter over quarter.",
    approach: [
      "48 in-depth user interviews across three distinct user segments",
      "Journey mapping of 130+ task sequences to isolate friction points",
      "Unified component system of 280+ documented, tokenised components",
      "6 iterative prototype rounds with quantitative usability benchmarking",
      "Staged rollout strategy validated with a 12,000-user beta cohort",
    ],
    outcome: "The redesigned platform launched to Meridian's full subscriber base in Q2 2024. Task completion time dropped by 38%, the System Usability Scale score rose to 92 (from 61), and the platform recorded an 18-point NPS lift within the first quarter post-launch.",
    metrics: [
      { value: "38%", label: "Faster task\ncompletion" },
      { value: "+18", label: "NPS lift\nin Q1" },
      { value: "92", label: "SUS score\n(from 61)" },
    ],
  },
  {
    id: 2,
    slug: "forma-studio",
    idx: "02",
    title: "Forma Studio",
    category: "Brand & Identity",
    year: "2024",
    role: "Creative Director",
    duration: "8 weeks",
    img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&h=640&fit=crop&auto=format",
    heroImg: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1600&h=900&fit=crop&auto=format",
    secondImg: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&h=700&fit=crop&auto=format",
    tags: ["Brand", "Web Design", "Motion"],
    tagline: "Identity and digital presence for a Berlin architecture collective",
    overview: "Forma Studio is a Berlin-based architecture collective working at the intersection of residential design and public space. They needed an identity and digital presence that could hold its own against an international portfolio of built work — precise, confident, and resistant to trend.",
    challenge: "Architecture studios often default to either sterile minimalism or over-designed showpieces. Forma wanted neither. Their existing presence was a holding page — they had no visual language, no typographic system, and no way to contextualise the breadth of their practice online.",
    approach: [
      "Brand strategy workshop distilling 12 years of practice into core principles",
      "Typographic identity built around modified geometric grotesque with editorial hierarchy",
      "Digital-first colour system adapted for print, environmental, and screen contexts",
      "Custom CMS architecture allowing the team to self-publish case studies",
      "Motion language system defining transitions across web, presentation, and video",
    ],
    outcome: "The identity launched in March 2024 across web, print, and environmental applications. Within 10 weeks, Forma received two unsolicited international project enquiries directly attributable to the new web presence, and the studio was shortlisted for a European design award.",
    metrics: [
      { value: "8wk", label: "Strategy to\nfull launch" },
      { value: "2×", label: "Unsolicited\nproject leads" },
      { value: "1", label: "Award\nshortlist" },
    ],
  },
  {
    id: 3,
    slug: "drift-os",
    idx: "03",
    title: "Drift OS",
    category: "Interaction Design",
    year: "2023",
    role: "Interaction Designer",
    duration: "9 months",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=640&fit=crop&auto=format",
    heroImg: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1600&h=900&fit=crop&auto=format",
    secondImg: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=700&fit=crop&auto=format",
    tags: ["Research", "Interaction", "HMI"],
    tagline: "Head-up display interface for next-generation autonomous vehicles",
    overview: "Drift is a mobility technology company developing Level 3 autonomous vehicles for shared urban transport. We were engaged to design the in-cabin head-up display (HUD) and secondary touchscreen interface — the visual layer that communicates the vehicle's intent to passengers who are no longer in control.",
    challenge: "When passengers surrender control to an autonomous system, trust becomes the primary design problem. Existing in-vehicle interfaces either overcommunicate — flooding the cabin with data — or undercommunicate, leaving passengers anxious about what the system is doing and why. Neither approach scales to the psychological demands of full autonomy.",
    approach: [
      "Ethnographic research with 220 participants across 6 countries in simulated autonomous scenarios",
      "Developed the Trust Calibration Model — a framework for contextual information disclosure",
      "Designed three interface density modes toggled by context: city, highway, and transfer",
      "Built an eye-tracking validated hierarchy of ambient, advisory, and alert states",
      "Conducted physical prototype testing in Drift's Stuttgart evaluation facility",
    ],
    outcome: "The Drift OS interface entered production integration in late 2023. Passenger anxiety scores (measured via validated questionnaire) dropped 44% compared to the previous interface, and the system passed regulatory HMI review on first submission across all six target markets.",
    metrics: [
      { value: "44%", label: "Anxiety\nreduction" },
      { value: "6", label: "Markets passed\nregulatory HMI" },
      { value: "220", label: "Research\nparticipants" },
    ],
  },
  {
    id: 4,
    slug: "nucleus-health",
    idx: "04",
    title: "Nucleus Health",
    category: "Mobile App",
    year: "2023",
    role: "UI/UX Designer",
    duration: "7 months",
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&h=640&fit=crop&auto=format",
    heroImg: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1600&h=900&fit=crop&auto=format",
    secondImg: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200&h=700&fit=crop&auto=format",
    tags: ["Research", "UI Design", "Access."],
    tagline: "Chronic care management built around the patient, not the protocol",
    overview: "Nucleus Health is a digital health platform focused on chronic condition management — specifically designed for patients navigating type 2 diabetes, hypertension, and comorbid presentations. The challenge was to build something clinically rigorous enough for healthcare provider integration while remaining genuinely usable by patients with varying digital literacy.",
    challenge: "Most chronic care apps fail at one of two ends: they're either clinical tools dressed as consumer apps (confusing, jargon-heavy), or lifestyle apps that can't satisfy clinical data requirements. Nucleus needed to occupy the difficult middle ground — trusted by clinicians, loved by patients.",
    approach: [
      "Co-design sessions with 34 patients across three chronic condition cohorts",
      "Clinical workflow mapping with 18 participating endocrinologists and cardiologists",
      "Accessibility audit and redesign targeting WCAG 2.1 AA — with elderly user group testing",
      "Adaptive UI system that simplifies interface complexity based on engagement patterns",
      "HIPAA-compliant data architecture review with security and legal teams",
    ],
    outcome: "Nucleus launched to a closed beta of 8,000 patients in mid-2023, scaling to 600,000 active users by year end. The app achieved a 4.8-star App Store rating, a 78% 90-day retention rate (category average: 31%), and was selected as a preferred patient engagement platform by two major US health systems.",
    metrics: [
      { value: "600k", label: "Active users\nat 18 months" },
      { value: "4.8★", label: "App Store\nrating" },
      { value: "78%", label: "90-day\nretention" },
    ],
  },
];
