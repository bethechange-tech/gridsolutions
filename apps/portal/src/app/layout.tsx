import type { Metadata } from "next";
import "./globals.css";
import Sidebar, { SidebarProvider } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "TENUQ PORTAL",
  description: "TENUQ PORTAL — manage contacts, leads, tasks, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#f0f5f0] min-h-screen">
        <SidebarProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 lg:ml-[260px]">{children}</div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
