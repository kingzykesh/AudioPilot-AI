export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">AudioPilot AI Dashboard</h1>
      <p className="mt-2 text-[#8aa3b8]">
        Real-time intelligent audio monitoring and live sound balancing assistant.
      </p>

      <div className="mt-8 grid grid-cols-4 gap-5">
        {[
          ["Session Status", "Inactive"],
          ["Signal Health", "92%"],
          ["Noise Floor", "-72 dB"],
          ["Peak Level", "-3.2 dBFS"],
        ].map(([title, value]) => (
          <div key={title} className="rounded-2xl border border-[#22384d] bg-[#0d1f31] p-5">
            <p className="text-sm text-[#8aa3b8]">{title}</p>
            <h2 className="mt-4 text-3xl font-bold text-[#38bdf8]">{value}</h2>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-3 gap-5">
        <div className="col-span-2 rounded-2xl border border-[#22384d] bg-[#0d1f31] p-6">
          <h2 className="font-semibold">Master Spectrum</h2>
          <div className="mt-5 h-72 rounded-xl border border-[#22384d] bg-[#06131f]" />
        </div>

        <div className="rounded-2xl border border-[#22384d] bg-[#0d1f31] p-6">
          <h2 className="font-semibold">AI Recommendations</h2>

          <div className="mt-5 space-y-4">
            <div className="rounded-xl border border-[#22384d] bg-[#11283d] p-4">
              <p className="text-sm font-semibold text-[#38bdf8]">Master Output</p>
              <p className="mt-2 text-sm text-[#cfe7f8]">
                Level healthy. Dynamic range is within acceptable balance.
              </p>
            </div>

            <div className="rounded-xl border border-red-900 bg-red-950/30 p-4">
              <p className="text-sm font-semibold text-red-300">Noise Warning</p>
              <p className="mt-2 text-sm text-[#cfe7f8]">
                Noise floor rising. Consider reducing input gain or enabling gate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}