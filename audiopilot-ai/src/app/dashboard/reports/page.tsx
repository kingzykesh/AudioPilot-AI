"use client";

import { useEffect, useState } from "react";
import {
  AudioLogEntry,
  clearAudioLogs,
  getAudioLogs,
} from "@/lib/sessionLogger";

export default function ReportsPage() {
  const [logs, setLogs] = useState<AudioLogEntry[]>([]);

  useEffect(() => {
    setLogs(getAudioLogs());
  }, []);

  const handleClear = () => {
    clearAudioLogs();
    setLogs([]);
  };

  const clippingCount = logs.filter(
    (log) => log.clipping === "Detected" || log.clipping === "Risk"
  ).length;

  const warningCount = logs.filter(
    (log) =>
      log.quality !== "Good" &&
      log.quality !== "Idle" &&
      log.quality !== "Ready"
  ).length;

  const highNoiseCount = logs.filter(
    (log) => log.noiseSeverity === "High"
  ).length;

  const averageScore =
    logs.length > 0
      ? Math.round(
          logs.reduce((acc, log) => acc + (log.qualityScore || 0), 0) /
            logs.length
        )
      : 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-5">
        <div>
          <h1 className="text-3xl font-bold">Session Reports</h1>
          <p className="mt-2 text-[#8aa3b8]">
            Review saved monitoring logs, noise floor readings, quality scores,
            and assistant recommendations.
          </p>
        </div>

        <button
          onClick={handleClear}
          className="rounded-xl bg-red-500 px-5 py-3 font-semibold text-white"
        >
          Clear Logs
        </button>
      </div>

      <div className="mt-8 grid grid-cols-5 gap-5">
        <div className="rounded-2xl border border-[#22384d] bg-[#0d1f31] p-5">
          <p className="text-sm text-[#8aa3b8]">Total Logs</p>
          <h2 className="mt-3 text-3xl font-bold text-[#38bdf8]">
            {logs.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#22384d] bg-[#0d1f31] p-5">
          <p className="text-sm text-[#8aa3b8]">Avg Quality</p>
          <h2 className="mt-3 text-3xl font-bold text-green-400">
            {averageScore}/100
          </h2>
        </div>

        <div className="rounded-2xl border border-[#22384d] bg-[#0d1f31] p-5">
          <p className="text-sm text-[#8aa3b8]">Clipping Alerts</p>
          <h2 className="mt-3 text-3xl font-bold text-red-400">
            {clippingCount}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#22384d] bg-[#0d1f31] p-5">
          <p className="text-sm text-[#8aa3b8]">Warnings</p>
          <h2 className="mt-3 text-3xl font-bold text-yellow-300">
            {warningCount}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#22384d] bg-[#0d1f31] p-5">
          <p className="text-sm text-[#8aa3b8]">High Noise</p>
          <h2 className="mt-3 text-3xl font-bold text-orange-300">
            {highNoiseCount}
          </h2>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-[#22384d] bg-[#0d1f31]">
        <table className="w-full min-w-[1350px]">
          <thead className="bg-[#11283d]">
            <tr>
              <th className="p-4 text-left text-sm font-semibold">Time</th>
              <th className="p-4 text-left text-sm font-semibold">Quality</th>
              <th className="p-4 text-left text-sm font-semibold">Score</th>
              <th className="p-4 text-left text-sm font-semibold">RMS</th>
              <th className="p-4 text-left text-sm font-semibold">Peak</th>
              <th className="p-4 text-left text-sm font-semibold">Clipping</th>
              <th className="p-4 text-left text-sm font-semibold">
                Noise Floor
              </th>
              <th className="p-4 text-left text-sm font-semibold">
                Noise Severity
              </th>
              <th className="p-4 text-left text-sm font-semibold">Low</th>
              <th className="p-4 text-left text-sm font-semibold">Mid</th>
              <th className="p-4 text-left text-sm font-semibold">High</th>
              <th className="p-4 text-left text-sm font-semibold">
                Recommendation
              </th>
            </tr>
          </thead>

          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={12} className="p-10 text-center text-[#8aa3b8]">
                  No session logs available. Start monitoring audio to generate
                  reports.
                </td>
              </tr>
            ) : (
              logs.map((log, index) => (
                <tr key={index} className="border-t border-[#22384d]">
                  <td className="whitespace-nowrap p-4 text-sm">{log.time}</td>
                  <td className="p-4 text-sm text-[#38bdf8]">{log.quality}</td>
                  <td className="p-4 text-sm text-green-400">
                    {log.qualityScore}/100
                  </td>
                  <td className="p-4 text-sm">{log.rms}</td>
                  <td className="p-4 text-sm">{log.peak}</td>
                  <td className="p-4 text-sm">{log.clipping}</td>
                  <td className="p-4 text-sm">{log.noiseFloor}</td>
                  <td className="p-4 text-sm text-yellow-300">
                    {log.noiseSeverity}
                  </td>
                  <td className="p-4 text-sm">{log.lowEnergy}</td>
                  <td className="p-4 text-sm">{log.midEnergy}</td>
                  <td className="p-4 text-sm">{log.highEnergy}</td>
                  <td className="max-w-md p-4 text-sm text-[#cfe7f8]">
                    {log.recommendation}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}