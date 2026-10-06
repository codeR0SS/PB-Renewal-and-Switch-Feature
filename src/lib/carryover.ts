import { type Alternative, YOUR_PLAN } from '@/lib/alternatives';

export type Action = 'renew' | 'switch';
export type Tone = 'neutral' | 'amber' | 'muted';

export interface CarryRow {
  key: 'ncb' | 'waiting' | 'hospital';
  title: string;
  detail: string;
  badge: string;
  tone: Tone;
}

export interface CarryoverContent {
  subhead: string;
  rows: CarryRow[];
}

/**
 * Verdict-aware "what carries over" content (CLAUDE_CODE_KICKOFF.md section 7).
 * - No-claim bonus: carries over on both paths (or "not applicable" in a first policy year).
 * - Waiting period: always "Carries over". On a switch this is an IRDAI-mandated credit.
 * - Hospital network: the one genuinely insurer-specific friction. Only claim a precise overlap where
 *   it has been checked; otherwise say plainly that it has not been confirmed.
 */
export function carryoverContent(action: Action, alt: Alternative, hasBonus: boolean): CarryoverContent {
  const ncb: CarryRow = hasBonus
    ? {
        key: 'ncb',
        title: 'No Claim Bonus',
        detail: 'Fully carried over — ₹4 Lakh added to your cover.',
        badge: 'Carries over',
        tone: 'neutral',
      }
    : {
        key: 'ncb',
        title: 'No Claim Bonus',
        detail: "This is your first policy year, so there's no bonus built up yet to carry.",
        badge: 'Not applicable',
        tone: 'muted',
      };

  if (action === 'renew') {
    return {
      subhead: "If you renew, here's what stays the same.",
      rows: [
        ncb,
        {
          key: 'waiting',
          title: 'Waiting period',
          detail: 'Already served — no new waiting period.',
          badge: 'Carries over',
          tone: 'neutral',
        },
        {
          key: 'hospital',
          title: 'Hospital network',
          detail: `Same ${YOUR_PLAN.hospitals} hospitals near you stay cashless.`,
          badge: 'Same',
          tone: 'neutral',
        },
      ],
    };
  }

  const hospital: CarryRow =
    alt.overlapCovered !== undefined
      ? {
          key: 'hospital',
          title: 'Hospital network',
          detail: `${alt.overlapCovered} of your ${YOUR_PLAN.hospitals} nearby hospitals stay cashless; ${
            YOUR_PLAN.hospitals - alt.overlapCovered
          } is not in this insurer's network.`,
          badge: 'Partial overlap',
          tone: 'amber',
        }
      : {
          key: 'hospital',
          title: 'Hospital network',
          detail: `${alt.hospitals} hospitals near you are in this insurer's network, against ${YOUR_PLAN.hospitals} today. We haven't confirmed which of your current ones carry across.`,
          badge: 'Not confirmed',
          tone: 'amber',
        };

  return {
    subhead: "If you switch, here's what changes.",
    rows: [
      ncb,
      {
        key: 'waiting',
        title: 'Waiting period',
        detail:
          "Credited in full — IRDAI requires the new insurer to honour waiting periods you've already served, with no break in cover.",
        badge: 'Carries over',
        tone: 'neutral',
      },
      hospital,
    ],
  };
}
