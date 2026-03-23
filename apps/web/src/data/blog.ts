export interface BlogAuthor {
  name: string;
  avatar: string; // initials-based color
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverGradient: string; // CSS gradient as placeholder for images
  coverIcon: string; // emoji/symbol overlay
  author: BlogAuthor;
  readTime: string;
  date: string;
  featured?: boolean;
}

const authors: Record<string, BlogAuthor> = {
  sarah: { name: "Sarah Mitchell", avatar: "bg-emerald-500" },
  james: { name: "James Carter", avatar: "bg-blue-500" },
  olivia: { name: "Olivia Chen", avatar: "bg-purple-500" },
  ryan: { name: "Ryan Brooks", avatar: "bg-orange-500" },
  emma: { name: "Emma Patel", avatar: "bg-pink-500" },
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "unlocking-business-efficiency-cloud-native",
    title: "Unlocking Business Efficiency with Cloud-Native Architecture",
    excerpt:
      "Discover how modern cloud-native strategies are reshaping enterprise infrastructure, cutting costs by up to 40%, and enabling teams to ship features faster than ever.",
    category: "Cloud",
    coverGradient: "from-gray-800 via-gray-700 to-gray-900",
    coverIcon: "☁️",
    author: authors.sarah,
    readTime: "6 min read",
    date: "15 Mar 2026",
    featured: true,
  },
  {
    slug: "zero-trust-security-modern-enterprise",
    title: "Revolutionising Enterprise Security with Zero-Trust Frameworks",
    excerpt:
      "Zero-trust isn't just a buzzword — it's the new baseline. Learn how leading organisations are implementing identity-first security to protect distributed workforces.",
    category: "Cybersecurity",
    coverGradient: "from-slate-800 via-slate-700 to-slate-900",
    coverIcon: "🔒",
    author: authors.james,
    readTime: "5 min read",
    date: "12 Mar 2026",
    featured: true,
  },
  {
    slug: "data-driven-decision-making-analytics",
    title: "Data-Driven Decision Making: A Practical Guide for Leaders",
    excerpt:
      "Explore the principles and techniques that drive data-centric leadership — from building analytics culture to choosing the right KPIs for measurable growth.",
    category: "Analytics",
    coverGradient: "from-zinc-800 via-zinc-700 to-zinc-900",
    coverIcon: "📊",
    author: authors.olivia,
    readTime: "7 min read",
    date: "9 Mar 2026",
    featured: true,
  },
  {
    slug: "scaling-saas-platforms-microservices",
    title: "Scaling SaaS Platforms with Microservices Done Right",
    excerpt:
      "Microservices promise scalability but often deliver complexity. Here's how to architect, decompose, and operate distributed systems without the chaos.",
    category: "Engineering",
    coverGradient: "from-neutral-800 via-neutral-700 to-neutral-900",
    coverIcon: "⚙️",
    author: authors.ryan,
    readTime: "8 min read",
    date: "5 Mar 2026",
    featured: true,
  },
  {
    slug: "navigating-digital-transformation-strategy",
    title: "Navigating Digital Transformation Without Losing Focus",
    excerpt:
      "Digital transformation fails when it becomes a technology project instead of a business strategy. Learn the proven frameworks top consultancies use to drive real outcomes.",
    category: "Strategy",
    coverGradient: "from-stone-800 via-stone-700 to-stone-900",
    coverIcon: "🧭",
    author: authors.emma,
    readTime: "4 min read",
    date: "1 Mar 2026",
    featured: true,
  },
  {
    slug: "crafting-seamless-developer-experience",
    title: "Crafting Seamless Developer Experience: The Art of Internal Tooling",
    excerpt:
      "Great developer experience isn't a luxury — it's a multiplier. Explore how investing in internal tooling, CI/CD pipelines, and platform engineering accelerates delivery.",
    category: "Engineering",
    coverGradient: "from-gray-900 via-gray-800 to-black",
    coverIcon: "🛠️",
    author: authors.james,
    readTime: "5 min read",
    date: "26 Feb 2026",
  },
  {
    slug: "beyond-dashboards-power-of-embedded-analytics",
    title: "Beyond Dashboards: The Power of Embedded Analytics",
    excerpt:
      "Dashboards are just the beginning. Delve into the realm of embedded analytics and discover how surfacing insights within workflows drives faster, smarter decisions.",
    category: "Analytics",
    coverGradient: "from-zinc-900 via-zinc-800 to-black",
    coverIcon: "📈",
    author: authors.olivia,
    readTime: "6 min read",
    date: "22 Feb 2026",
  },
  {
    slug: "ai-consulting-responsible-implementation",
    title: "AI in Consulting: A Framework for Responsible Implementation",
    excerpt:
      "AI adoption in professional services requires guardrails. We break down ethical considerations, bias mitigation, and practical deployment strategies for consultancies.",
    category: "AI & Innovation",
    coverGradient: "from-slate-900 via-slate-800 to-black",
    coverIcon: "🤖",
    author: authors.sarah,
    readTime: "7 min read",
    date: "18 Feb 2026",
  },
  {
    slug: "building-resilient-infrastructure-chaos-engineering",
    title: "Building Resilient Infrastructure Through Chaos Engineering",
    excerpt:
      "If you haven't tested failure, you haven't tested at all. Learn how chaos engineering practices help enterprises build truly resilient, self-healing systems.",
    category: "Cloud",
    coverGradient: "from-neutral-900 via-neutral-800 to-black",
    coverIcon: "💥",
    author: authors.ryan,
    readTime: "5 min read",
    date: "14 Feb 2026",
  },
];

export const BLOG_CATEGORIES = [
  "All",
  ...Array.from(new Set(BLOG_POSTS.map((p) => p.category))),
];

export function getFeaturedPost(): BlogPost {
  return BLOG_POSTS[0];
}

export function getOtherFeaturedPosts(): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.featured).slice(1, 6);
}

export function getRecentPosts(): BlogPost[] {
  return BLOG_POSTS.filter((p) => !p.featured || BLOG_POSTS.indexOf(p) > 0);
}
