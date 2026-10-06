// Pure pricing maths for the Confirm screen. Every price shown or charged comes from here and is
// derived from the plan's 1-year premium. Never hand-write a 3-year number (it drifted out of sync
// with the formula twice in the prototype).

export type Term = 1 | 3;

/** 3-year purchases cost 94% of three 1-year premiums. */
export const THREE_YEAR_PERCENT = 94;

export interface RiderOption {
  id: string;
  name: string;
  detail: string;
  perYear: number;
  defaultOn: boolean;
}

/** Optional riders offered on the Confirm screen. No multi-year discount is stated, so none is applied. */
export const RIDERS: RiderOption[] = [
  { id: 'ci', name: 'Critical illness cover', detail: 'Lump-sum payout of ₹10 lakh if you are diagnosed with any of 34 listed critical illnesses.', perYear: 1150, defaultOn: true },
  { id: 'hdc', name: 'Hospital daily cash', detail: '₹2,000 for every day you are hospitalised, up to 30 days a year.', perYear: 420, defaultOn: true },
  { id: 'pa', name: 'Personal accident cover', detail: '₹10 lakh payout for accidental death or permanent disability.', perYear: 360, defaultOn: false },
  { id: 'rrw', name: 'Room rent waiver', detail: 'No cap on the room category you choose in a network hospital.', perYear: 610, defaultOn: false },
];
export const DEFAULT_RIDER_IDS = RIDERS.filter((r) => r.defaultOn).map((r) => r.id);
export const getRider = (id: string): RiderOption => RIDERS.find((r) => r.id === id) ?? RIDERS[0];

/** round(1yr x 3 x 0.94) to the nearest rupee, in integer arithmetic (no float drift). */
export function threeYearPrice(oneYear: number): number {
  return Math.round((oneYear * 3 * THREE_YEAR_PERCENT) / 100);
}

export function termPrice(oneYear: number, term: Term): number {
  return term === 3 ? threeYearPrice(oneYear) : oneYear;
}

/** How much cheaper the 3-year price is than three separate 1-year premiums. */
export function threeYearSavings(oneYear: number): number {
  return oneYear * 3 - threeYearPrice(oneYear);
}

/** Sum of one rider's per-year price across the chosen term. */
export function riderPrice(riderId: string, term: Term): number {
  return getRider(riderId).perYear * term;
}

/** Sum of every selected rider's price across the chosen term. */
export function ridersTotal(riderIds: string[], term: Term): number {
  return riderIds.reduce((sum, id) => sum + riderPrice(id, term), 0);
}

export interface CheckoutInput {
  oneYear: number;
  term: Term;
  riderIds: string[];
}

/** The single total the button shows, the success screen reports and the receipt records. */
export function checkoutTotal({ oneYear, term, riderIds }: CheckoutInput): number {
  return termPrice(oneYear, term) + ridersTotal(riderIds, term);
}

/** First year a fresh Renewal Check can run again after a term purchase. */
export function nextCheckYear(renewalYear: number, term: Term): number {
  return renewalYear + term;
}
