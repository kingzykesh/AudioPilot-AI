export default function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-[#22384d] bg-[#081827] px-8">
      <div>
        <p className="text-sm text-[#8aa3b8]">Live Session</p>
        <h2 className="font-semibold text-white">FOH Console</h2>
      </div>

      <div className="flex items-center gap-4 text-sm text-[#8aa3b8]">
        <span>Connected</span>
        <span>48kHz / 24-bit</span>
        <span className="rounded-lg bg-[#11283d] px-3 py-2 text-[#38bdf8]">
          DSP Ready
        </span>
      </div>
    </header>
  );
}