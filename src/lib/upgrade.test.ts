import { getAlt } from './alternatives';
import { baseKey, planToBuy } from './checkout';
import { threeYearPrice } from './pricing';
import { UPGRADE_DELTA, upgradeComparison, upgradeOffer } from './upgrade';

const hdfc = getAlt('hdfc');
const care = getAlt('care');

describe('upgradeOffer', () => {
  it('is a richer tier of the SAME plan, priced as base + the delta', () => {
    const renew = upgradeOffer('renew', hdfc);
    expect(renew.goldName).toBe('Young Star Gold');
    expect(renew.goldOneYear).toBe(6181 + UPGRADE_DELTA);
    expect(renew.goldOneYear).toBe(9830);

    const sw = upgradeOffer('switch', care);
    expect(sw.goldName).toBe('Care Health Advantage Gold');
    expect(sw.goldOneYear).toBe(5620 + UPGRADE_DELTA);
  });
});

describe('planToBuy with an upgrade', () => {
  const offer = upgradeOffer('renew', hdfc);
  const up = { name: offer.goldName, oneYear: offer.goldOneYear, baseKey: offer.baseKey };

  it('uses the upgrade for the base it was chosen for', () => {
    const p = planToBuy('renew', hdfc, up);
    expect(p.upgraded).toBe(true);
    expect(p.name).toBe('Young Star Gold');
    expect(p.oneYear).toBe(9830);
    expect(p.base.name).toBe('Young Star Silver Plan');
  });

  it('its 3-year price is derived from the upgrade price, never the old plan', () => {
    expect(threeYearPrice(planToBuy('renew', hdfc, up).oneYear)).toBe(threeYearPrice(9830));
  });

  it('a stale upgrade can never leak: picked for one plan, ignored once the base changes', () => {
    const forHdfc = upgradeOffer('switch', hdfc);
    const stale = { name: forHdfc.goldName, oneYear: forHdfc.goldOneYear, baseKey: forHdfc.baseKey };
    expect(planToBuy('switch', hdfc, stale).upgraded).toBe(true);
    // user then picks a different insurer, or changes path to renewing
    const afterPick = planToBuy('switch', care, stale);
    expect(afterPick.upgraded).toBe(false);
    expect(afterPick.name).toBe('Care Health Advantage');
    expect(afterPick.oneYear).toBe(5620);
    expect(planToBuy('renew', hdfc, stale).upgraded).toBe(false);
  });

  it('with no upgrade it is just the base plan', () => {
    expect(planToBuy('renew', hdfc, null)).toMatchObject({ name: 'Young Star Silver Plan', oneYear: 6181, upgraded: false });
    expect(baseKey('renew', hdfc)).toBe(baseKey('renew', care)); // renewing is always the current plan
  });
});

describe('upgradeComparison', () => {
  it('renew path compares room rent and OPD, which are known for the current plan', () => {
    const { rows, more } = upgradeComparison('renew', hdfc);
    expect(rows.map((r) => r.label)).toEqual(['Premium', 'Coverage', 'Room rent', 'Hospitals nearby']);
    expect(more.map((r) => r.label)).toEqual(['OPD cover']);
    expect(rows[3]).toMatchObject({ yours: '3', alt: '9' });
  });

  it('switch path never claims a difference against a figure it does not have', () => {
    const { rows, more } = upgradeComparison('switch', care);
    expect(rows.map((r) => r.label)).toEqual(['Premium', 'Coverage', 'Hospitals nearby']);
    expect(more).toEqual([]);
    expect(rows[0]).toMatchObject({ yours: '₹5,620', alt: '₹9,269' });
  });

  it('stays within the visible-row cap', () => {
    for (const action of ['renew', 'switch'] as const) {
      expect(upgradeComparison(action, hdfc).rows.length).toBeLessThanOrEqual(4);
    }
  });
});
