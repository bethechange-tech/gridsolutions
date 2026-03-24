/* ──────────────────────────────────────────────
 *  Database Seed Script
 *  Seeds products, blog posts, and sample
 *  transactions (with orders + stages) into the
 *  Supabase database via Prisma.
 *
 *  Run: pnpm --filter @repo/db seed
 * ────────────────────────────────────────────── */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg(
  { connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL },
  { schema: "tenuq" }
);
const db = new PrismaClient({ adapter });

// ─── Products ───────────────────────────────────────────

const products = [
  {
    id: "strategy-session",
    name: "Strategy Session",
    subtitle: "One-Off",
    description:
      "A focused 90-minute technical strategy session — stack advice, architecture direction, and next steps.",
    category: "consulting",
    basePrice: 29900, // £299.00 in pence
    consultationPrice: 4900, // £49.00
    currency: "GBP",
    billingCycle: "mo",
    features: ["90-min deep-dive", "Written recommendations", "Follow-up call"],
    popular: false,
  },
  {
    id: "code-audit",
    name: "Code & Architecture Audit",
    subtitle: "Standard",
    description:
      "Comprehensive codebase review covering quality, security, and scalability — with a clear action plan.",
    category: "consulting",
    basePrice: 59900, // £599.00
    consultationPrice: 9900, // £99.00
    currency: "GBP",
    billingCycle: "mo",
    features: ["Full repo audit", "Security review", "Prioritised roadmap"],
    popular: true,
  },
  {
    id: "fractional-cto",
    name: "Fractional CTO",
    subtitle: "Retainer",
    description:
      "Part-time senior technical leadership — hiring, architecture, and engineering culture on tap.",
    category: "consulting",
    basePrice: 299900, // £2,999.00
    consultationPrice: 14900, // £149.00
    currency: "GBP",
    billingCycle: "mo",
    features: ["Weekly syncs", "Hiring support", "Vendor evaluation"],
    popular: false,
  },
  {
    id: "brand-identity",
    name: "Brand Identity Package",
    subtitle: "Complete",
    description:
      "Logo, colour system, typography, and a brand guidelines document — everything you need to look the part.",
    category: "branding",
    basePrice: 149900, // £1,499.00
    consultationPrice: 7900, // £79.00
    currency: "GBP",
    billingCycle: "mo",
    features: ["Logo design", "Colour & type system", "Brand guidelines PDF"],
    popular: false,
  },
  {
    id: "website-build",
    name: "Marketing Website",
    subtitle: "Starter",
    description:
      "A high-performance Next.js marketing site — designed to convert visitors into customers.",
    category: "branding",
    basePrice: 99900, // £999.00
    consultationPrice: 6900, // £69.00
    currency: "GBP",
    billingCycle: "mo",
    features: ["Custom design", "Mobile responsive", "SEO optimised"],
    popular: false,
  },
  {
    id: "brand-support",
    name: "Ongoing Brand Support",
    subtitle: "Retainer",
    description:
      "Monthly design and content support so your brand evolves as your business grows.",
    category: "branding",
    basePrice: 49900, // £499.00
    consultationPrice: 4900, // £49.00
    currency: "GBP",
    billingCycle: "mo",
    features: [
      "Design requests",
      "Content updates",
      "Quarterly brand review",
    ],
    popular: false,
  },
];

// ─── Blog Posts ─────────────────────────────────────────

const blogPosts = [
  {
    slug: "unlocking-business-efficiency-cloud-native",
    title: "Unlocking Business Efficiency with Cloud-Native Architecture",
    excerpt:
      "Discover how modern cloud-native strategies are reshaping enterprise infrastructure, cutting costs by up to 40%, and enabling teams to ship features faster than ever.",
    category: "Cloud",
    authorName: "Sarah Mitchell",
    authorAvatar: "bg-emerald-500",
    readTime: "6 min read",
    coverGradient: "from-gray-800 via-gray-700 to-gray-900",
    coverIcon: "☁️",
    featured: true,
    publishedAt: new Date("2026-03-15"),
  },
  {
    slug: "zero-trust-security-modern-enterprise",
    title: "Revolutionising Enterprise Security with Zero-Trust Frameworks",
    excerpt:
      "Zero-trust isn't just a buzzword — it's the new baseline. Learn how leading organisations are implementing identity-first security to protect distributed workforces.",
    category: "Cybersecurity",
    authorName: "James Carter",
    authorAvatar: "bg-blue-500",
    readTime: "5 min read",
    coverGradient: "from-slate-800 via-slate-700 to-slate-900",
    coverIcon: "🔒",
    featured: true,
    publishedAt: new Date("2026-03-12"),
  },
  {
    slug: "data-driven-decision-making-analytics",
    title: "Data-Driven Decision Making: A Practical Guide for Leaders",
    excerpt:
      "Explore the principles and techniques that drive data-centric leadership — from building analytics culture to choosing the right KPIs for measurable growth.",
    category: "Analytics",
    authorName: "Olivia Chen",
    authorAvatar: "bg-purple-500",
    readTime: "7 min read",
    coverGradient: "from-zinc-800 via-zinc-700 to-zinc-900",
    coverIcon: "📊",
    featured: true,
    publishedAt: new Date("2026-03-09"),
  },
  {
    slug: "scaling-saas-platforms-microservices",
    title: "Scaling SaaS Platforms with Microservices Done Right",
    excerpt:
      "Microservices promise scalability but often deliver complexity. Here's how to architect, decompose, and operate distributed systems without the chaos.",
    category: "Engineering",
    authorName: "Ryan Brooks",
    authorAvatar: "bg-orange-500",
    readTime: "8 min read",
    coverGradient: "from-neutral-800 via-neutral-700 to-neutral-900",
    coverIcon: "⚙️",
    featured: true,
    publishedAt: new Date("2026-03-05"),
  },
  {
    slug: "navigating-digital-transformation-strategy",
    title: "Navigating Digital Transformation Without Losing Focus",
    excerpt:
      "Digital transformation fails when it becomes a technology project instead of a business strategy. Learn the proven frameworks top consultancies use to drive real outcomes.",
    category: "Strategy",
    authorName: "Emma Patel",
    authorAvatar: "bg-pink-500",
    readTime: "4 min read",
    coverGradient: "from-stone-800 via-stone-700 to-stone-900",
    coverIcon: "🧭",
    featured: true,
    publishedAt: new Date("2026-03-01"),
  },
  {
    slug: "crafting-seamless-developer-experience",
    title:
      "Crafting Seamless Developer Experience: The Art of Internal Tooling",
    excerpt:
      "Great developer experience isn't a luxury — it's a multiplier. Explore how investing in internal tooling, CI/CD pipelines, and platform engineering accelerates delivery.",
    category: "Engineering",
    authorName: "James Carter",
    authorAvatar: "bg-blue-500",
    readTime: "5 min read",
    coverGradient: "from-gray-900 via-gray-800 to-black",
    coverIcon: "🛠️",
    featured: false,
    publishedAt: new Date("2026-02-26"),
  },
  {
    slug: "beyond-dashboards-power-of-embedded-analytics",
    title: "Beyond Dashboards: The Power of Embedded Analytics",
    excerpt:
      "Dashboards are just the beginning. Delve into the realm of embedded analytics and discover how surfacing insights within workflows drives faster, smarter decisions.",
    category: "Analytics",
    authorName: "Olivia Chen",
    authorAvatar: "bg-purple-500",
    readTime: "6 min read",
    coverGradient: "from-zinc-900 via-zinc-800 to-black",
    coverIcon: "📈",
    featured: false,
    publishedAt: new Date("2026-02-22"),
  },
  {
    slug: "ai-consulting-responsible-implementation",
    title: "AI in Consulting: A Framework for Responsible Implementation",
    excerpt:
      "AI adoption in professional services requires guardrails. We break down ethical considerations, bias mitigation, and practical deployment strategies for consultancies.",
    category: "AI & Innovation",
    authorName: "Sarah Mitchell",
    authorAvatar: "bg-emerald-500",
    readTime: "7 min read",
    coverGradient: "from-slate-900 via-slate-800 to-black",
    coverIcon: "🤖",
    featured: false,
    publishedAt: new Date("2026-02-18"),
  },
  {
    slug: "building-resilient-infrastructure-chaos-engineering",
    title: "Building Resilient Infrastructure Through Chaos Engineering",
    excerpt:
      "If you haven't tested failure, you haven't tested at all. Learn how chaos engineering practices help enterprises build truly resilient, self-healing systems.",
    category: "Cloud",
    authorName: "Ryan Brooks",
    authorAvatar: "bg-orange-500",
    readTime: "5 min read",
    coverGradient: "from-neutral-900 via-neutral-800 to-black",
    coverIcon: "💥",
    featured: false,
    publishedAt: new Date("2026-02-14"),
  },
];

// ─── Sample Transactions (with orders + stages) ────────

interface SeedTransaction {
  transactionId: string;
  email: string;
  customerName: string;
  phone: string;
  productId: string;
  totalPaid: number;
  bookedAt: string;
  stages: {
    stageKey: string;
    title: string;
    description: string;
    status: string;
    completedAt?: string;
    estimatedDate?: string;
    details: string[];
    deliverables?: string[];
    assignedTo?: string;
  }[];
}

const transactions: SeedTransaction[] = [
  {
    transactionId: "TXN-1710700000-A1B2C3",
    email: "james.carter@example.com",
    customerName: "James Carter",
    phone: "+44 7700 900123",
    productId: "strategy-session",
    totalPaid: 25000, // £250 in pence
    bookedAt: "2026-02-28T10:30:00Z",
    stages: [
      {
        stageKey: "booking",
        title: "Booking Confirmed",
        description: "Payment received and consultation scheduled.",
        status: "completed",
        completedAt: "2026-02-28T10:30:00Z",
        details: [
          "Payment of £150 processed successfully",
          "Confirmation email sent to james.carter@example.com",
          "Calendar invite dispatched for discovery call",
        ],
        deliverables: ["Payment receipt", "Booking confirmation email"],
        assignedTo: "System",
      },
      {
        stageKey: "discovery",
        title: "Discovery & Scoping",
        description:
          "Initial meeting to understand requirements, pain points, and goals.",
        status: "completed",
        completedAt: "2026-03-05T14:00:00Z",
        details: [
          "60-minute video call with lead consultant",
          "Current infrastructure audit completed",
          "Key stakeholders identified and interviewed",
          "Migration risks documented",
        ],
        deliverables: [
          "Discovery report (PDF)",
          "Stakeholder map",
          "Risk register",
        ],
        assignedTo: "Sarah Chen, Lead Consultant",
      },
      {
        stageKey: "strategy",
        title: "Strategy & Planning",
        description:
          "Detailed migration roadmap, timeline, and resource allocation.",
        status: "completed",
        completedAt: "2026-03-10T16:00:00Z",
        details: [
          "Cloud provider comparison (AWS vs Azure vs GCP)",
          "Cost-benefit analysis with 3-year TCO projection",
          "Phased migration plan across 4 workstreams",
          "Rollback strategy defined for each phase",
        ],
        deliverables: [
          "Migration roadmap",
          "TCO analysis spreadsheet",
          "Architecture diagrams",
        ],
        assignedTo: "Sarah Chen, Lead Consultant",
      },
      {
        stageKey: "implementation",
        title: "Implementation",
        description:
          "Active migration work — infrastructure provisioning and data transfer.",
        status: "in-progress",
        details: [
          "Phase 1: Non-critical workloads migration (in progress)",
          "CI/CD pipeline reconfiguration underway",
          "Database replication set up for zero-downtime cutover",
          "Phase 2: Core services migration planned for next week",
        ],
        assignedTo: "Dev Team — Alex Reid & Priya Patel",
      },
      {
        stageKey: "review",
        title: "Review & QA",
        description:
          "Comprehensive testing, performance benchmarks, and security validation.",
        status: "upcoming",
        estimatedDate: "2026-03-24T09:00:00Z",
        details: [
          "Load testing against production-level traffic",
          "Security pen-test on new cloud environment",
          "Performance comparison: before vs after",
          "Compliance checklist sign-off",
        ],
        deliverables: [
          "QA report",
          "Performance benchmark results",
          "Security audit",
        ],
        assignedTo: "QA Team",
      },
      {
        stageKey: "delivery",
        title: "Delivery & Handover",
        description:
          "Final deliverables, documentation, and knowledge transfer sessions.",
        status: "upcoming",
        estimatedDate: "2026-03-30T10:00:00Z",
        details: [
          "Complete documentation package hand-off",
          "Team training session (2 hours)",
          "Runbook for day-to-day operations",
          "Admin credentials and access transfer",
        ],
        deliverables: [
          "Full documentation pack",
          "Training recording",
          "Operations runbook",
        ],
        assignedTo: "Sarah Chen, Lead Consultant",
      },
      {
        stageKey: "support",
        title: "Post-Delivery Support",
        description:
          "30-day follow-up period with priority support access.",
        status: "upcoming",
        estimatedDate: "2026-04-13T09:00:00Z",
        details: [
          "Dedicated Slack channel for questions",
          "Weekly 15-minute check-in calls",
          "Priority bug-fix SLA (4-hour response)",
          "Final retrospective & recommendations report",
        ],
        deliverables: [
          "Retrospective report",
          "Optimisation recommendations",
        ],
        assignedTo: "Sarah Chen, Lead Consultant",
      },
    ],
  },
  {
    transactionId: "TXN-1710500000-D4E5F6",
    email: "olivia.bennett@example.com",
    customerName: "Olivia Bennett",
    phone: "+44 7911 123456",
    productId: "code-audit",
    totalPaid: 50000, // £500 in pence
    bookedAt: "2026-03-01T09:15:00Z",
    stages: [
      {
        stageKey: "booking",
        title: "Booking Confirmed",
        description: "Payment received and audit engagement initiated.",
        status: "completed",
        completedAt: "2026-03-01T09:15:00Z",
        details: [
          "Payment of £200 processed successfully",
          "NDA and scope agreement sent for e-signature",
          "Kickoff call scheduled for 4 March",
        ],
        deliverables: ["Payment receipt", "NDA document"],
        assignedTo: "System",
      },
      {
        stageKey: "discovery",
        title: "Discovery & Scoping",
        description:
          "Assess current security posture and define audit scope.",
        status: "completed",
        completedAt: "2026-03-06T11:00:00Z",
        details: [
          "Asset inventory gathered (servers, endpoints, SaaS)",
          "Network topology mapped",
          "Previous incident history reviewed",
          "Compliance requirements identified (SOC 2, GDPR)",
        ],
        deliverables: ["Asset register", "Scope definition document"],
        assignedTo: "Marcus Webb, Security Lead",
      },
      {
        stageKey: "strategy",
        title: "Strategy & Planning",
        description:
          "Audit methodology, tool selection, and testing schedule.",
        status: "in-progress",
        details: [
          "OWASP Top 10 assessment methodology selected",
          "Automated scanning tools configured (Nessus, Burp Suite)",
          "Manual pen-test scenarios drafted",
          "Testing schedule coordinated with ops team",
        ],
        assignedTo: "Marcus Webb, Security Lead",
      },
      {
        stageKey: "implementation",
        title: "Implementation",
        description:
          "Execute vulnerability scans, penetration tests, and code review.",
        status: "upcoming",
        estimatedDate: "2026-03-18T09:00:00Z",
        details: [
          "Automated vulnerability scanning",
          "Manual penetration testing",
          "Source code security review",
          "Social engineering assessment",
        ],
        assignedTo: "Security Team",
      },
      {
        stageKey: "review",
        title: "Review & QA",
        description:
          "Compile findings, validate severity ratings, and draft report.",
        status: "upcoming",
        estimatedDate: "2026-03-25T09:00:00Z",
        details: [
          "Findings consolidation and deduplication",
          "CVSS severity scoring",
          "Remediation priority ranking",
          "Executive summary drafting",
        ],
        deliverables: ["Draft security report"],
        assignedTo: "Marcus Webb, Security Lead",
      },
      {
        stageKey: "delivery",
        title: "Delivery & Handover",
        description:
          "Present final report with prioritised remediation roadmap.",
        status: "upcoming",
        estimatedDate: "2026-03-31T10:00:00Z",
        details: [
          "Executive presentation to leadership",
          "Detailed technical report hand-off",
          "Remediation roadmap with timelines",
          "Quick-win fixes highlighted",
        ],
        deliverables: [
          "Final security report",
          "Remediation roadmap",
          "Executive summary",
        ],
        assignedTo: "Marcus Webb, Security Lead",
      },
      {
        stageKey: "support",
        title: "Post-Delivery Support",
        description: "14-day follow-up for remediation guidance.",
        status: "upcoming",
        estimatedDate: "2026-04-14T09:00:00Z",
        details: [
          "On-call remediation support",
          "Re-scan after critical fixes applied",
          "Updated compliance posture assessment",
          "Final sign-off and certificate of completion",
        ],
        deliverables: ["Re-scan report", "Compliance certificate"],
        assignedTo: "Marcus Webb, Security Lead",
      },
    ],
  },
  {
    transactionId: "TXN-1710300000-G7H8I9",
    email: "test@tenuq.com",
    customerName: "Demo User",
    phone: "+44 7000 000000",
    productId: "strategy-session",
    totalPaid: 29900, // £299 in pence
    bookedAt: "2026-03-10T15:45:00Z",
    stages: [
      {
        stageKey: "booking",
        title: "Booking Confirmed",
        description: "Payment received and project initiated.",
        status: "completed",
        completedAt: "2026-03-10T15:45:00Z",
        details: [
          "Payment of £120 processed successfully",
          "Welcome pack and data access questionnaire sent",
          "Discovery call booked for 13 March",
        ],
        deliverables: ["Payment receipt", "Welcome email"],
        assignedTo: "System",
      },
      {
        stageKey: "discovery",
        title: "Discovery & Scoping",
        description:
          "Understand current data landscape and analytics goals.",
        status: "in-progress",
        details: [
          "Data source inventory in progress",
          "KPI workshop scheduled with stakeholders",
          "Current reporting stack review",
          "Data quality assessment underway",
        ],
        assignedTo: "Emily Zhang, Analytics Lead",
      },
      {
        stageKey: "strategy",
        title: "Strategy & Planning",
        description:
          "Define data architecture, ETL pipelines, and dashboard specifications.",
        status: "upcoming",
        estimatedDate: "2026-03-20T09:00:00Z",
        details: [
          "Data warehouse architecture design",
          "ETL pipeline specifications",
          "Dashboard wireframes and KPI mapping",
          "Technology stack recommendations",
        ],
        assignedTo: "Emily Zhang, Analytics Lead",
      },
      {
        stageKey: "implementation",
        title: "Implementation",
        description:
          "Build pipelines, configure warehouse, and develop dashboards.",
        status: "upcoming",
        estimatedDate: "2026-03-27T09:00:00Z",
        details: [
          "ETL pipeline development",
          "Data warehouse provisioning",
          "Dashboard build and data connection",
          "Automated refresh scheduling",
        ],
        assignedTo: "Analytics Team",
      },
      {
        stageKey: "review",
        title: "Review & QA",
        description:
          "Validate data accuracy, test dashboards, and gather feedback.",
        status: "upcoming",
        estimatedDate: "2026-04-03T09:00:00Z",
        details: [
          "Data reconciliation checks",
          "Dashboard UAT with stakeholders",
          "Performance optimisation",
          "Edge case and error handling tests",
        ],
        deliverables: ["QA validation report"],
        assignedTo: "QA Team",
      },
      {
        stageKey: "delivery",
        title: "Delivery & Handover",
        description:
          "Hand over dashboards, documentation, and train the team.",
        status: "upcoming",
        estimatedDate: "2026-04-10T10:00:00Z",
        details: [
          "Dashboard deployment to production",
          "User training session (1.5 hours)",
          "Documentation and data dictionary",
          "Access credentials transfer",
        ],
        deliverables: [
          "Live dashboards",
          "Documentation pack",
          "Training recording",
        ],
        assignedTo: "Emily Zhang, Analytics Lead",
      },
      {
        stageKey: "support",
        title: "Post-Delivery Support",
        description:
          "21-day support window for questions and refinements.",
        status: "upcoming",
        estimatedDate: "2026-04-24T09:00:00Z",
        details: [
          "Priority support channel",
          "Up to 3 dashboard refinement requests",
          "Monthly insights review call",
          "Final handover and close-out",
        ],
        deliverables: [
          "Close-out report",
          "Optimisation recommendations",
        ],
        assignedTo: "Emily Zhang, Analytics Lead",
      },
    ],
  },
];

// ─── Contact Submissions ────────────────────────────────

const contactSubmissions = [
  {
    name: "Amir Hassan",
    email: "amir.hassan@outlook.com",
    phone: "+44 7700 900111",
    subject: "Software Consultancy Enquiry",
    message:
      "Hi, we're a Series A fintech startup looking for an architecture review of our payments platform. We'd love to discuss a code audit and ongoing advisory. Available for a call this week.",
    createdAt: new Date("2026-02-10T09:15:00Z"),
  },
  {
    name: "Sophie Clarke",
    email: "sophie.clarke@gmail.com",
    phone: "+44 7911 123456",
    subject: "Brand Identity for New SaaS Product",
    message:
      "We're launching a B2B SaaS tool in Q2 and need a full brand identity — logo, colour palette, typography, and brand guidelines. Could you send over case studies and pricing?",
    createdAt: new Date("2026-02-18T14:30:00Z"),
  },
  {
    name: "James O'Brien",
    email: "james.obrien@techcorp.io",
    phone: null,
    subject: "CTO-as-a-Service Interest",
    message:
      "Our team of 8 engineers needs part-time CTO guidance on architecture decisions and hiring strategy. We currently use a Next.js + AWS stack. What does your engagement model look like?",
    createdAt: new Date("2026-02-25T11:00:00Z"),
  },
  {
    name: "Priya Patel",
    email: "priya@designhive.co.uk",
    phone: "+44 7456 789012",
    subject: "Partnership Opportunity",
    message:
      "I run a UX design agency and we often have clients who need development support. Would love to explore a referral partnership. Let me know a good time to chat.",
    createdAt: new Date("2026-03-02T16:45:00Z"),
  },
  {
    name: "Marcus Johnson",
    email: "m.johnson@greenleaf.org",
    phone: "+44 20 7946 0958",
    subject: "Website Rebuild Consultation",
    message:
      "Our charity website is outdated and we're looking to rebuild it with modern tech. Budget is limited but we'd appreciate a strategy session to understand our options. Thanks!",
    createdAt: new Date("2026-03-08T08:20:00Z"),
  },
  {
    name: "Elena Rossi",
    email: "elena.rossi@modaroma.it",
    phone: "+44 7700 900222",
    subject: "E-commerce Brand Refresh",
    message:
      "We sell luxury homewares online and our current branding feels dated. Interested in the Brand Building package — particularly logo redesign and a refreshed visual identity across web and socials.",
    createdAt: new Date("2026-03-15T12:10:00Z"),
  },
  {
    name: "Daniel Kim",
    email: "daniel.kim@stackventures.com",
    phone: null,
    subject: "Due Diligence Code Audit",
    message:
      "We're a VC firm about to close a deal and need an independent code & architecture audit of the target company's platform. Timeline is tight — can you turn this around in 10 days?",
    createdAt: new Date("2026-03-20T10:00:00Z"),
  },
  {
    name: "Fatima Al-Rashid",
    email: "fatima@quickmed.health",
    phone: "+44 7523 456789",
    subject: "HIPAA-Compliant Architecture Advice",
    message:
      "Building a telehealth app and need expert guidance on HIPAA-compliant infrastructure. Looking for a strategy session first, potentially followed by a longer engagement. When are you available?",
    createdAt: new Date("2026-03-22T17:30:00Z"),
  },
  // ── Contacts that overlap with transaction customers (for linking demo) ──
  {
    name: "James Carter",
    email: "james.carter@example.com",
    phone: "+44 7700 900333",
    subject: "Follow-up — Architecture Audit",
    message:
      "Hi, I recently purchased the Code & Architecture Audit and wanted to check in on the progress. We've also been thinking about adding a second phase for security hardening. Could we schedule a call to discuss expanding the scope?",
    createdAt: new Date("2026-03-05T10:30:00Z"),
  },
  {
    name: "Olivia Bennett",
    email: "olivia.bennett@example.com",
    phone: null,
    subject: "Brand Strategy Follow-up",
    message:
      "Thanks for kicking off the brand identity work — the initial mood boards look great. I wanted to flag that our launch timeline has moved up to mid-April. Can we discuss accelerating the deliverables?",
    createdAt: new Date("2026-03-12T14:00:00Z"),
  },
];

// ─── Main ───────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding database...\n");

  // 1. Products — upsert so re-running is idempotent
  console.log("  Products...");
  for (const p of products) {
    await db.product.upsert({
      where: { id: p.id },
      update: { ...p },
      create: { ...p },
    });
  }
  console.log(`  ✓ ${products.length} products upserted`);

  // 2. Blog posts — upsert on slug
  console.log("  Blog posts...");
  for (const bp of blogPosts) {
    await db.blogPost.upsert({
      where: { slug: bp.slug },
      update: { ...bp },
      create: { ...bp },
    });
  }
  console.log(`  ✓ ${blogPosts.length} blog posts upserted`);

  // 3. Transactions (order + transaction + stages)
  console.log("  Transactions...");
  for (const txn of transactions) {
    const orderId = `ORD-${txn.transactionId.slice(4)}`;

    // Upsert order
    await db.order.upsert({
      where: { id: orderId },
      update: {},
      create: {
        id: orderId,
        productId: txn.productId,
        orderType: "consultation",
        quantity: 1,
        quality: "standard",
        turnaround: "standard",
        totalPrice: txn.totalPaid,
        currency: "GBP",
        deliveryDays: 14,
        customerName: txn.customerName,
        customerEmail: txn.email,
        customerPhone: txn.phone,
        status: "paid",
      },
    });

    // Upsert transaction
    await db.transaction.upsert({
      where: { id: txn.transactionId },
      update: {},
      create: {
        id: txn.transactionId,
        orderId,
        bookedAt: new Date(txn.bookedAt),
      },
    });

    // Delete existing stages then recreate (idempotent)
    await db.consultancyStage.deleteMany({
      where: { transactionId: txn.transactionId },
    });

    await db.consultancyStage.createMany({
      data: txn.stages.map((s, i) => ({
        transactionId: txn.transactionId,
        stageKey: s.stageKey,
        title: s.title,
        description: s.description,
        status: s.status,
        completedAt: s.completedAt ? new Date(s.completedAt) : null,
        estimatedDate: s.estimatedDate ? new Date(s.estimatedDate) : null,
        details: s.details,
        deliverables: s.deliverables ?? [],
        assignedTo: s.assignedTo ?? null,
        sortOrder: i,
      })),
    });
  }
  console.log(`  ✓ ${transactions.length} transactions seeded`);

  // 4. Contact submissions — idempotent by email+subject
  console.log("  Contact submissions...");
  for (const cs of contactSubmissions) {
    const existing = await db.contactSubmission.findFirst({
      where: { email: cs.email, subject: cs.subject },
    });
    if (!existing) {
      await db.contactSubmission.create({ data: cs });
    }
  }
  console.log(`  ✓ ${contactSubmissions.length} contact submissions seeded`);

  // 5. Charity projects — idempotent by charityName+contactEmail
  console.log("  Charity projects...");
  const charityProjects = [
    {
      charityName: "Hope for Homeless UK",
      charityNumber: "1198765",
      contactName: "Sarah Mitchell",
      contactEmail: "sarah@hopeforhomeless.org.uk",
      contactPhone: "+44 7911 123456",
      website: "https://hopeforhomeless.org.uk",
      description: "We provide emergency shelters, food banks, and reintegration programmes for homeless individuals across the UK. Need a modern brand refresh to increase donations.",
      status: "in-progress",
      needsLogo: true,
      needsColours: true,
      needsWebsite: true,
      needsDonations: true,
      needsPayments: false,
      tasks: [
        { taskKey: "logo", title: "Design New Logo", description: "Create a warm, approachable logo reflecting hope and shelter.", status: "completed", completedAt: "2026-02-15T10:00:00Z", estimatedDate: "2026-02-10T00:00:00Z", deliverables: ["Logo SVG", "Logo PNG", "Brand mark"], assignedTo: "Alex Thompson" },
        { taskKey: "colours", title: "Colour Scheme & Identity", description: "Develop a colour palette and visual identity guidelines.", status: "completed", completedAt: "2026-02-20T14:00:00Z", estimatedDate: "2026-02-18T00:00:00Z", deliverables: ["Style guide PDF", "Colour tokens"], assignedTo: "Alex Thompson" },
        { taskKey: "website", title: "Build Charity Website", description: "Responsive, accessible website with about, impact stories, and volunteer signup.", status: "in-progress", estimatedDate: "2026-04-01T00:00:00Z", deliverables: ["Next.js site", "CMS integration"], assignedTo: "Jordan Lee" },
        { taskKey: "donations", title: "Donations Portal", description: "Set up Stripe donation flows with one-time and recurring options.", status: "upcoming", estimatedDate: "2026-04-15T00:00:00Z", deliverables: ["Stripe integration", "Donation page"], assignedTo: null },
      ],
    },
    {
      charityName: "Green Futures Foundation",
      charityNumber: "1204321",
      contactName: "David Chen",
      contactEmail: "david@greenfutures.org",
      contactPhone: "+44 7700 654321",
      website: null,
      description: "Environmental charity focused on tree planting and sustainability education in schools. Starting from scratch with no existing branding.",
      status: "accepted",
      needsLogo: true,
      needsColours: true,
      needsWebsite: true,
      needsDonations: true,
      needsPayments: true,
      tasks: [
        { taskKey: "logo", title: "Brand Identity Design", description: "Nature-inspired logo with leaf/tree motif.", status: "upcoming", estimatedDate: "2026-04-10T00:00:00Z", deliverables: ["Logo pack"], assignedTo: "Alex Thompson" },
      ],
    },
    {
      charityName: "Little Paws Rescue",
      charityNumber: "1187654",
      contactName: "Emma Woodward",
      contactEmail: "emma@littlepawsrescue.co.uk",
      contactPhone: null,
      website: "https://littlepawsrescue.co.uk",
      description: "Animal rescue centre rehoming cats and dogs. Need a fresh website with adoption listings and an online donations feature.",
      status: "completed",
      needsLogo: true,
      needsColours: true,
      needsWebsite: true,
      needsDonations: true,
      needsPayments: false,
      tasks: [
        { taskKey: "logo", title: "Logo Refresh", description: "Modernise the existing paw-print logo.", status: "completed", completedAt: "2026-01-10T12:00:00Z", estimatedDate: "2026-01-08T00:00:00Z", deliverables: ["Logo SVG"], assignedTo: "Alex Thompson" },
        { taskKey: "colours", title: "Colour Palette", description: "Warm, friendly palette with orange and teal.", status: "completed", completedAt: "2026-01-15T12:00:00Z", estimatedDate: "2026-01-14T00:00:00Z", deliverables: ["Brand guide"], assignedTo: "Alex Thompson" },
        { taskKey: "website", title: "Website Build", description: "Full site with adoption gallery and contact forms.", status: "completed", completedAt: "2026-02-28T18:00:00Z", estimatedDate: "2026-02-25T00:00:00Z", deliverables: ["Next.js site", "Admin panel"], assignedTo: "Jordan Lee" },
        { taskKey: "donations", title: "Donation System", description: "Stripe one-time and monthly donations.", status: "completed", completedAt: "2026-03-05T10:00:00Z", estimatedDate: "2026-03-01T00:00:00Z", deliverables: ["Payment integration"], assignedTo: "Jordan Lee" },
      ],
    },
    {
      charityName: "Youth Code Academy",
      contactName: "Marcus Johnson",
      contactEmail: "marcus@youthcodeacademy.org",
      description: "Teaching coding skills to under-privileged young people aged 12–18. Applied but not yet accepted.",
      status: "applied",
      needsLogo: true,
      needsColours: true,
      needsWebsite: true,
      needsDonations: false,
      needsPayments: false,
      tasks: [],
    },
  ];

  for (const cp of charityProjects) {
    const existing = await db.charityProject.findFirst({
      where: { charityName: cp.charityName, contactEmail: cp.contactEmail },
    });
    if (!existing) {
      const project = await db.charityProject.create({
        data: {
          charityName: cp.charityName,
          charityNumber: cp.charityNumber ?? null,
          contactName: cp.contactName,
          contactEmail: cp.contactEmail,
          contactPhone: cp.contactPhone ?? null,
          website: cp.website ?? null,
          description: cp.description,
          status: cp.status,
          needsLogo: cp.needsLogo,
          needsColours: cp.needsColours,
          needsWebsite: cp.needsWebsite,
          needsDonations: cp.needsDonations,
          needsPayments: cp.needsPayments,
        },
      });
      if (cp.tasks.length > 0) {
        await db.charityTask.createMany({
          data: cp.tasks.map((t, i) => ({
            projectId: project.id,
            taskKey: t.taskKey,
            title: t.title,
            description: t.description,
            status: t.status,
            completedAt: t.completedAt ? new Date(t.completedAt) : null,
            estimatedDate: t.estimatedDate ? new Date(t.estimatedDate) : null,
            deliverables: t.deliverables,
            assignedTo: t.assignedTo ?? null,
            sortOrder: i,
          })),
        });
      }
    }
  }
  console.log(`  ✓ ${charityProjects.length} charity projects seeded`);

  console.log("\n✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
