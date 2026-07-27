import {
  clamp,
  endOfMonth,
  endOfWeek,
  getToday,
  getViewOfMonth,
  getWeekNumber,
  startOfWeek,
  toDate,
} from './date';
import { PlainDate, PlainYearMonth } from './temporal';

describe('getToday', () => {
  it('reads the local date', () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 6, 26, 23, 30));
    expect(getToday().toString()).toBe('2026-07-26');
    jest.useRealTimers();
  });
});

describe('startOfWeek / endOfWeek', () => {
  // 2026-07-26 is a Sunday
  it.each([
    [0, '2026-07-26', '2026-08-01'],
    [1, '2026-07-20', '2026-07-26'],
    [6, '2026-07-25', '2026-07-31'],
  ])('firstDayOfWeek %i', (firstDayOfWeek, start, end) => {
    const date = PlainDate.from('2026-07-26');

    expect(startOfWeek(date, firstDayOfWeek as 0 | 1 | 6).toString()).toBe(start);
    expect(endOfWeek(date, firstDayOfWeek as 0 | 1 | 6).toString()).toBe(end);
  });

  it('defaults to Sunday', () => {
    expect(startOfWeek(PlainDate.from('2026-07-29')).toString()).toBe('2026-07-26');
  });
});

describe('endOfMonth', () => {
  it.each([
    [{ year: 2026, month: 2 }, '2026-02-28'],
    [{ year: 2024, month: 2 }, '2024-02-29'],
    [{ year: 2026, month: 4 }, '2026-04-30'],
    [{ year: 2026, month: 12 }, '2026-12-31'],
  ])('%o', (input, expected) => {
    expect(endOfMonth(input).toString()).toBe(expected);
  });
});

describe('clamp', () => {
  const min = PlainDate.from('2026-07-10');
  const max = PlainDate.from('2026-07-20');

  it('returns the bounds when out of range', () => {
    expect(clamp(PlainDate.from('2026-07-01'), min, max)).toBe(min);
    expect(clamp(PlainDate.from('2026-07-31'), min, max)).toBe(max);
  });

  it('returns the same instance when in range', () => {
    const date = PlainDate.from('2026-07-15');

    expect(clamp(date, min, max)).toBe(date);
    expect(clamp(date)).toBe(date);
  });
});

describe('getWeekNumber', () => {
  it.each([
    ['2026-01-01', 1],
    ['2026-07-26', 30],
    ['2026-12-31', 53],
    ['2027-01-01', 53],
    ['2024-12-30', 1],
  ])('%s -> week %i', (date, week) => {
    expect(getWeekNumber(PlainDate.from(date))).toBe(week);
  });
});

describe('getViewOfMonth', () => {
  it('covers the whole month in whole weeks', () => {
    const weeks = getViewOfMonth(new PlainYearMonth(2026, 7), 1);

    expect(weeks).toHaveLength(5);
    expect(weeks.every((week) => week.length === 7)).toBe(true);
    expect(weeks[0]?.[0]?.toString()).toBe('2026-06-29');
    expect(weeks.at(-1)?.at(-1)?.toString()).toBe('2026-08-02');
  });

  it('shifts with firstDayOfWeek', () => {
    const weeks = getViewOfMonth(new PlainYearMonth(2026, 7), 0);

    expect(weeks[0]?.[0]?.toString()).toBe('2026-06-28');
  });

  it('handles months that start on the first day of the week', () => {
    const weeks = getViewOfMonth(new PlainYearMonth(2026, 6), 1);

    expect(weeks[0]?.[0]?.toString()).toBe('2026-06-01');
  });
});

describe('toDate', () => {
  it('builds a UTC date, defaulting the day', () => {
    expect(toDate({ year: 2026, month: 7, day: 26 }).toISOString()).toBe(
      '2026-07-26T00:00:00.000Z',
    );
    expect(toDate({ year: 2026, month: 7 }).toISOString()).toBe('2026-07-01T00:00:00.000Z');
  });
});
