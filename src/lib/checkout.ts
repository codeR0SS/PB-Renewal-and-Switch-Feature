import type { Alternative } from '@/lib/alternatives';
import type { Action } from '@/lib/carryover';
import { POLICY } from '@/lib/content';

/** A richer tier of the SAME plan, confirmed on the upgrade screen. Valid only for the base it was chosen for. */
export interface ConfirmedUpgrade {
  name: string;
  oneYear: number;
  /** Identifies the base plan this upgrade was picked for (see baseKey). */
  baseKey: string;
}

/** Stable identity of the base plan being bought. Renewing is always the current plan; switching depends on the pick. */
export const baseKey = (action: Action, alt: Alternative): string =>
  action === 'switch' ? `switch:${alt.id}` : 'renew:current';

export interface PlanToBuy {
  name: string;
  oneYear: number;
  upgraded: boolean;
  /** The plan before any upgrade. */
  base: { name: string; oneYear: number };
}

/**
 * What the user is actually buying, and its 1-year premium. The one place the plan price comes from.
 * An upgrade is applied only if it was chosen for THIS base plan, so a stale upgrade (picked before the
 * user changed insurer or path) can never leak into the name or price.
 */
export function planToBuy(action: Action, alt: Alternative, upgrade?: ConfirmedUpgrade | null): PlanToBuy {
  const base =
    action === 'switch'
      ? { name: alt.name, oneYear: alt.premiumNum }
      : { name: POLICY.planName, oneYear: POLICY.premium };
  if (upgrade && upgrade.baseKey === baseKey(action, alt)) {
    return { name: upgrade.name, oneYear: upgrade.oneYear, upgraded: true, base };
  }
  return { ...base, upgraded: false, base };
}

/** Renewal year of the current policy, for "no fresh check until ..." copy. */
export const RENEWAL_YEAR = 2026;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const formatDate = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;

/** Declaration reference, reserved at preview and only issued once payment completes. */
export const DECLARATION_REF = 'RC-48291';
export const DECLARATION_ISSUER = 'PolicyBazaar Insurance Web Aggregator Pvt. Ltd.';
