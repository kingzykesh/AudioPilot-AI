export default function SourcesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Audio Sources</h1>
      <p className="mt-2 text-[#8aa3b8]">
        Select live input devices, output monitor devices, and playback audio files.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-6">
        <section className="rounded-2xl border border-[#22384d] bg-[#0d1f31] p-6">
          <h2 className="text-lg font-semibold">Live Input Device</h2>
          <p className="mt-1 text-sm text-[#8aa3b8]">
            Microphone, USB audio interface, mixer output, or sound card.
          </p>

          <select className="mt-6 w-full rounded-xl border border-[#22384d] bg-[#06131f] px-4 py-3 text-[#cfe7f8] outline-none">
            <option>Default Microphone</option>
            <option>USB Audio Interface</option>
            <option>Mixer Output</option>
            <option>External Sound Card</option>
          </select>

          <div className="mt-6 rounded-xl bg-[#11283d] p-4">
            <p className="text-sm text-[#8aa3b8]">Device Status</p>
            <h3 className="mt-2 font-semibold text-[#38bdf8]">Ready for monitoring</h3>
          </div>
        </section>

        <section className="rounded-2xl border border-[#22384d] bg-[#0d1f31] p-6">
          <h2 className="text-lg font-semibold">Output Device</h2>
          <p className="mt-1 text-sm text-[#8aa3b8]">
            Select where monitored audio or test playback should be routed.
          </p>

          <select className="mt-6 w-full rounded-xl border border-[#22384d] bg-[#06131f] px-4 py-3 text-[#cfe7f8] outline-none">
            <option>Default Speakers</option>
            <option>Headphones</option>
            <option>USB Audio Interface Output</option>
            <option>External Monitor</option>
          </select>

          <div className="mt-6 rounded-xl bg-[#11283d] p-4">
            <p className="text-sm text-[#8aa3b8]">Output Status</p>
            <h3 className="mt-2 font-semibold text-[#38bdf8]">Available</h3>
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-[#22384d] bg-[#0d1f31] p-6">
        <h2 className="text-lg font-semibold">Playback Audio Analyzer</h2>
        <p className="mt-1 text-sm text-[#8aa3b8]">
          Upload a local audio file for simulated live analysis and testing.
        </p>

        <div className="mt-6 flex h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-[#22384d] bg-[#06131f]">
          <p className="text-lg font-semibold">Drop audio file here</p>
          <p className="mt-2 text-sm text-[#8aa3b8]">Supported: MP3, WAV, M4A</p>

          <button className="mt-5 rounded-xl bg-[#38bdf8] px-5 py-3 font-semibold text-[#06131f]">
            Choose Audio File
          </button>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-[#22384d] bg-[#0d1f31] p-6">
        <h2 className="text-lg font-semibold">Source Routing Summary</h2>

        <div className="mt-5 grid grid-cols-4 gap-4">
          {[
            ["Input", "Default Microphone"],
            ["Output", "Default Speakers"],
            ["Sample Rate", "48 kHz"],
            ["Mode", "Live Monitoring"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-[#11283d] p-4">
              <p className="text-sm text-[#8aa3b8]">{label}</p>
              <h3 className="mt-2 font-semibold text-[#cfe7f8]">{value}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}