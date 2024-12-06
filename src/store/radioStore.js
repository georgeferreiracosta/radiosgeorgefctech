import { create } from 'zustand';

const useRadioStore = create((set) => ({
  currentStation: null,
  isPlaying: false,
  volume: 80,
  setCurrentStation: (station) => set({ currentStation: station }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setVolume: (volume) => set({ volume }),
}));

export default useRadioStore;