import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import SoundCloudAudio from "soundcloud-audio";
import { useSettingsStore } from "../hooks/stores/settings-store.js";
import { normalize } from "../utils.js";

export const player = new SoundCloudAudio();
player.audio.crossOrigin = "anonymous";
export const audioCtx = new (window.AudioContext ||
  window.webkitAudioContext)();
export const audioSrc = audioCtx.createMediaElementSource(player.audio);
export const analyser = audioCtx.createAnalyser();
analyser.fftSize = Math.pow(2, 15);
analyser.minDecibels = -70;
analyser.maxDecibels = -10;
export const gainNode = audioCtx.createGain();
audioSrc.connect(analyser);
audioSrc.connect(gainNode);
gainNode.connect(audioCtx.destination);

type EngineContext = {
  maxFrequencyDisplayed: number;
  maxFrequencyInArray: number | null;
  nbValuesToKeepInArray: number | null;
  frequencyBinCount: number | null;
  fftSize: number | null;
  frequencyData: Uint8Array | null;
  frequencyDataCopy: Uint8Array | null;
  timeDomainData: Float32Array | null;
  updateEngine: () => void;
};

export const EngineContext = createContext<EngineContext>({} as EngineContext);
EngineContext.displayName = "EngineContext";

export const EngineProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const maxFrequencyDisplayed = 2000;
  const [maxFrequencyInArray, setMaxFrequencyInArray] =
    useState<EngineContext["maxFrequencyInArray"]>(null);
  const [nbValuesToKeepInArray, setNbValuesToKeepInArray] =
    useState<EngineContext["nbValuesToKeepInArray"]>(null);
  const [frequencyBinCount, setFrequencyBinCount] =
    useState<EngineContext["frequencyBinCount"]>(null);
  const [fftSize, setFftSize] = useState<EngineContext["fftSize"]>(null);

  const frequencyData = useMemo(() => {
    if (!frequencyBinCount) return null;
    return new Uint8Array(frequencyBinCount);
  }, [frequencyBinCount]);

  const frequencyDataCopy = useMemo(() => {
    if (!frequencyBinCount) return null;
    return new Uint8Array(frequencyBinCount);
  }, [frequencyBinCount]);

  const timeDomainData = useMemo(() => {
    if (!fftSize) return null;
    return new Float32Array(fftSize);
  }, [fftSize]);

  const updateEngine = useCallback(() => {
    const maxFrequencyInArray =
      audioCtx.sampleRate / (2 * audioCtx.destination.channelCount);
    const nbValuesToKeepInArray = normalize(
      maxFrequencyDisplayed,
      maxFrequencyInArray,
      analyser.frequencyBinCount,
    );
    setMaxFrequencyInArray(maxFrequencyInArray);
    setNbValuesToKeepInArray(nbValuesToKeepInArray);
    setFrequencyBinCount(analyser?.frequencyBinCount || 0);
    setFftSize(analyser?.fftSize || 0);
  }, []);

  const contextValue: EngineContext = {
    maxFrequencyDisplayed,
    maxFrequencyInArray,
    nbValuesToKeepInArray,
    frequencyBinCount,
    fftSize,
    frequencyData,
    frequencyDataCopy,
    timeDomainData,
    updateEngine,
  };

  const contextValueMemoized = useMemo(
    () => contextValue,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    Object.values(contextValue),
  );

  return (
    <EngineContext.Provider value={contextValueMemoized}>
      <EngineSettingsController />
      {children}
    </EngineContext.Provider>
  );
};

const EngineSettingsController: React.FC = () => {
  const volume = useSettingsStore((state) => state.volume);
  const muted = useSettingsStore((state) => state.muted);
  const smoothing = useSettingsStore((state) => state.smoothing);

  useEffect(() => {
    gainNode.gain.value = muted ? 0 : volume / 100;
  }, [volume, muted]);

  useEffect(() => {
    analyser.smoothingTimeConstant = smoothing / 100;
  }, [smoothing]);

  return null;
};
