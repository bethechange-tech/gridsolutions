/* ──────────────────────────────────────────────
 *  Services Data — single source of truth
 *  Powers: homepage Products section, individual
 *  /services/[slug] pages, and nav links.
 *  ★ Swap for a CMS/DB later — shape stays the same.
 * ────────────────────────────────────────────── */

export interface ServiceFeature {
  title: string;
  description: string;
}

export interface ServiceStat {
  value: string;
  label: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface Service {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  icon: string;                // SVG path data for the icon
  features: ServiceFeature[];
  process: ProcessStep[];      // step-by-step engagement process
  technologies: string[];
  stats: ServiceStat[];
  cta: string;                 // call-to-action text
}

export const SERVICES: Service[] = [
  {
    slug: "software-consultancy",
    name: "Software Consultancy",
    tagline: "Strategy. Architecture. Delivery.",
    description:
      "Technical strategy, architecture reviews, and hands-on engineering guidance to help you build the right thing, the right way.",
    longDescription:
      "Building software is expensive — building the wrong software is devastating. Our consultants work alongside your team to define technical strategy, review architecture decisions, audit existing codebases, and provide fractional CTO-level guidance. Whether you're a startup choosing your first stack or a scale-up untangling tech debt, we help you make confident engineering decisions that compound over time.",
    icon: "code",
    features: [
      {
        title: "Technical Strategy",
        description: "Stack selection, build-vs-buy analysis, and technology roadmaps aligned to your business goals and runway.",
      },
      {
        title: "Architecture Reviews",
        description: "Deep-dive analysis of your system design — identifying bottlenecks, single points of failure, and scaling risks before they bite.",
      },
      {
        title: "Code & Security Audits",
        description: "Comprehensive codebase reviews covering quality, test coverage, dependency risks, and security vulnerabilities.",
      },
      {
        title: "Fractional CTO",
        description: "Senior technical leadership on a part-time basis — hiring guidance, vendor evaluation, and engineering culture.",
      },
      {
        title: "Team Upskilling",
        description: "Workshops and pairing sessions to level up your engineering team on modern practices, tooling, and architecture patterns.",
      },
      {
        title: "MVP Scoping & Delivery",
        description: "From idea to shipped product — we scope, prioritise, and build your minimum viable product fast and lean.",
      },
    ],
    process: [
      { title: "Discovery Call", description: "A 30-minute call to understand your business, technical challenges, and what success looks like." },
      { title: "Technical Deep-Dive", description: "We audit your codebase, infrastructure, and team processes to build a full picture of where you are." },
      { title: "Strategy & Recommendations", description: "A clear, actionable report with prioritised recommendations, trade-offs, and a suggested roadmap." },
      { title: "Implementation Support", description: "Hands-on pairing, architecture guidance, and PR reviews as your team executes the plan." },
      { title: "Review & Iterate", description: "Regular check-ins to assess progress, adjust priorities, and ensure the strategy stays aligned to your goals." },
    ],
    technologies: ["TypeScript", "React", "Next.js", "Node.js", "Python", "PostgreSQL", "AWS", "Docker"],
    stats: [
      { value: "40+", label: "Companies advised" },
      { value: "3 wks", label: "Avg. time to clarity" },
      { value: "92%", label: "Client retention" },
      { value: "£2.1M", label: "Saved in tech debt costs" },
    ],
    cta: "Book a Strategy Call",
  },
  {
    slug: "brand-building",
    name: "Brand Building",
    tagline: "Identity. Presence. Growth.",
    description:
      "We craft compelling digital brands — from visual identity and messaging to web presence — that help growing businesses stand out and scale.",
    longDescription:
      "Your brand is more than a logo. It's how customers feel about your business before they ever speak to you. We help founders and growing companies define their brand positioning, create cohesive visual identities, and build web presences that convert. From naming and tone of voice to full design systems and marketing sites, we turn ambiguity into a brand your customers remember and trust.",
    icon: "palette",
    features: [
      {
        title: "Brand Strategy & Positioning",
        description: "Workshop-led brand discovery — mission, values, audience mapping, competitive positioning, and messaging frameworks.",
      },
      {
        title: "Visual Identity Design",
        description: "Logo, colour palette, typography, iconography, and a full brand guidelines document your team can use consistently.",
      },
      {
        title: "Website Design & Build",
        description: "High-performance marketing sites built in Next.js — designed to tell your story and convert visitors into customers.",
      },
      {
        title: "Content & Copywriting",
        description: "Brand voice development, website copy, and content templates that sound like you — not a template.",
      },
      {
        title: "Social & Digital Presence",
        description: "Branded social media kits, email templates, and pitch deck design so every touchpoint feels cohesive.",
      },
      {
        title: "Ongoing Brand Support",
        description: "Retainer-based design and content support so your brand evolves as your business grows.",
      },
    ],
    process: [
      { title: "Brand Discovery Workshop", description: "A collaborative session to uncover your story, audience, competitors, and the feeling you want your brand to evoke." },
      { title: "Strategy & Moodboarding", description: "We synthesise research into a strategic direction — with moodboards, tone references, and positioning statements for your sign-off." },
      { title: "Visual Identity Design", description: "Logo concepts, colour systems, typography, and brand assets — refined through structured feedback rounds." },
      { title: "Website & Collateral Build", description: "We design and develop your web presence plus key brand collateral — business cards, social kits, pitch decks." },
      { title: "Brand Guidelines & Handover", description: "A comprehensive brand book and asset library so your team (or future designers) can maintain consistency." },
    ],
    technologies: ["Figma", "Next.js", "Tailwind CSS", "Framer Motion", "Vercel", "Adobe Creative Suite", "Webflow", "Notion"],
    stats: [
      { value: "60+", label: "Brands launched" },
      { value: "3×", label: "Avg. conversion lift" },
      { value: "4.9★", label: "Client satisfaction" },
      { value: "< 4 wks", label: "Brand-to-launch" },
    ],
    cta: "Start Your Brand",
  },
];

/** Helper — find a service by slug */
export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
