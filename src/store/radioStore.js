import { create } from "zustand";

const useRadioStore = create((set) => ({
  currentStation: null,
  isPlaying: false,
  volume: 50,
  stations: [],
  setCurrentStation: (station) => set({ currentStation: station }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setVolume: (volume) => set({ volume }),
  setStations: (stations) => set({ stations }),
}));

export default useRadioStore;
