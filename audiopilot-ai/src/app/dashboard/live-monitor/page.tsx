"use client";

import { useRef, useState } from "react";
import { saveAudioLog } from "@/lib/sessionLogger";
import { calculateAudioQualityScore } from "@/lib/audioQuality";
import { calculateNoiseFloor } from "@/lib/noiseFloor";

export default function LiveMonitorPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const spectrumRef = useRef<HTMLCanvasElement | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const animationRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lastLogTimeRef = useRef<number>(0);

  const [isMonitoring, setIsMonitoring] = useState(false);

  const [rms, setRms] = useState("-∞ dB");
  const [peak, setPeak] = useState("-∞ dBFS");
  const [clipping, setClipping] = useState("Not Detected");
  const [quality, setQuality] = useState("Idle");
  const [qualityScore, setQualityScore] = useState(100);

  const [noiseFloor, setNoiseFloor] = useState("-∞ dB");
  const [noiseSeverity, setNoiseSeverity] = useState("Low");

  const [lowEnergy, setLowEnergy] = useState("0%");
  const [midEnergy, setMidEnergy] = useState("0%");
  const [highEnergy, setHighEnergy] = useState("0%");

  const [recommendation, setRecommendation] = useState(
    "Start monitoring to receive real-time recommendations."
  );

  const drawWaveform = (dataArray: Float32Array) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#06131f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#38bdf8";
    ctx.beginPath();

    const sliceWidth = canvas.width / dataArray.length;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
      const y = (dataArray[i] * 0.5 + 0.5) * canvas.height;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);

      x += sliceWidth;
    }

    ctx.stroke();

    ctx.strokeStyle = "#22384d";
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  };

  const drawSpectrum = (freqData: Uint8Array) => {
    const canvas = spectrumRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#06131f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = canvas.width / freqData.length;

    for (let i = 0; i < freqData.length; i++) {
      const barHeight = (freqData[i] / 255) * canvas.height;
      const x = i * barWidth;
      const y = canvas.height - barHeight;

      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(x, y, barWidth + 1, barHeight);
    }
  };

  const startMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.85;

      source.connect(analyser);

      audioContextRef.current = audioContext;
      lastLogTimeRef.current = Date.now();

      const timeData = new Float32Array(analyser.fftSize);
      const freqData = new Uint8Array(analyser.frequencyBinCount);

      const analyze = () => {
        analyser.getFloatTimeDomainData(timeData);
        analyser.getByteFrequencyData(freqData);

        let sumSquares = 0;
        let maxPeak = 0;

        for (const sample of timeData) {
          sumSquares += sample * sample;
          maxPeak = Math.max(maxPeak, Math.abs(sample));
        }

        const rmsValue = Math.sqrt(sumSquares / timeData.length);
        const rmsDb = 20 * Math.log10(rmsValue || 0.00001);
        const peakDb = 20 * Math.log10(maxPeak || 0.00001);

        const noiseResult = calculateNoiseFloor(rmsDb);

        const sampleRate = audioContext.sampleRate;
        const nyquist = sampleRate / 2;
        const binSize = nyquist / freqData.length;

        const getBandEnergy = (minFreq: number, maxFreq: number) => {
          const startBin = Math.floor(minFreq / binSize);
          const endBin = Math.min(
            Math.floor(maxFreq / binSize),
            freqData.length - 1
          );

          let total = 0;
          let count = 0;

          for (let i = startBin; i <= endBin; i++) {
            total += freqData[i];
            count++;
          }

          return count ? total / count : 0;
        };

        const low = getBandEnergy(20, 250);
        const mid = getBandEnergy(250, 4000);
        const high = getBandEnergy(4000, 12000);

        const lowPercent = Math.min(100, Math.round((low / 255) * 100));
        const midPercent = Math.min(100, Math.round((mid / 255) * 100));
        const highPercent = Math.min(100, Math.round((high / 255) * 100));

        const qualityResult = calculateAudioQualityScore({
          rmsDb,
          peakDb,
          lowPercent,
          midPercent,
          highPercent,
        });

        let currentClipping = "Not Detected";
        let currentQuality = "Good";
        let currentRecommendation =
          "Signal and frequency balance look healthy. Maintain current settings.";

        if (maxPeak > 0.98) {
          currentClipping = "Detected";
          currentQuality = "Poor";
          currentRecommendation =
            "Clipping detected. Reduce microphone gain or lower the mixer input level.";
        } else if (rmsDb < -45) {
          currentQuality = "Low Signal";
          currentRecommendation =
            "Signal level is too low. Increase input gain carefully until speech becomes clear.";
        } else if (rmsDb > -10) {
          currentClipping = "Risk";
          currentQuality = "Too Loud";
          currentRecommendation =
            "Signal is getting too loud. Reduce input gain to prevent distortion.";
        } else if (noiseResult.severity === "High") {
          currentQuality = "Noisy";
          currentRecommendation = noiseResult.recommendation;
        } else if (lowPercent > midPercent + 20) {
          currentQuality = "Boomy";
          currentRecommendation =
            "Low frequencies are dominant. Reduce bass or apply a low-cut filter to improve clarity.";
        } else if (
          midPercent > lowPercent + 25 &&
          midPercent > highPercent + 20
        ) {
          currentQuality = "Harsh Midrange";
          currentRecommendation =
            "Mid frequencies are too dominant. Slightly reduce the mid EQ range to soften the mix.";
        } else if (highPercent > midPercent + 25) {
          currentQuality = "Bright";
          currentRecommendation =
            "High frequencies are dominant. Reduce treble slightly to avoid harshness.";
        }

        const currentRms = `${rmsDb.toFixed(1)} dB`;
        const currentPeak = `${peakDb.toFixed(1)} dBFS`;
        const currentNoiseFloor = `${noiseResult.noiseDb.toFixed(1)} dB`;
        const currentNoiseSeverity = noiseResult.severity;

        const currentLow = `${lowPercent}%`;
        const currentMid = `${midPercent}%`;
        const currentHigh = `${highPercent}%`;

        setRms(currentRms);
        setPeak(currentPeak);
        setClipping(currentClipping);
        setQuality(currentQuality);
        setQualityScore(qualityResult.score);

        setNoiseFloor(currentNoiseFloor);
        setNoiseSeverity(currentNoiseSeverity);

        setLowEnergy(currentLow);
        setMidEnergy(currentMid);
        setHighEnergy(currentHigh);

        setRecommendation(currentRecommendation);

        const now = Date.now();

        if (now - lastLogTimeRef.current >= 5000) {
          saveAudioLog({
            time: new Date().toLocaleString(),
            rms: currentRms,
            peak: currentPeak,
            clipping: currentClipping,
            quality: currentQuality,
            qualityScore: qualityResult.score,
            noiseFloor: currentNoiseFloor,
            noiseSeverity: currentNoiseSeverity,
            lowEnergy: currentLow,
            midEnergy: currentMid,
            highEnergy: currentHigh,
            recommendation: currentRecommendation,
          });

          lastLogTimeRef.current = now;
        }

        drawWaveform(timeData);
        drawSpectrum(freqData);

        animationRef.current = requestAnimationFrame(analyze);
      };

      analyze();
      setIsMonitoring(true);
    } catch {
      alert("Microphone permission denied or unavailable.");
    }
  };

  const stopMonitoring = async () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (audioContextRef.current) {
      await audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setIsMonitoring(false);
    setQuality("Idle");
    setRecommendation("Monitoring stopped.");
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-5">
        <div>
          <h1 className="text-3xl font-bold">Live Audio Monitor</h1>
          <p className="mt-2 text-[#8aa3b8]">
            Analyze microphone audio using waveform, frequency spectrum, noise
            floor, quality score, and DSP metrics.
          </p>
        </div>

        <button
          onClick={isMonitoring ? stopMonitoring : startMonitoring}
          className="rounded-xl bg-[#38bdf8] px-5 py-3 font-semibold text-[#06131f]"
        >
          {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
        </button>
      </div>

      <div className="mt-8 grid grid-cols-7 gap-5">
        <div className="rounded-2xl border border-[#22384d] bg-[#0d1f31] p-5">
          <p className="text-sm text-[#8aa3b8]">RMS Level</p>
          <h2 className="mt-4 text-2xl font-bold text-[#38bdf8]">{rms}</h2>
        </div>

        <div className="rounded-2xl border border-[#22384d] bg-[#0d1f31] p-5">
          <p className="text-sm text-[#8aa3b8]">Peak Level</p>
          <h2 className="mt-4 text-2xl font-bold text-[#38bdf8]">{peak}</h2>
        </div>

        <div className="rounded-2xl border border-[#22384d] bg-[#0d1f31] p-5">
          <p className="text-sm text-[#8aa3b8]">Clipping</p>
          <h2 className="mt-4 text-2xl font-bold text-[#38bdf8]">
            {clipping}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#22384d] bg-[#0d1f31] p-5">
          <p className="text-sm text-[#8aa3b8]">Signal Quality</p>
          <h2 className="mt-4 text-2xl font-bold text-[#38bdf8]">
            {quality}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#22384d] bg-[#0d1f31] p-5">
          <p className="text-sm text-[#8aa3b8]">Quality Score</p>
          <h2 className="mt-4 text-2xl font-bold text-green-400">
            {qualityScore}/100
          </h2>
        </div>

        <div className="rounded-2xl border border-[#22384d] bg-[#0d1f31] p-5">
          <p className="text-sm text-[#8aa3b8]">Noise Floor</p>
          <h2 className="mt-4 text-2xl font-bold text-[#38bdf8]">
            {noiseFloor}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#22384d] bg-[#0d1f31] p-5">
          <p className="text-sm text-[#8aa3b8]">Noise Severity</p>
          <h2 className="mt-4 text-2xl font-bold text-yellow-300">
            {noiseSeverity}
          </h2>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-5">
        <div className="rounded-2xl border border-[#22384d] bg-[#0d1f31] p-5">
          <p className="text-sm text-[#8aa3b8]">Low Frequency</p>
          <h2 className="mt-4 text-2xl font-bold text-[#38bdf8]">
            {lowEnergy}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#22384d] bg-[#0d1f31] p-5">
          <p className="text-sm text-[#8aa3b8]">Mid Frequency</p>
          <h2 className="mt-4 text-2xl font-bold text-[#38bdf8]">
            {midEnergy}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#22384d] bg-[#0d1f31] p-5">
          <p className="text-sm text-[#8aa3b8]">High Frequency</p>
          <h2 className="mt-4 text-2xl font-bold text-[#38bdf8]">
            {highEnergy}
          </h2>
        </div>
      </div>

      <section className="mt-8 rounded-2xl border border-[#22384d] bg-[#0d1f31] p-6">
        <h2 className="text-lg font-semibold">Real-Time Waveform</h2>

        <canvas
          ref={canvasRef}
          width={1200}
          height={320}
          className="mt-5 h-72 w-full rounded-xl border border-[#22384d] bg-[#06131f]"
        />
      </section>

      <section className="mt-8 rounded-2xl border border-[#22384d] bg-[#0d1f31] p-6">
        <h2 className="text-lg font-semibold">Frequency Spectrum</h2>

        <canvas
          ref={spectrumRef}
          width={1200}
          height={320}
          className="mt-5 h-72 w-full rounded-xl border border-[#22384d] bg-[#06131f]"
        />
      </section>

      <section className="mt-8 rounded-2xl border border-[#22384d] bg-[#0d1f31] p-6">
        <h2 className="text-lg font-semibold">AudioPilot Recommendation</h2>

        <div className="mt-5 rounded-xl border border-[#22384d] bg-[#11283d] p-5">
          <p className="text-[#cfe7f8]">{recommendation}</p>
        </div>
      </section>
    </div>
  );
}