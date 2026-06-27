export type NoiseFloorResult = {
  noiseDb: number;
  severity: "Low" | "Moderate" | "High";
  recommendation: string;
};

export function calculateNoiseFloor(rmsDb: number): NoiseFloorResult {
  if (rmsDb <= -60) {
    return {
      noiseDb: rmsDb,
      severity: "Low",
      recommendation:
        "Environment is clean. Background noise is minimal.",
    };
  }

  if (rmsDb <= -45) {
    return {
      noiseDb: rmsDb,
      severity: "Moderate",
      recommendation:
        "Moderate ambient noise detected. Consider microphone positioning adjustments.",
    };
  }

  return {
    noiseDb: rmsDb,
    severity: "High",
    recommendation:
      "High background noise detected. Reduce environmental noise or apply noise suppression.",
  };
}