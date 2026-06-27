export type AudioLogEntry = {
  time: string;

  rms: string;
  peak: string;
  clipping: string;

  quality: string;
  qualityScore: number;

  audioHealthScore: number;
  audioHealthStatus: string;
  audioHealthSummary: string;

  noiseFloor: string;
  noiseSeverity: string;

  speechClarityScore: number;
  speechClarityLevel: string;

  autoEqPreset: string;
  autoEqSummary: string;
  autoEqActions: string[];

  feedbackRisk: string;
  feedbackBand: string;
  feedbackRecommendation: string;

  lowEnergy: string;
  midEnergy: string;
  highEnergy: string;

  recommendation: string;
};

const STORAGE_KEY = "audiopilot_session_logs";

export function saveAudioLog(entry: AudioLogEntry) {
  if (typeof window === "undefined") return;

  try {
    const existingLogs = getAudioLogs();

    const updatedLogs = [entry, ...existingLogs].slice(0, 100);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
  } catch (error) {
    console.error("Failed to save audio log:", error);
  }
}

export function getAudioLogs(): AudioLogEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const logs = localStorage.getItem(STORAGE_KEY);

    if (!logs) {
      return [];
    }

    const parsedLogs = JSON.parse(logs);

    if (!Array.isArray(parsedLogs)) {
      return [];
    }

    return parsedLogs;
  } catch (error) {
    console.error("Failed to read audio logs:", error);
    return [];
  }
}

export function clearAudioLogs() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear audio logs:", error);
  }
}

export function getLatestAudioLog(): AudioLogEntry | null {
  const logs = getAudioLogs();

  if (logs.length === 0) {
    return null;
  }

  return logs[0];
}

export function getAverageQualityScore() {
  const logs = getAudioLogs();

  if (logs.length === 0) {
    return 0;
  }

  const total = logs.reduce((sum, log) => sum + (log.qualityScore || 0), 0);

  return Math.round(total / logs.length);
}

export function getAverageAudioHealthScore() {
  const logs = getAudioLogs();

  if (logs.length === 0) {
    return 0;
  }

  const total = logs.reduce(
    (sum, log) => sum + (log.audioHealthScore || 0),
    0
  );

  return Math.round(total / logs.length);
}

export function getAverageSpeechClarity() {
  const logs = getAudioLogs();

  if (logs.length === 0) {
    return 0;
  }

  const total = logs.reduce(
    (sum, log) => sum + (log.speechClarityScore || 0),
    0
  );

  return Math.round(total / logs.length);
}

export function getHighNoiseCount() {
  const logs = getAudioLogs();

  return logs.filter((log) => log.noiseSeverity === "High").length;
}

export function getClippingCount() {
  const logs = getAudioLogs();

  return logs.filter(
    (log) => log.clipping === "Detected" || log.clipping === "Risk"
  ).length;
}

export function getWarningCount() {
  const logs = getAudioLogs();

  return logs.filter(
    (log) =>
      log.quality !== "Good" &&
      log.quality !== "Idle" &&
      log.quality !== "Ready"
  ).length;
}

export function getHighFeedbackCount() {
  const logs = getAudioLogs();

  return logs.filter((log) => log.feedbackRisk === "High").length;
}

export function getMediumFeedbackCount() {
  const logs = getAudioLogs();

  return logs.filter((log) => log.feedbackRisk === "Medium").length;
}

export function getCriticalAudioHealthCount() {
  const logs = getAudioLogs();

  return logs.filter(
    (log) =>
      log.audioHealthStatus === "Critical" || log.audioHealthStatus === "Poor"
  ).length;
}