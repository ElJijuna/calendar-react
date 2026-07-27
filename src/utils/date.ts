import { PlainDate, type PlainYearMonth } from './temporal';

export type DaysOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const DAY_MS = 86_400_000;

export function getToday(): PlainDate {
  const d = new Date();

  return new PlainDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

/** ISO-8601 week number for the week containing `plainDate`. */
export function getWeekNumber(plainDate: PlainDate): number {
  const date = toDate(plainDate);

  // Thursday in current week decides the year.
  date.setUTCDate(date.getUTCDate() + 3 - ((date.getUTCDay() + 6) % 7));
  // January 4 is always in week 1.
  const week1 = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));

  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / DAY_MS - 3 + ((week1.getUTCDay() + 6) % 7)) / 7,
    )
  );
}

export function startOfWeek(date: PlainDate, firstDayOfWeek: DaysOfWeek = 0): PlainDate {
  const d = toDate(date);
  const day = d.getUTCDay();
  const diff = (day < firstDayOfWeek ? 7 : 0) + day - firstDayOfWeek;

  d.setUTCDate(d.getUTCDate() - diff);

  return PlainDate.from(d);
}

export function endOfWeek(date: PlainDate, firstDayOfWeek: DaysOfWeek = 0): PlainDate {
  return startOfWeek(date, firstDayOfWeek).add({ days: 6 });
}

export function endOfMonth(date: { year: number; month: number }): PlainDate {
  return PlainDate.from(new Date(Date.UTC(date.year, date.month, 0)));
}

/** Ensures date is within range, returns min or max if out of bounds. */
export function clamp(date: PlainDate, min?: PlainDate, max?: PlainDate): PlainDate {
  if (min && PlainDate.compare(date, min) < 0) {
    return min;
  }

  if (max && PlainDate.compare(date, max) > 0) {
    return max;
  }

  return date;
}

const oneDay = { days: 1 };

export type Week = [PlainDate, PlainDate, PlainDate, PlainDate, PlainDate, PlainDate, PlainDate];

/** Given a year-month, returns the weeks shown on a calendar grid. */
export function getViewOfMonth(yearMonth: PlainYearMonth, firstDayOfWeek: DaysOfWeek = 0): Week[] {
  let start = startOfWeek(yearMonth.toPlainDate(), firstDayOfWeek);

  const end = endOfWeek(endOfMonth(yearMonth), firstDayOfWeek);
  const weeks: Week[] = [];

  while (PlainDate.compare(start, end) < 0) {
    const week: PlainDate[] = [];

    for (let i = 0; i < 7; i++) {
      week.push(start);
      start = start.add(oneDay);
    }

    weeks.push(week as Week);
  }

  return weeks;
}

interface DateLike {
  year: number;
  month: number;
  day?: number;
}

/** Converts a plain year/month/day into a UTC `Date`. */
export function toDate(date: DateLike): Date {
  return new Date(Date.UTC(date.year, date.month - 1, date.day ?? 1));
}
