import { RelativeTimePipe } from './relative-time.pipe';

describe('RelativeTimePipe', () => {
  const pipe = new RelativeTimePipe();

  it('null yoki invalid bo‘lsa "-" qaytarsin', () => {
    expect(pipe.transform(null)).toBe('-');
    expect(pipe.transform('not-a-date')).toBe('-');
  });

  it('just now / seconds', () => {
    const now = new Date();
    expect(pipe.transform(now)).toBe('just now');

    const fiveSecAgo = new Date(Date.now() - 15 * 1000);
    const out = pipe.transform(fiveSecAgo);
    expect(out.endsWith('s ago')).toBeTrue();
  });

  it('minutes / hours', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    expect(pipe.transform(fiveMinAgo)).toBe('5m ago');

    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
    expect(pipe.transform(threeHoursAgo)).toBe('3h ago');
  });

  it('days / months / years', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    expect(pipe.transform(twoDaysAgo)).toBe('2d ago');

    const twoMonthsAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    expect(pipe.transform(twoMonthsAgo)).toBe('2mo ago');

    const threeYearsAgo = new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000);
    expect(pipe.transform(threeYearsAgo)).toBe('3y ago');
  });
});
