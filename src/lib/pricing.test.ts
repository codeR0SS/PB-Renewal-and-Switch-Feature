import {
  checkoutTotal,
  nextCheckYear,
  riderPrice,
  ridersTotal,
  termPrice,
  threeYearPrice,
  threeYearSavings,
} from './pricing';

describe('threeYearPrice', () => {
  it('is round(1yr x 3 x 0.94) for the renew-as-is plan', () => {
    // 6181 x 3 = 18543; x 0.94 = 17430.42 -> 17430 (the prototype hardcoded 17,470)
    expect(threeYearPrice(6181)).toBe(17430);
  });
  it('is round(1yr x 3 x 0.94) for the default switch plan', () => {
    // 5340 x 3 = 16020; x 0.94 = 15058.8 -> 15059 (the prototype hardcoded 15,110)
    expect(threeYearPrice(5340)).toBe(15059);
  });
  it('rounds half up and handles zero', () => {
    expect(threeYearPrice(0)).toBe(0);
    expect(threeYearPrice(100)).toBe(282); // 282.0 exactly
    expect(threeYearPrice(50)).toBe(141); // 141.0 exactly
  });
});

describe('threeYearSavings', () => {
  it('reconciles exactly with 3x the 1-year price minus the 3-year price', () => {
    for (const p of [6181, 5340, 5620, 5890, 6040, 184629]) {
      expect(threeYearSavings(p)).toBe(p * 3 - threeYearPrice(p));
      expect(threeYearSavings(p) + threeYearPrice(p)).toBe(p * 3);
    }
    expect(threeYearSavings(6181)).toBe(1113);
    expect(threeYearSavings(5340)).toBe(961);
  });
});

describe('termPrice', () => {
  it('returns the 1-year premium for a 1-year term, derived price for 3', () => {
    expect(termPrice(6181, 1)).toBe(6181);
    expect(termPrice(6181, 3)).toBe(17430);
  });
  it('always moves with the plan, so a different pick can never show a stale price', () => {
    expect(termPrice(5890, 3)).toBe(threeYearPrice(5890));
    expect(termPrice(5890, 3)).not.toBe(termPrice(6181, 3));
  });
});

describe('checkoutTotal', () => {
  it('equals the term price when there are no riders', () => {
    expect(checkoutTotal({ oneYear: 6181, term: 1, riderIds: [] })).toBe(6181);
    expect(checkoutTotal({ oneYear: 6181, term: 3, riderIds: [] })).toBe(17430);
  });
  it('adds each rider for every year of the term', () => {
    expect(riderPrice('ci', 1)).toBe(1150);
    expect(riderPrice('ci', 3)).toBe(3450);
    expect(ridersTotal(['ci', 'hdc'], 1)).toBe(1150 + 420);
    expect(checkoutTotal({ oneYear: 5340, term: 1, riderIds: ['ci'] })).toBe(5340 + 1150);
    expect(checkoutTotal({ oneYear: 5340, term: 3, riderIds: ['ci', 'hdc'] })).toBe(15059 + (1150 + 420) * 3);
  });
});

describe('nextCheckYear', () => {
  it('is the renewal year plus the term', () => {
    expect(nextCheckYear(2026, 3)).toBe(2029);
    expect(nextCheckYear(2026, 1)).toBe(2027);
  });
});
