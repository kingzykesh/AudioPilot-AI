export type AutoEqInput = {
  lowPercent: number;
  midPercent: number;
  highPercent: number;
  speechClarityScore: number;
  noiseSeverity: string;
};

export type AutoEqResult = {
  preset: string;
  actions: string[];
  summary: string;
};

export function generateAutoEqRecommendation(
  input: AutoEqInput
): AutoEqResult {
  const actions: string[] = [];

  let preset = "Balanced Live Mix";

  if (input.lowPercent > input.midPercent + 20) {
    actions.push("Reduce 80Hz–250Hz by 2dB to 4dB to control boominess.");
    preset = "Speech Cleanup";
  }

  if (input.midPercent < input.lowPercent - 15) {
    actions.push("Boost 1kHz–3kHz by 1dB to 3dB to improve vocal presence.");
    preset = "Vocal Presence";
  }

  if (input.midPercent > input.lowPercent + 25) {
    actions.push("Reduce 500Hz–2kHz by 1dB to 3dB to soften harsh midrange.");
    preset = "Harshness Control";
  }

  if (input.highPercent > input.midPercent + 25) {
    actions.push("Reduce 6kHz–10kHz by 1dB to 3dB to reduce sharpness.");
    preset = "Treble Control";
  }

  if (input.highPercent < input.midPercent - 20) {
    actions.push("Boost 4kHz–8kHz slightly to improve brightness and detail.");
    preset = "Clarity Boost";
  }

  if (input.noiseSeverity === "High") {
    actions.push(
      "Apply a noise gate or reduce microphone sensitivity to control background noise."
    );
    preset = "Noise Reduction";
  }

  if (input.speechClarityScore < 60) {
    actions.push(
      "Prioritize vocal clarity: reduce low-end rumble and improve 2kHz–4kHz presence."
    );
    preset = "Conference Speech";
  }

  if (actions.length === 0) {
    actions.push("No major EQ correction needed. Maintain current mix balance.");
  }

  return {
    preset,
    actions,
    summary: actions.join(" "),
  };
}