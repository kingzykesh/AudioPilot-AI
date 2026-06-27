export type AudioHealthInput = {
  qualityScore: number;
  speechClarityScore: number;
  noiseSeverity: string;
  clipping: string;
  feedbackRisk: string;
  lowPercent: number;
  midPercent: number;
  highPercent: number;
};

export type AudioHealthResult = {
  score: number;
  status: "Excellent" | "Good" | "Fair" | "Poor" | "Critical";
  summary: string;
};

export function calculateAudioHealth(
  input: AudioHealthInput
): AudioHealthResult {
  const {
    qualityScore,
    speechClarityScore,
    noiseSeverity,
    clipping,
    feedbackRisk,
    lowPercent,
    midPercent,
    highPercent,
  } = input;

  let score = 100;

  score -= Math.max(0, 100 - qualityScore) * 0.3;
  score -= Math.max(0, 100 - speechClarityScore) * 0.25;

  if (noiseSeverity === "Moderate") score -= 10;
  if (noiseSeverity === "High") score -= 20;

  if (clipping === "Risk") score -= 15;
  if (clipping === "Detected") score -= 30;

  if (feedbackRisk === "Medium") score -= 15;
  if (feedbackRisk === "High") score -= 30;

  const frequencySpread =
    Math.max(lowPercent, midPercent, highPercent) -
    Math.min(lowPercent, midPercent, highPercent);

  if (frequencySpread > 45) score -= 15;
  else if (frequencySpread > 30) score -= 8;

  score = Math.max(0, Math.min(100, Math.round(score)));

  let status: AudioHealthResult["status"] = "Excellent";
  let summary =
    "The audio signal is clean, balanced, clear, and suitable for live sound use.";

  if (score < 40) {
    status = "Critical";
    summary =
      "The audio condition is critical. Immediate gain reduction, noise control, feedback prevention, and EQ correction are required.";
  } else if (score < 60) {
    status = "Poor";
    summary =
      "The audio needs serious correction. Issues may include poor clarity, noise, clipping, feedback risk, or frequency imbalance.";
  } else if (score < 75) {
    status = "Fair";
    summary =
      "The audio is usable but needs improvement. Apply the suggested EQ and level corrections for better live sound quality.";
  } else if (score < 90) {
    status = "Good";
    summary =
      "The audio is generally stable with only minor issues. Continue monitoring and apply small corrections where necessary.";
  }

  return {
    score,
    status,
    summary,
  };
}