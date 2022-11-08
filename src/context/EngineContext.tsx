import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSettingsStore } from "../hooks/stores/settings-store";
import { normalize } from "../utils";

type EngineContext = {
  audioCtx: AudioContext | undefined;
  gainNode: GainNode | undefined;
  analyser: AnalyserNode | undefined;
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

  const audioCtx = useMemo(() => {
    return new (window.AudioContext || window.webkitAudioContext)();
  }, []);

  const analyser = useMemo(() => {
    if (!audioCtx) return;
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = Math.pow(2, 15);
    analyser.minDecibels = -70;
    analyser.maxDecibels = -10;
    return analyser;
  }, [audioCtx]);

  const gainNode = useMemo(() => {
    if (!audioCtx) return;
    const gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);
    return gainNode;
  }, [audioCtx]);

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
    if (!analyser) return;
    const maxFrequencyInArray =
      audioCtx.sampleRate / (2 * audioCtx.destination.channelCount);
    const nbValuesToKeepInArray = normalize(
      maxFrequencyDisplayed,
      maxFrequencyInArray,
      analyser.frequencyBinCount
    );
    setMaxFrequencyInArray(maxFrequencyInArray);
    setNbValuesToKeepInArray(nbValuesToKeepInArray);
    setFrequencyBinCount(analyser?.frequencyBinCount || 0);
    setFftSize(analyser?.fftSize || 0);
  }, [audioCtx, analyser]);

  const contextValue: EngineContext = {
    audioCtx,
    gainNode,
    analyser,
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
    Object.values(contextValue)
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
  const smoothing = useSettingsStore((state) => state.smoothing);
  const { gainNode, analyser } = useContext(EngineContext);

  useEffect(() => {
    if (!gainNode) return;
    gainNode.gain.value = volume / 100;
  }, [gainNode, volume]);

  useEffect(() => {
    if (!analyser) return;
    analyser.smoothingTimeConstant = smoothing / 100;
  }, [analyser, smoothing]);

  return null;
};
