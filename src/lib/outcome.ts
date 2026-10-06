import { DEFAULT_ALT_ID, getAlt } from '@/lib/alternatives';

export type HomeTiming = 'today' | 'later';
export type Verdict = 'stay' | 'switch';
/** What the data situation is for this renewal. "first" and "unavailable" would come from a backend. */
export type DataState = 'normal' | 'first' | 'unavailable';
/** Everything the Renewal Check screen can end up showing after loading. */
export type Outcome = 'stay' | 'switch' | 'first' | 'unavailable' | 'too-late';

/**
 * Decides which result the Renewal Check screen shows.
 *
 * IRDAI portability applications must be made 45-60 days before renewal and close ~30 days before
 * expiry. When the policy is expiring today (`homeTiming === 'today'`) that window has already closed,
 * so anything that would point at switching degrades to the honest "too late" state:
 *  - a Switch verdict (would recommend something impossible), and
 *  - "data unavailable" (it would name a hypothetical alternative nobody can act on).
 * A Stay verdict and a first-renewal verdict don't ask the user to switch, so they are unaffected.
 */
export function resolveOutcome(input: { homeTiming: HomeTiming; verdict: Verdict; dataState: DataState }): Outcome {
  const { homeTiming, verdict, dataState } = input;
  const tooLate = homeTiming === 'today';
  if (dataState === 'first') return 'first';
  if (dataState === 'unavailable') return tooLate ? 'too-late' : 'unavailable';
  if (verdict === 'switch') return tooLate ? 'too-late' : 'switch';
  return 'stay';
}

/** Outcomes that carry the neutral "Checked" tag and the evidence link: something was actually verified. */
export const isChecked = (o: Outcome) => o === 'stay' || o === 'switch' || o === 'first';

export interface NoticeCopy {
  headline: string;
  detail: string;
}

export interface TooLateCopy {
  headline: string;
  bullets: string[];
}

/** Copy for "data unavailable": no verdict at all, and it never names a hypothetical alternative. */
export function noticeCopy(outcome: 'unavailable'): NoticeCopy {
  return {
    headline: `We can verify Star Health, not ${getAlt(DEFAULT_ALT_ID).name} yet.`,
    detail:
      "We only show a switch recommendation once both insurers' public claim-settlement data is available. Your current plan's details are below.",
  };
}

/** Copy for "too late to switch": no verdict, and no hypothetical alternative once switching is impossible. */
export function tooLateCopy(): TooLateCopy {
  return {
    headline: 'Renewing is your only option for this cycle.',
    bullets: [
      "Switching insurers needs to be requested 45-60 days before your renewal date under IRDAI's rules.",
      'That window has already closed for this policy.',
      "We'll check again with enough lead time before your next renewal, when switching is still possible.",
    ],
  };
}

export const FIRST_RENEWAL_COPY: NoticeCopy = {
  headline: 'Your current plan still holds up.',
  detail:
    "This is your first renewal, so there's no prior year to compare — but the premium and coverage match what similar plans cost today.",
};
