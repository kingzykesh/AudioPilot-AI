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

  const feedbackWarningCount = logs.filter(
    (log) => log.feedbackRisk === "Medium"
  ).length;

  const highFeedbackCount = logs.filter(
    (log) => log.feedbackRisk === "High"
  ).length;

  const criticalAudioHealthCount = logs.filter(
    (log) =>
      log.audioHealthStatus === "Critical" ||
      log.audioHealthStatus === "Poor"
  ).length;

  const averageScore =
    logs.length > 0
      ? Math.round(
          logs.reduce((acc, log) => acc + (log.qualityScore || 0), 0) /
            logs.length
        )
      : 0;

  const averageAudioHealth =
    logs.length > 0
      ? Math.round(
          logs.reduce((acc, log) => acc + (log.audioHealthScore || 0), 0) /
            logs.length
        )
      : 0;

  const averageSpeechClarity =
    logs.length > 0
      ? Math.round(
          logs.reduce(
            (acc, log) => acc + (log.speechClarityScore || 0),
            0
          ) / logs.length
        )
      : 0;

  const latestEqPreset =
    logs.length > 0 ? logs[0].autoEqPreset || "Balanced Live Mix" : "None";

  const latestFeedbackRisk =
    logs.length > 0 ? logs[0].feedbackRisk || "Low" : "None";

  const latestFeedbackBand =
    logs.length > 0 ? logs[0].feedbackBand || "None" : "None";

  const latestAudioHealthScore =
    logs.length > 0 ? logs[0].audioHealthScore || 0 : 0;

  const latestAudioHealthStatus =
    logs.length > 0 ? logs[0].audioHealthStatus || "None" : "None";

  const getHealthColor = (status: string) => {
    if (status === "Critical" || status === "Poor") return "text-red-400";
    if (status === "Fair") return "text-yellow-300";
    if (status === "Good" || status === "Excellent") return "text-green-400";
    return "text-[#38bdf8]";
  };

  const getFeedbackColor = (risk: string) => {
    if (risk === "High") return "text-red-400";
    if (risk === "Medium") return "text-yellow-300";
    return "text-green-400";
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-5">
        <div>
          <h1 className="text-3xl font-bold">Session Reports</h1>
          <p className="mt-2 text-[#8aa3b8]">
            Review saved monitoring logs, audio health score, noise readings,
            speech clarity, feedback risk, Auto-EQ suggestions, and assistant
            recommendations.
          </p>
        </div>

        <button
          onClick={handleClear}
          className="rounded-xl bg-red-500 px-5 py-3 font-semibold text-white"
        >
          Clear Logs
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <MetricCard title="Total Logs" value={`${logs.length}`} />

        <MetricCard
          title="Avg Health"
          value={`${averageAudioHealth}/100`}
          valueClass={
            averageAudioHealth < 60
              ? "text-red-400"
              : averageAudioHealth < 75
              ? "text-yellow-300"
              : "text-green-400"
          }
        />

        <MetricCard
          title="Avg Quality"
          value={`${averageScore}/100`}
          valueClass="text-green-400"
        />

        <MetricCard
          title="Speech Clarity"
          value={`${averageSpeechClarity}/100`}
          valueClass="text-green-400"
        />

        <MetricCard
          title="Clipping Alerts"
          value={`${clippingCount}`}
          valueClass="text-red-400"
        />

        <MetricCard
          title="Warnings"
          value={`${warningCount}`}
          valueClass="text-yellow-300"
        />

        <MetricCard
          title="High Noise"
          value={`${highNoiseCount}`}
          valueClass="text-orange-300"
        />

        <MetricCard
          title="Feedback Warnings"
          value={`${feedbackWarningCount}`}
          valueClass="text-yellow-300"
        />

        <MetricCard
          title="High Feedback Risk"
          value={`${highFeedbackCount}`}
          valueClass="text-red-400"
        />

        <MetricCard
          title="Poor Health Logs"
          value={`${criticalAudioHealthCount}`}
          valueClass="text-red-400"
        />
      </div>

      <section className="mt-8 rounded-2xl border border-[#22384d] bg-[#0d1f31] p-6">
        <h2 className="text-lg font-semibold">Latest Audio Health Summary</h2>

        <div className="mt-5 rounded-xl border border-[#22384d] bg-[#11283d] p-5">
          <p className={`font-semibold ${getHealthColor(latestAudioHealthStatus)}`}>
            Score: {latestAudioHealthScore}/100
          </p>

          <p className={`mt-3 font-semibold ${getHealthColor(latestAudioHealthStatus)}`}>
            Status: {latestAudioHealthStatus}
          </p>

          <p className="mt-3 text-[#cfe7f8]">
            {logs.length > 0
              ? logs[0].audioHealthSummary ||
                "No audio health summary available."
              : "No session logs available yet."}
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-[#22384d] bg-[#0d1f31] p-6">
        <h2 className="text-lg font-semibold">Latest Auto-EQ Summary</h2>

        <div className="mt-5 rounded-xl border border-[#22384d] bg-[#11283d] p-5">
          <p className="font-semibold text-purple-400">
            Latest Preset: {latestEqPreset}
          </p>

          <p className="mt-3 text-[#cfe7f8]">
            {logs.length > 0
              ? logs[0].autoEqSummary || "No EQ summary available."
              : "No session logs available yet."}
          </p>

          <ul className="mt-4 space-y-2">
            {logs.length > 0 &&
            logs[0].autoEqActions &&
            logs[0].autoEqActions.length > 0 ? (
              logs[0].autoEqActions.map((action, index) => (
                <li key={index} className="text-sm text-[#cfe7f8]">
                  • {action}
                </li>
              ))
            ) : (
              <li className="text-sm text-[#8aa3b8]">
                Start monitoring to generate Auto-EQ recommendations.
              </li>
            )}
          </ul>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-[#22384d] bg-[#0d1f31] p-6">
        <h2 className="text-lg font-semibold">Latest Feedback Analysis</h2>

        <div className="mt-5 rounded-xl border border-[#22384d] bg-[#11283d] p-5">
          <p className={`font-semibold ${getFeedbackColor(latestFeedbackRisk)}`}>
            Risk Level: {latestFeedbackRisk}
          </p>

          <p className="mt-3 text-[#cfe7f8]">
            Likely Feedback Band: {latestFeedbackBand}
          </p>

          <p className="mt-3 text-[#cfe7f8]">
            {logs.length > 0
              ? logs[0].feedbackRecommendation ||
                "No feedback recommendation available."
              : "No feedback analysis available yet."}
          </p>
        </div>
      </section>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-[#22384d] bg-[#0d1f31]">
        <table className="w-full min-w-[2350px]">
          <thead className="bg-[#11283d]">
            <tr>
              <TableHead>Time</TableHead>
              <TableHead>Health</TableHead>
              <TableHead>Health Status</TableHead>
              <TableHead>Quality</TableHead>
              <TableHead>Quality Score</TableHead>
              <TableHead>Speech Score</TableHead>
              <TableHead>Speech Level</TableHead>
              <TableHead>Feedback Risk</TableHead>
              <TableHead>Feedback Band</TableHead>
              <TableHead>Feedback Recommendation</TableHead>
              <TableHead>EQ Preset</TableHead>
              <TableHead>EQ Recommendation</TableHead>
              <TableHead>RMS</TableHead>
              <TableHead>Peak</TableHead>
              <TableHead>Clipping</TableHead>
              <TableHead>Noise Floor</TableHead>
              <TableHead>Noise Severity</TableHead>
              <TableHead>Low</TableHead>
              <TableHead>Mid</TableHead>
              <TableHead>High</TableHead>
              <TableHead>Recommendation</TableHead>
            </tr>
          </thead>

          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={21} className="p-10 text-center text-[#8aa3b8]">
                  No session logs available. Start monitoring audio to generate
                  reports.
                </td>
              </tr>
            ) : (
              logs.map((log, index) => (
                <tr key={index} className="border-t border-[#22384d]">
                  <TableCell nowrap>{log.time}</TableCell>

                  <TableCell className={getHealthColor(log.audioHealthStatus)}>
                    {log.audioHealthScore || 0}/100
                  </TableCell>

                  <TableCell className={getHealthColor(log.audioHealthStatus)}>
                    {log.audioHealthStatus || "None"}
                  </TableCell>

                  <TableCell className="text-[#38bdf8]">
                    {log.quality}
                  </TableCell>

                  <TableCell className="text-green-400">
                    {log.qualityScore}/100
                  </TableCell>

                  <TableCell className="text-green-400">
                    {log.speechClarityScore}/100
                  </TableCell>

                  <TableCell className="text-green-400">
                    {log.speechClarityLevel}
                  </TableCell>

                  <TableCell className={getFeedbackColor(log.feedbackRisk)}>
                    {log.feedbackRisk || "Low"}
                  </TableCell>

                  <TableCell className="text-orange-300">
                    {log.feedbackBand || "None"}
                  </TableCell>

                  <TableCell className="max-w-md text-[#cfe7f8]">
                    {log.feedbackRecommendation ||
                      "No feedback recommendation available."}
                  </TableCell>

                  <TableCell className="text-purple-400">
                    {log.autoEqPreset || "Balanced Live Mix"}
                  </TableCell>

                  <TableCell className="max-w-md text-[#cfe7f8]">
                    {log.autoEqSummary || "No EQ recommendation available."}
                  </TableCell>

                  <TableCell>{log.rms}</TableCell>
                  <TableCell>{log.peak}</TableCell>
                  <TableCell>{log.clipping}</TableCell>
                  <TableCell>{log.noiseFloor}</TableCell>

                  <TableCell className="text-yellow-300">
                    {log.noiseSeverity}
                  </TableCell>

                  <TableCell>{log.lowEnergy}</TableCell>
                  <TableCell>{log.midEnergy}</TableCell>
                  <TableCell>{log.highEnergy}</TableCell>

                  <TableCell className="max-w-md text-[#cfe7f8]">
                    {log.recommendation}
                  </TableCell>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type MetricCardProps = {
  title: string;
  value: string;
  valueClass?: string;
};

function MetricCard({
  title,
  value,
  valueClass = "text-[#38bdf8]",
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-[#22384d] bg-[#0d1f31] p-5">
      <p className="text-sm text-[#8aa3b8]">{title}</p>
      <h2 className={`mt-3 text-3xl font-bold ${valueClass}`}>{value}</h2>
    </div>
  );
}

function TableHead({ children }: { children: React.ReactNode }) {
  return <th className="p-4 text-left text-sm font-semibold">{children}</th>;
}

function TableCell({
  children,
  className = "",
  nowrap = false,
}: {
  children: React.ReactNode;
  className?: string;
  nowrap?: boolean;
}) {
  return (
    <td
      className={`p-4 text-sm ${nowrap ? "whitespace-nowrap" : ""} ${className}`}
    >
      {children}
    </td>
  );
}