import { create } from 'zustand';

import type { Show } from '@/types/show';

type ShowState = {
  /** The show currently being created/reviewed, or null when none is active. */
  currentShow: Show | null;
  /** Replace the current show wholesale (e.g., after extraction). */
  setCurrentShow: (show: Show) => void;
  /** Merge partial changes into the current show (no-op if none is set). */
  updateShow: (changes: Partial<Show>) => void;
};

export const useShowStore = create<ShowState>((set) => ({
  currentShow: null,
  setCurrentShow: (show) => set({ currentShow: show }),
  updateShow: (changes) =>
    set((state) =>
      state.currentShow ? { currentShow: { ...state.currentShow, ...changes } } : state,
    ),
}));
