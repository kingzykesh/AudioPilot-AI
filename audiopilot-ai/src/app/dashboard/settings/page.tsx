export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">System Settings</h1>
      <p className="mt-2 text-[#8aa3b8]">
        Configure monitoring preferences, audio thresholds, and assistant behaviour.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-6">
        <section className="rounded-2xl border border-[#22384d] bg-[#0d1f31] p-6">
          <h2 className="text-lg font-semibold">Profile Settings</h2>

          <div className="mt-6 space-y-5">
            <div>
              <label className="text-sm text-[#8aa3b8]">Full Name</label>
              <input
                className="mt-2 w-full rounded-xl border border-[#22384d] bg-[#06131f] px-4 py-3 text-[#cfe7f8] outline-none"
                defaultValue="Sound Engineer"
              />
            </div>

            <div>
              <label className="text-sm text-[#8aa3b8]">Role</label>
              <select className="mt-2 w-full rounded-xl border border-[#22384d] bg-[#06131f] px-4 py-3 text-[#cfe7f8] outline-none">
                <option>Sound Engineer</option>
                <option>Audio Technician</option>
                <option>Volunteer Operator</option>
                <option>Research Evaluator</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-[#8aa3b8]">Organization / Venue</label>
              <input
                className="mt-2 w-full rounded-xl border border-[#22384d] bg-[#06131f] px-4 py-3 text-[#cfe7f8] outline-none"
                placeholder="e.g. Church, School, Event Centre"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[#22384d] bg-[#0d1f31] p-6">
          <h2 className="text-lg font-semibold">Audio Configuration</h2>

          <div className="mt-6 space-y-5">
            <div>
              <label className="text-sm text-[#8aa3b8]">Sample Rate</label>
              <select className="mt-2 w-full rounded-xl border border-[#22384d] bg-[#06131f] px-4 py-3 text-[#cfe7f8] outline-none">
                <option>48 kHz</option>
                <option>44.1 kHz</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-[#8aa3b8]">Buffer Size</label>
              <select className="mt-2 w-full rounded-xl border border-[#22384d] bg-[#06131f] px-4 py-3 text-[#cfe7f8] outline-none">
                <option>256 samples - Low Latency</option>
                <option>512 samples - Balanced</option>
                <option>1024 samples - Stable</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-[#8aa3b8]">Monitoring Mode</label>
              <select className="mt-2 w-full rounded-xl border border-[#22384d] bg-[#06131f] px-4 py-3 text-[#cfe7f8] outline-none">
                <option>Live Audio</option>
                <option>Playback Audio</option>
                <option>Live + Playback Simulation</option>
              </select>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-[#22384d] bg-[#0d1f31] p-6">
        <h2 className="text-lg font-semibold">Analysis Thresholds</h2>
        <p className="mt-1 text-sm text-[#8aa3b8]">
          These thresholds guide the rule-based recommendation engine.
        </p>

        <div className="mt-6 grid grid-cols-4 gap-5">
          {[
            ["Clipping Threshold", "-1 dBFS"],
            ["Low Signal Warning", "-40 dB"],
            ["Noise Floor Warning", "-50 dB"],
            ["Peak Safe Range", "-6 dBFS"],
          ].map(([label, value]) => (
            <div key={label}>
              <label className="text-sm text-[#8aa3b8]">{label}</label>
              <input
                className="mt-2 w-full rounded-xl border border-[#22384d] bg-[#06131f] px-4 py-3 text-[#cfe7f8] outline-none"
                defaultValue={value}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-[#22384d] bg-[#0d1f31] p-6">
        <h2 className="text-lg font-semibold">Assistant Behaviour</h2>

        <div className="mt-6 grid grid-cols-3 gap-5">
          {[
            ["Enable Real-Time Alerts", "Show warnings while monitoring"],
            ["Store Session Logs", "Save metrics and recommendations"],
            ["Enable Recording Option", "Allow optional session recording"],
          ].map(([title, desc]) => (
            <label
              key={title}
              className="flex cursor-pointer items-start gap-4 rounded-xl bg-[#11283d] p-4"
            >
              <input type="checkbox" defaultChecked className="mt-1" />
              <span>
                <span className="block font-semibold text-[#cfe7f8]">{title}</span>
                <span className="mt-1 block text-sm text-[#8aa3b8]">{desc}</span>
              </span>
            </label>
          ))}
        </div>
      </section>

      <button className="mt-8 rounded-xl bg-[#38bdf8] px-6 py-3 font-semibold text-[#06131f]">
        Save Settings
      </button>
    </div>
  );
}