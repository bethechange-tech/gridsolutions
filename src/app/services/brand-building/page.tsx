"use client";

import { useEffect, useState } from "react";
import { fetchServiceBySlug } from "@/services/api";
import ServicePage from "@/components/services/ServicePage";
import type { Service } from "@/data/services";

export default function BrandBuildingPage() {
  const [service, setService] = useState<Service | null>(null);

  useEffect(() => {
    async function load() {
      const data = await fetchServiceBySlug("brand-building");
      setService(data);
    }
    load();
  }, []);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1a8d1a]" />
      </div>
    );
  }

  return <ServicePage service={service} />;
}
