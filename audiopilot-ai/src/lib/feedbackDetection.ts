export type FeedbackDetectionInput = {
  lowPercent: number;
  midPercent: number;
  highPercent: number;
  peakDb: number;
  rmsDb: number;
};

export type FeedbackDetectionResult = {
  risk: "Low" | "Medium" | "High";
  likelyBand: string;
  recommendation: string;
  reason: string;
};

export function detectFeedbackRisk(
  input: FeedbackDetectionInput
): FeedbackDetectionResult {
  const { lowPercent, midPercent, highPercent, peakDb, rmsDb } = input;

  let risk: FeedbackDetectionResult["risk"] = "Low";
  let likelyBand = "None";
  let recommendation =
    "No feedback risk detected. Maintain current microphone and speaker positioning.";
  let reason = "Signal is balanced and stable.";

  if (peakDb > -3 && highPercent > 65) {
    risk = "High";
    likelyBand = "4kHz - 8kHz";
    recommendation =
      "Possible high-frequency feedback detected. Reduce microphone gain, move the microphone away from speakers, or apply a notch filter around 4kHz - 8kHz.";
    reason =
      "Peak level is very high and high-frequency energy is dominant.";
  } else if (peakDb > -6 && midPercent > 70) {
    risk = "High";
    likelyBand = "1kHz - 4kHz";
    recommendation =
      "Possible mid-frequency feedback detected. Reduce monitor send, lower input gain, or apply a narrow EQ cut around 1kHz - 4kHz.";
    reason =
      "Strong mid-frequency buildup is present with high peak level.";
  } else if (highPercent > 60 && rmsDb > -18) {
    risk = "Medium";
    likelyBand = "4kHz - 8kHz";
    recommendation =
      "High-frequency feedback risk is building. Slightly reduce treble or adjust microphone direction.";
    reason =
      "High frequencies are becoming dominant while the signal is loud.";
  } else if (midPercent > 65 && rmsDb > -20) {
    risk = "Medium";
    likelyBand = "1kHz - 4kHz";
    recommendation =
      "Mid-frequency feedback risk is building. Reduce mid EQ slightly or lower monitor level.";
    reason =
      "Mid frequencies are dominant and may cause ringing in live sound.";
  } else if (lowPercent > 70 && rmsDb > -16) {
    risk = "Medium";
    likelyBand = "125Hz - 250Hz";
    recommendation =
      "Low-frequency resonance detected. Apply a low-cut filter or reduce bass buildup.";
    reason =
      "Low-frequency energy is excessive and may create rumble or resonance.";
  }

  return {
    risk,
    likelyBand,
    recommendation,
    reason,
  };
}