import type { Alternative, DiffRow } from '@/lib/alternatives';
import { YOUR_PLAN } from '@/lib/alternatives';
import type { Action } from '@/lib/carryover';
import { baseKey, planToBuy } from '@/lib/checkout';
import { formatRupees } from '@/lib/content';

/** How much more the Gold tier costs per year than the plan it upgrades. */
export const UPGRADE_DELTA = 3649;
export const GOLD_HOSPITALS = 9;
export const GOLD_BLURB =
  'Coverage ₹10 Lakh (2×) · No room-rent limit · OPD cover included · 9 hospitals nearby';

export interface UpgradeOffer {
  base: { name: string; oneYear: number };
  goldName: string;
  goldOneYear: number;
  baseKey: string;
}

/** A richer tier of the SAME plan being confirmed, never a different insurer (that would just be another switch). */
export function upgradeOffer(action: Action, alt: Alternative): UpgradeOffer {
  const { base } = planToBuy(action, alt, null);
  return {
    base,
    goldName: action === 'switch' ? `${alt.name} Gold` : 'Young Star Gold',
    goldOneYear: base.oneYear + UPGRADE_DELTA,
    baseKey: baseKey(action, alt),
  };
}

/**
 * Capped comparison rows, using the same "visible rows + N more" mechanism as What's Different.
 * A row appears only where the current plan's value is actually known: we never claim a difference
 * against a figure we don't have (no invented evidence).
 */
export function upgradeComparison(action: Action, alt: Alternative): { rows: DiffRow[]; more: DiffRow[] } {
  const offer = upgradeOffer(action, alt);
  const renewing = action === 'renew';
  const currentHospitals = renewing ? YOUR_PLAN.hospitals : alt.hospitals;

  const rows: DiffRow[] = [
    { label: 'Premium', yours: formatRupees(offer.base.oneYear), alt: formatRupees(offer.goldOneYear), altBetter: true },
    { label: 'Coverage', yours: YOUR_PLAN.cover, alt: '₹10 Lakh', altBetter: true },
  ];
  // Room rent and OPD are only known for the current plan, so only the renew path can compare them.
  if (renewing) rows.push({ label: 'Room rent', yours: '1% of sum insured', alt: 'No limit', altBetter: true });
  rows.push({ label: 'Hospitals nearby', yours: String(currentHospitals), alt: String(GOLD_HOSPITALS), altBetter: true });

  const more: DiffRow[] = renewing ? [{ label: 'OPD cover', yours: 'Not included', alt: 'Included', altBetter: true }] : [];
  return { rows, more };
}
