export type QualityInput = {
  rmsDb: number;
  peakDb: number;
  lowPercent: number;
  midPercent: number;
  highPercent: number;
};

export function calculateAudioQualityScore(input: QualityInput) {
  let score = 100;
  const issues: string[] = [];

  if (input.peakDb > -1) {
    score -= 35;
    issues.push("Clipping risk detected");
  }

  if (input.rmsDb < -45) {
    score -= 25;
    issues.push("Signal is too low");
  }

  if (input.rmsDb > -10) {
    score -= 20;
    issues.push("Signal is too loud");
  }

  if (input.lowPercent > input.midPercent + 20) {
    score -= 15;
    issues.push("Low frequency dominance");
  }

  if (
    input.midPercent > input.lowPercent + 25 &&
    input.midPercent > input.highPercent + 20
  ) {
    score -= 15;
    issues.push("Mid frequency harshness");
  }

  if (input.highPercent > input.midPercent + 25) {
    score -= 15;
    issues.push("High frequency harshness");
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    issues,
  };
}