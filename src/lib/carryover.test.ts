import { getAlt } from './alternatives';
import { carryoverContent } from './carryover';

const hdfc = getAlt('hdfc');
const care = getAlt('care');

describe('carryoverContent', () => {
  it('renew: everything stays the same', () => {
    const c = carryoverContent('renew', hdfc, true);
    expect(c.subhead).toBe("If you renew, here's what stays the same.");
    expect(c.rows.map((r) => r.badge)).toEqual(['Carries over', 'Carries over', 'Same']);
  });

  it('switch: waiting period carries over in full (IRDAI), never "partially resets"', () => {
    const c = carryoverContent('switch', hdfc, true);
    const wait = c.rows.find((r) => r.key === 'waiting')!;
    expect(wait.badge).toBe('Carries over');
    expect(wait.detail).toContain('IRDAI');
    expect(JSON.stringify(c)).not.toMatch(/reset/i);
  });

  it('switch: hospital network is the one real friction, precise only where it was checked', () => {
    const h = carryoverContent('switch', hdfc, true).rows.find((r) => r.key === 'hospital')!;
    expect(h.badge).toBe('Partial overlap');
    expect(h.detail).toBe("2 of your 3 nearby hospitals stay cashless; 1 is not in this insurer's network.");

    const other = carryoverContent('switch', care, true).rows.find((r) => r.key === 'hospital')!;
    expect(other.badge).toBe('Not confirmed');
    expect(other.detail).toContain("haven't confirmed");
  });

  it('no-claim bonus carries over on both paths, or is not applicable with none built up', () => {
    for (const action of ['renew', 'switch'] as const) {
      expect(carryoverContent(action, hdfc, true).rows[0].badge).toBe('Carries over');
      expect(carryoverContent(action, hdfc, false).rows[0].badge).toBe('Not applicable');
    }
  });
});
