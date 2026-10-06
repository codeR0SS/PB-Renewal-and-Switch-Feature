// The four verified marketplace alternatives, from the prototype's marketplace sheet.
// `extras` holds differences beyond the 3 core rows (coverage, claim settlement, hospital network).
// They exist only where the prototype has real figures (HDFC); we never copy them onto another
// insurer (no invented evidence) — What's Different falls back to the 3 core rows for the rest.

export interface DiffRow {
  label: string;
  yours: string;
  yoursSub?: string;
  alt: string;
  altSub?: string;
  /** Alternative is better on this row, so its value is emphasised. */
  altBetter?: boolean;
}

export interface Alternative {
  id: string;
  name: string;
  premiumNum: number;
  claim: string;
  hospitals: number;
  /** How many of the user's 3 current nearby hospitals are in this insurer's network. Known only where checked. */
  overlapCovered?: number;
  /** Differences beyond the 3 core rows. Only known for insurers that have been checked (HDFC). */
  extras?: DiffRow[];
}

export const YOUR_PLAN = { claim: '94.2%', hospitals: 3, cover: '₹5 Lakh' } as const;

export const ALTERNATIVES: Alternative[] = [
  {
    id: 'hdfc',
    name: 'HDFC Ergo Health Suraksha',
    premiumNum: 5340,
    claim: '97.8%',
    hospitals: 3,
    overlapCovered: 2,
    extras: [
      { label: 'Free checkups', yours: '1×/year', yoursSub: 'up to ₹2,000', alt: '2×/year', altSub: 'up to ₹3,000', altBetter: true },
      { label: 'Room rent limit', yours: '1% of sum insured', alt: 'No limit', altBetter: true },
      { label: 'Co-payment', yours: '10% on claims', alt: 'None', altBetter: true },
      { label: 'Restore benefit', yours: 'Not included', alt: 'Included', altBetter: true },
      { label: 'Ambulance cover', yours: '₹1,500', alt: '₹3,000', altBetter: true },
    ],
  },
  { id: 'care', name: 'Care Health Advantage', premiumNum: 5620, claim: '96.1%', hospitals: 3 },
  { id: 'bajaj', name: 'Bajaj Allianz Health Guard', premiumNum: 5890, claim: '93.4%', hospitals: 2 },
  { id: 'niva', name: 'Niva Bupa Reassure', premiumNum: 6040, claim: '98.1%', hospitals: 4 },
];

export const DEFAULT_ALT_ID = 'hdfc';

export function getAlt(id: string): Alternative {
  return ALTERNATIVES.find((a) => a.id === id) ?? ALTERNATIVES[0];
}
