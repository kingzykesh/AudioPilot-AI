import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#06131f] text-white">
      <nav className="flex items-center justify-between px-10 py-6">
        <div>
          <h1 className="text-2xl font-bold text-[#38bdf8]">AudioPilot AI</h1>
          <p className="text-xs text-[#8aa3b8]">Intelligent Audio Mixing Assistant</p>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-[#cfe7f8]">
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-[#38bdf8] px-5 py-3 text-sm font-semibold text-[#06131f]"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl grid-cols-2 gap-12 px-10 py-20">
        <div>
          <span className="rounded-full border border-[#22384d] bg-[#0d1f31] px-4 py-2 text-sm text-[#38bdf8]">
            Final Year Computer Science Project
          </span>

          <h2 className="mt-8 text-6xl font-bold leading-tight">
            Real-Time Intelligent Audio Mixing Assistant
          </h2>

          <p className="mt-6 max-w-xl text-lg leading-8 text-[#8aa3b8]">
            AudioPilot AI helps sound engineers monitor live audio, detect clipping,
            identify noise problems, analyze frequency balance, and receive smart
            recommendations during live sound operations.
          </p>

          <div className="mt-10 flex gap-4">
            <Link
              href="/dashboard"
              className="rounded-xl bg-[#38bdf8] px-7 py-4 font-semibold text-[#06131f]"
            >
              Launch Dashboard
            </Link>

            <Link
              href="/dashboard/live-monitor"
              className="rounded-xl border border-[#22384d] px-7 py-4 font-semibold text-[#cfe7f8]"
            >
              View Live Monitor
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-[#22384d] bg-[#0d1f31] p-6 shadow-2xl">
          <div className="rounded-2xl bg-[#06131f] p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Live Signal Overview</h3>
              <span className="rounded-lg bg-[#11283d] px-3 py-1 text-sm text-[#38bdf8]">
                DSP Active
              </span>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                ["RMS", "-18 dB"],
                ["Peak", "-3.2 dBFS"],
                ["Noise", "-72 dB"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-[#11283d] p-4">
                  <p className="text-sm text-[#8aa3b8]">{label}</p>
                  <h4 className="mt-3 text-2xl font-bold text-[#38bdf8]">{value}</h4>
                </div>
              ))}
            </div>

            <div className="mt-8 flex h-72 items-end gap-3 rounded-2xl border border-[#22384d] bg-[#081827] p-5">
              {[35, 60, 45, 80, 52, 70, 40, 90, 55, 68, 38, 72].map((height, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t-lg bg-[#38bdf8]"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-yellow-700 bg-yellow-950/20 p-4">
              <p className="text-sm font-semibold text-yellow-300">
                Recommendation
              </p>
              <p className="mt-2 text-sm text-[#cfe7f8]">
                Mid frequency range is slightly dominant. Consider mild EQ reduction.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}