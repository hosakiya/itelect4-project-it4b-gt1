import { create } from 'zustand';

interface UiState {
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  selectedGenre: 'All',
  setSelectedGenre: (selectedGenre) => set({ selectedGenre }),
}));
