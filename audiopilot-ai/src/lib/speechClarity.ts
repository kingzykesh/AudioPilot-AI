export type SpeechClarityResult = {
  score: number;
  level: "Poor" | "Fair" | "Good" | "Excellent";
  recommendation: string;
};

export type SpeechClarityInput = {
  rmsDb: number;
  lowPercent: number;
  midPercent: number;
  highPercent: number;
  noiseSeverity: string;
};

export function calculateSpeechClarity(input: SpeechClarityInput): SpeechClarityResult {
  let score = 100;

  if (input.rmsDb < -45) score -= 30;
  if (input.rmsDb > -10) score -= 20;

  if (input.lowPercent > input.midPercent + 20) score -= 20;
  if (input.highPercent > input.midPercent + 25) score -= 15;
  if (input.noiseSeverity === "High") score -= 25;
  if (input.noiseSeverity === "Moderate") score -= 10;

  score = Math.max(0, Math.min(100, score));

  if (score >= 85) {
    return {
      score,
      level: "Excellent",
      recommendation:
        "Speech clarity is excellent. Voice should be easy to understand in the room.",
    };
  }

  if (score >= 70) {
    return {
      score,
      level: "Good",
      recommendation:
        "Speech clarity is good. Minor EQ or gain adjustments may improve intelligibility.",
    };
  }

  if (score >= 50) {
    return {
      score,
      level: "Fair",
      recommendation:
        "Speech clarity is fair. Reduce background noise and balance vocal frequencies.",
    };
  }

  return {
    score,
    level: "Poor",
    recommendation:
      "Speech clarity is poor. Check microphone distance, reduce noise, and rebalance EQ.",
  };
}