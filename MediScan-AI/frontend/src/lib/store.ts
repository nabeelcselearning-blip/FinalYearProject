import { create } from 'zustand';

interface UIState {
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;

  isUploadOpen: boolean;
  setUploadOpen: (open: boolean) => void;
  openUploadModal: () => void;

  selectedComparisonIds: string[];
  toggleComparisonId: (id: string) => void;
  clearComparisonIds: () => void;

  reportSearchQuery: string;
  setReportSearchQuery: (query: string) => void;
  reportRiskFilter: string;
  setReportRiskFilter: (risk: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCommandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),

  isUploadOpen: false,
  setUploadOpen: (open) => set({ isUploadOpen: open }),
  openUploadModal: () => set({ isUploadOpen: true }),

  selectedComparisonIds: [],
  toggleComparisonId: (id) =>
    set((state) => {
      if (state.selectedComparisonIds.includes(id)) {
        return { selectedComparisonIds: state.selectedComparisonIds.filter((i) => i !== id) };
      }
      if (state.selectedComparisonIds.length >= 2) {
        return { selectedComparisonIds: [state.selectedComparisonIds[1], id] };
      }
      return { selectedComparisonIds: [...state.selectedComparisonIds, id] };
    }),
  clearComparisonIds: () => set({ selectedComparisonIds: [] }),

  reportSearchQuery: '',
  setReportSearchQuery: (query) => set({ reportSearchQuery: query }),
  reportRiskFilter: 'all',
  setReportRiskFilter: (risk) => set({ reportRiskFilter: risk }),
}));
