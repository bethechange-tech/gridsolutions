import TopBar from "@/components/TopBar";
import { getCharityProjects, getCharityStats } from "@/lib/data";
import CharityBoard from "./CharityBoard";

export const dynamic = "force-dynamic";

export default async function CharitiesPage() {
  const [projects, stats] = await Promise.all([
    getCharityProjects(),
    getCharityStats(),
  ]);

  const mapped = projects.map((p: any) => ({
    id: p.id as string,
    charityName: p.charityName as string,
    charityNumber: (p.charityNumber ?? null) as string | null,
    contactName: p.contactName as string,
    contactEmail: p.contactEmail as string,
    contactPhone: (p.contactPhone ?? null) as string | null,
    website: (p.website ?? null) as string | null,
    description: p.description as string,
    status: p.status as string,
    needsLogo: p.needsLogo as boolean,
    needsColours: p.needsColours as boolean,
    needsWebsite: p.needsWebsite as boolean,
    needsDonations: p.needsDonations as boolean,
    needsPayments: p.needsPayments as boolean,
    notes: (p.notes ?? null) as string | null,
    createdAt: p.createdAt.toISOString() as string,
    tasks: (p.tasks ?? []).map((t: any) => ({
      id: t.id as string,
      taskKey: t.taskKey as string,
      title: t.title as string,
      description: t.description as string,
      status: t.status as string,
      completedAt: t.completedAt?.toISOString() ?? null,
      estimatedDate: t.estimatedDate?.toISOString() ?? null,
      deliverables: (t.deliverables ?? []) as string[],
      assignedTo: (t.assignedTo ?? null) as string | null,
      sortOrder: t.sortOrder as number,
    })),
  }));

  return (
    <>
      <TopBar title="Charities" />
      <div className="p-4 sm:p-6">
        <CharityBoard projects={mapped} stats={stats} />
      </div>
    </>
  );
}
