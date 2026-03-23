import TopBar from "@/components/TopBar";
import DashboardContent from "@/components/DashboardContent";
import { getDashboardStats } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <>
      <TopBar title="Dashboard" />
      <DashboardContent stats={stats} />
    </>
  );
}
