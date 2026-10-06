import type { Verdict } from '@/store/flow';
import { POLICY } from '@/lib/content';

/** Published date of the IRDAI claim-settlement data the verdict was checked against. */
export const EVIDENCE_DATE = new Date(2026, 6, 1); // 1 Jul 2026
/** Dev-only alternate date, used to demo the staleness warning. */
export const EVIDENCE_DATE_STALE = new Date(2026, 0, 15); // 15 Jan 2026
export const STALE_AFTER_MONTHS = 6;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Whole calendar months elapsed from `from` to `now` (never negative). */
export function monthsBetween(from: Date, now: Date): number {
  let m = (now.getFullYear() - from.getFullYear()) * 12 + (now.getMonth() - from.getMonth());
  if (now.getDate() < from.getDate()) m -= 1;
  return Math.max(m, 0);
}

export function addMonths(d: Date, n: number): Date {
  const r = new Date(d.getTime());
  r.setMonth(r.getMonth() + n);
  return r;
}

export interface Freshness {
  dateLine: string;
  stale: boolean;
}

/** "Dated 1 Jul 2026 — 3 months ago." plus whether it has crossed the 6-month staleness line. */
export function evidenceFreshness(dataDate: Date, now: Date): Freshness {
  const months = monthsBetween(dataDate, now);
  const date = `${dataDate.getDate()} ${MONTHS[dataDate.getMonth()]} ${dataDate.getFullYear()}`;
  const age = months < 1 ? 'less than a month ago' : months === 1 ? '1 month ago' : `${months} months ago`;
  return {
    dateLine: `Dated ${date} — ${age}.`,
    stale: addMonths(dataDate, STALE_AFTER_MONTHS) < now,
  };
}

/** Verdict-aware "what was compared" / "what this isn't" copy. Stay never names a competitor. */
export function evidenceCopy(verdict: Verdict, altName: string) {
  if (verdict === 'switch') {
    return {
      compared: `Premium, coverage amount, claim-settlement ratio, and hospital network for your ${POLICY.planName} against ${altName}, the closest equivalent plan available.`,
      notThis:
        "Not PolicyBazaar's opinion of either insurer — a comparison against numbers both insurers report to the regulator.",
    };
  }
  return {
    compared: `Your ${POLICY.planName}'s premium and coverage against current market rates for similar plans — no alternative outperformed it enough to recommend switching.`,
    notThis:
      "Not PolicyBazaar's opinion of your insurer — a comparison against market-wide numbers insurers report to the regulator.",
  };
}
