import { create } from 'zustand';
import { DEFAULT_ALT_ID, getAlt, type Alternative } from '@/lib/alternatives';
import type { Action } from '@/lib/carryover';
import type { ConfirmedUpgrade } from '@/lib/checkout';
import { DEFAULT_RIDER_IDS, type Term } from '@/lib/pricing';

import type { DataState, HomeTiming, Verdict } from '@/lib/outcome';

export type { DataState, HomeTiming, Verdict };

/** Created only when payment actually completes. Its existence is what "declaration issued" means. */
export interface Receipt {
  action: Action;
  planName: string;
  term: Term;
  riderIds: string[];
  total: number;
  issuedOn: string; // ISO date
}

interface FlowState {
  /** What the check recommended. Drives the Renewal Check screen only. */
  verdict: Verdict;
  /** What the user chose to do. Drives Carryover, Confirm and Success (they can renew despite a switch verdict). */
  action: Action;
  /** Single source of truth for the marketplace pick. Every screen derives the plan from this id. */
  selectedAltId: string;
  /** Selected term. Prices are always derived from it; nothing else writes a price. */
  term: Term;
  /** Ids of selected riders (@/lib/pricing RIDERS). Starts with the sheet's default picks. */
  riderIds: string[];
  /** Optional richer tier of the plan being confirmed. Only applied while it matches that plan (see planToBuy). */
  confirmedUpgrade: ConfirmedUpgrade | null;
  receipt: Receipt | null;
  homeTiming: HomeTiming;
  introSeen: boolean;
  devCheckHangs: boolean;
  /** Dev-only: stand-in for what the backend would report about the data behind this renewal. */
  devDataState: DataState;
  devStaleData: boolean;
  devLongPremium: boolean;
  devNoBonus: boolean;
  devCarryoverLoading: boolean;
  /** One-shot: the next payment fails, then this resets. */
  devPaymentFailsNext: boolean;
  setVerdict: (v: Verdict) => void;
  setAction: (a: Action) => void;
  selectAlt: (id: string) => void;
  setTerm: (t: Term) => void;
  setRiderIds: (ids: string[]) => void;
  setUpgrade: (u: ConfirmedUpgrade | null) => void;
  completePayment: (receipt: Receipt) => void;
  /** Back to a clean flow after Done. Keeps dev toggles and the "intro seen" flag. */
  startOver: () => void;
  setHomeTiming: (t: HomeTiming) => void;
  markIntroSeen: () => void;
  resetIntro: () => void;
  setDev: (patch: Partial<Pick<FlowState,
    'devCheckHangs' | 'devDataState' | 'devStaleData' | 'devLongPremium' | 'devNoBonus' | 'devCarryoverLoading' | 'devPaymentFailsNext'>>) => void;
}

export const useFlow = create<FlowState>((set) => ({
  verdict: 'stay',
  action: 'renew',
  selectedAltId: DEFAULT_ALT_ID,
  term: 1,
  riderIds: DEFAULT_RIDER_IDS,
  confirmedUpgrade: null,
  receipt: null,
  homeTiming: 'later',
  introSeen: false,
  devCheckHangs: false,
  devDataState: 'normal',
  devStaleData: false,
  devLongPremium: false,
  devNoBonus: false,
  devCarryoverLoading: false,
  devPaymentFailsNext: false,
  setVerdict: (verdict) => set({ verdict }),
  setAction: (action) => set({ action }),
  selectAlt: (selectedAltId) => set({ selectedAltId }),
  setTerm: (term) => set({ term }),
  setRiderIds: (riderIds) => set({ riderIds }),
  setUpgrade: (confirmedUpgrade) => set({ confirmedUpgrade }),
  completePayment: (receipt) => set({ receipt }),
  startOver: () => set({ action: 'renew', selectedAltId: DEFAULT_ALT_ID, term: 1, riderIds: DEFAULT_RIDER_IDS, confirmedUpgrade: null, receipt: null }),
  setHomeTiming: (homeTiming) => set({ homeTiming }),
  markIntroSeen: () => set({ introSeen: true }),
  resetIntro: () => set({ introSeen: false }),
  setDev: (patch) => set(patch),
}));

/** The currently picked alternative, derived from the single selected id. */
export function useSelectedAlt(): Alternative {
  return getAlt(useFlow((s) => s.selectedAltId));
}
