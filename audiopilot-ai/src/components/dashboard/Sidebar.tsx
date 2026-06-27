import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/live-monitor", label: "Live Monitor" },
  { href: "/dashboard/sources", label: "Sources" },
  { href: "/dashboard/reports", label: "Reports" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen border-r border-[#22384d] bg-[#0d1f31] p-5">
      <h1 className="text-2xl font-bold text-[#38bdf8]">AudioPilot AI</h1>
      <p className="mt-1 text-xs text-[#8aa3b8]">Intelligent Mixing Assistant</p>

      <nav className="mt-10 space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-xl px-4 py-3 text-sm text-[#cfe7f8] hover:bg-[#11283d] hover:text-[#38bdf8]"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <button className="mt-20 w-full rounded-xl bg-red-700 px-4 py-3 text-sm font-semibold text-white">
        Emergency Mute
      </button>
    </aside>
  );
}