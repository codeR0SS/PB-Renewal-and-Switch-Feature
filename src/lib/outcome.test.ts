import { FIRST_RENEWAL_COPY, isChecked, noticeCopy, resolveOutcome, tooLateCopy } from './outcome';

const r = resolveOutcome;

describe('resolveOutcome', () => {
  it('normal data: Stay and Switch follow the verdict when there is time to act', () => {
    expect(r({ homeTiming: 'later', verdict: 'stay', dataState: 'normal' })).toBe('stay');
    expect(r({ homeTiming: 'later', verdict: 'switch', dataState: 'normal' })).toBe('switch');
  });

  it('expiring today: a Switch verdict degrades to too-late, never recommends the impossible', () => {
    expect(r({ homeTiming: 'today', verdict: 'switch', dataState: 'normal' })).toBe('too-late');
  });

  it('expiring today: a Stay verdict is unaffected (staying is always possible)', () => {
    expect(r({ homeTiming: 'today', verdict: 'stay', dataState: 'normal' })).toBe('stay');
  });

  it('first renewal is a real, checked verdict and is unaffected by timing or verdict', () => {
    for (const homeTiming of ['today', 'later'] as const)
      for (const verdict of ['stay', 'switch'] as const)
        expect(r({ homeTiming, verdict, dataState: 'first' })).toBe('first');
  });

  it('data unavailable: shown when there is time, but too-late wins when switching is already impossible', () => {
    expect(r({ homeTiming: 'later', verdict: 'stay', dataState: 'unavailable' })).toBe('unavailable');
    expect(r({ homeTiming: 'today', verdict: 'stay', dataState: 'unavailable' })).toBe('too-late');
    expect(r({ homeTiming: 'today', verdict: 'switch', dataState: 'unavailable' })).toBe('too-late');
  });
});

describe('isChecked', () => {
  it('only outcomes where something was verified carry the Checked tag', () => {
    expect(['stay', 'switch', 'first'].every((o) => isChecked(o as never))).toBe(true);
    expect(isChecked('unavailable')).toBe(false);
    expect(isChecked('too-late')).toBe(false);
  });
});

describe('copy', () => {
  it('too-late names no insurer at all', () => {
    const { headline, bullets } = tooLateCopy();
    expect(headline + bullets.join(' ')).not.toMatch(/HDFC|Care|Bajaj|Niva|Ergo/);
    expect(bullets.join(' ')).toContain('45-60 days');
  });
  it('unavailable names the unverified insurer plainly', () => {
    expect(noticeCopy('unavailable').headline).toBe('We can verify Star Health, not HDFC Ergo Health Suraksha yet.');
  });
  it('first renewal never claims a year-on-year comparison', () => {
    expect(FIRST_RENEWAL_COPY.detail).toContain('no prior year to compare');
    expect(FIRST_RENEWAL_COPY.detail).not.toMatch(/%/);
  });
});
