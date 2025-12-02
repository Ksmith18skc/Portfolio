import { create } from 'zustand';

interface PortfolioState {
  currentSection: string;
  isLoading: boolean;
  audioEnabled: boolean;
  setCurrentSection: (section: string) => void;
  setLoading: (loading: boolean) => void;
  toggleAudio: () => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  currentSection: 'intro',
  isLoading: true,
  audioEnabled: false,
  setCurrentSection: (section) => set({ currentSection: section }),
  setLoading: (loading) => set({ isLoading: loading }),
  toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),
}));