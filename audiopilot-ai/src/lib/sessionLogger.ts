export type AudioLogEntry = {
  time: string;
  rms: string;
  peak: string;
  clipping: string;
  quality: string;
  qualityScore: number;
  noiseFloor: string;
  noiseSeverity: string;
  lowEnergy: string;
  midEnergy: string;
  highEnergy: string;
  recommendation: string;
};

const STORAGE_KEY = "audiopilot_session_logs";

export function saveAudioLog(entry: AudioLogEntry) {
  if (typeof window === "undefined") return;

  const existingLogs = getAudioLogs();
  const updatedLogs = [entry, ...existingLogs].slice(0, 100);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
}

export function getAudioLogs(): AudioLogEntry[] {
  if (typeof window === "undefined") return [];

  const logs = localStorage.getItem(STORAGE_KEY);
  if (!logs) return [];

  try {
    return JSON.parse(logs) as AudioLogEntry[];
  } catch {
    return [];
  }
}

export function clearAudioLogs() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEY);
}