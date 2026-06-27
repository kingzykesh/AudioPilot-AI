import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen bg-[#06131f]">
      <Sidebar />

      <section className="flex flex-1 flex-col">
        <Topbar />
        <div className="flex-1 p-8">{children}</div>
      </section>
    </main>
  );
}