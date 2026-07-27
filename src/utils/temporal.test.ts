import { PlainDate, PlainYearMonth } from './temporal';

describe('PlainDate', () => {
  it('parses ISO strings', () => {
    const date = PlainDate.from('2026-07-26');

    expect([date.year, date.month, date.day]).toEqual([2026, 7, 26]);
  });

  it('throws on malformed strings', () => {
    expect(() => PlainDate.from('26-07-2026')).toThrow(TypeError);
    expect(() => PlainDate.from('2026-13-01')).toThrow(TypeError);
    expect(() => PlainDate.from('2026-02-32')).toThrow(TypeError);
  });

  it('parses Date objects as UTC', () => {
    expect(PlainDate.from(new Date(Date.UTC(2026, 0, 31))).toString()).toBe('2026-01-31');
  });

  it('pads its ISO output', () => {
    expect(new PlainDate(999, 1, 2).toString()).toBe('0999-01-02');
  });

  it('adds days across month and year boundaries', () => {
    expect(PlainDate.from('2026-01-31').add({ days: 1 }).toString()).toBe('2026-02-01');
    expect(PlainDate.from('2026-12-31').add({ days: 1 }).toString()).toBe('2027-01-01');
    expect(PlainDate.from('2026-01-01').add({ days: -1 }).toString()).toBe('2025-12-31');
  });

  it('constrains month arithmetic to the end of the target month', () => {
    expect(PlainDate.from('2026-03-31').add({ months: 1 }).toString()).toBe('2026-04-30');
    expect(PlainDate.from('2026-01-31').add({ months: 1 }).toString()).toBe('2026-02-28');
    expect(PlainDate.from('2026-03-31').add({ months: -1 }).toString()).toBe('2026-02-28');
  });

  it('constrains year arithmetic on leap days', () => {
    expect(PlainDate.from('2024-02-29').add({ years: 1 }).toString()).toBe('2025-02-28');
    expect(PlainDate.from('2024-02-29').add({ years: 4 }).toString()).toBe('2028-02-29');
  });

  it('compares and tests equality', () => {
    const a = PlainDate.from('2026-07-26');
    const b = PlainDate.from('2026-07-27');

    expect(PlainDate.compare(a, b)).toBe(-1);
    expect(PlainDate.compare(b, a)).toBe(1);
    expect(PlainDate.compare(a, PlainDate.from('2026-07-26'))).toBe(0);
    expect(a.equals(PlainDate.from('2026-07-26'))).toBe(true);
    expect(a.equals(b)).toBe(false);
    expect(PlainDate.compare(PlainDate.from('2025-08-01'), a)).toBe(-1);
    expect(PlainDate.compare(PlainDate.from('2026-08-01'), a)).toBe(1);
  });

  it('converts to a year-month', () => {
    expect(PlainDate.from('2026-07-26').toPlainYearMonth()).toEqual(new PlainYearMonth(2026, 7));
  });
});

describe('PlainYearMonth', () => {
  it('adds months and years', () => {
    expect(new PlainYearMonth(2026, 12).add({ months: 1 }).toString()).toBe('2027-01');
    expect(new PlainYearMonth(2026, 1).add({ months: -1 }).toString()).toBe('2025-12');
    expect(new PlainYearMonth(2026, 5).add({ years: 2 }).toString()).toBe('2028-05');
    expect(new PlainYearMonth(2026, 5).add({ years: 1, months: 2 }).toString()).toBe('2027-07');
  });

  it('compares and tests equality', () => {
    expect(PlainYearMonth.compare({ year: 2026, month: 1 }, { year: 2026, month: 2 })).toBe(-1);
    expect(PlainYearMonth.compare({ year: 2027, month: 1 }, { year: 2026, month: 2 })).toBe(1);
    expect(PlainYearMonth.compare({ year: 2026, month: 2 }, { year: 2026, month: 2 })).toBe(0);
    expect(PlainYearMonth.compare({ year: 2025, month: 2 }, { year: 2026, month: 2 })).toBe(-1);
    expect(PlainYearMonth.compare({ year: 2026, month: 3 }, { year: 2026, month: 2 })).toBe(1);
    expect(new PlainYearMonth(2026, 7).equals(PlainDate.from('2026-07-26'))).toBe(true);
  });

  it('converts to its first day', () => {
    expect(new PlainYearMonth(2026, 7).toPlainDate().toString()).toBe('2026-07-01');
  });
});
