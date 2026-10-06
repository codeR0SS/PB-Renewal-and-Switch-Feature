import { evidenceCopy, evidenceFreshness, EVIDENCE_DATE, EVIDENCE_DATE_STALE, monthsBetween } from './evidence';

describe('monthsBetween', () => {
  it('counts whole months', () => {
    expect(monthsBetween(new Date(2026, 6, 1), new Date(2026, 9, 2))).toBe(3);
    expect(monthsBetween(new Date(2026, 6, 15), new Date(2026, 9, 2))).toBe(2);
  });
  it('never goes negative', () => {
    expect(monthsBetween(new Date(2026, 6, 1), new Date(2026, 5, 1))).toBe(0);
  });
});

describe('evidenceFreshness', () => {
  it('is fresh at 3 months', () => {
    const f = evidenceFreshness(EVIDENCE_DATE, new Date(2026, 9, 2));
    expect(f.dateLine).toBe('Dated 1 Jul 2026 — 3 months ago.');
    expect(f.stale).toBe(false);
  });
  it('is not stale at exactly 6 months, stale just past it', () => {
    expect(evidenceFreshness(EVIDENCE_DATE, new Date(2027, 0, 1)).stale).toBe(false);
    expect(evidenceFreshness(EVIDENCE_DATE, new Date(2027, 0, 2)).stale).toBe(true);
  });
  it('flags the demo stale date', () => {
    const f = evidenceFreshness(EVIDENCE_DATE_STALE, new Date(2026, 9, 2));
    expect(f.dateLine).toBe('Dated 15 Jan 2026 — 8 months ago.');
    expect(f.stale).toBe(true);
  });
});

describe('evidenceCopy', () => {
  it('names the alternative only on switch', () => {
    expect(evidenceCopy('switch', 'HDFC Ergo Health Suraksha').compared).toContain('HDFC Ergo Health Suraksha');
    expect(evidenceCopy('stay', 'HDFC Ergo Health Suraksha').compared).not.toContain('HDFC');
    expect(evidenceCopy('stay', 'HDFC Ergo Health Suraksha').compared).toContain('market rates');
  });
});
