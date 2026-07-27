import { clamp, endOfMonth, toDate } from './date';

type Duration = { months: number } | { years: number } | { days: number };
type CompareResult = -1 | 0 | 1;

const ISO_DATE = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[0-1])$/;
const padZero = (value: number, length: number) => value.toString().padStart(length, '0');

/**
 * Minimal stand-in for `Temporal.PlainDate`, limited to the arithmetic the
 * calendars need. Arithmetic is applied one unit at a time and is constrained,
 * e.g. adding one month to the 31st of March yields the 30th of April.
 */
export class PlainDate {
  constructor(
    public readonly year: number,
    public readonly month: number,
    public readonly day: number,
  ) {}

  add(duration: Duration): PlainDate {
    const date = toDate(this);

    if ('days' in duration) {
      date.setUTCDate(this.day + duration.days);

      return PlainDate.from(date);
    }

    let { year, month } = this;

    if ('months' in duration) {
      month = this.month + duration.months;
      date.setUTCMonth(month - 1);
    } else {
      year = this.year + duration.years;
      date.setUTCFullYear(year);
    }

    const min = PlainDate.from(toDate({ year, month, day: 1 }));

    return clamp(PlainDate.from(date), min, endOfMonth(min));
  }

  toString(): string {
    return `${padZero(this.year, 4)}-${padZero(this.month, 2)}-${padZero(this.day, 2)}`;
  }

  toPlainYearMonth(): PlainYearMonth {
    return new PlainYearMonth(this.year, this.month);
  }

  equals(date: PlainDate): boolean {
    return PlainDate.compare(this, date) === 0;
  }

  static compare(a: PlainDate, b: PlainDate): CompareResult {
    if (a.year < b.year) {
      return -1;
    }

    if (a.year > b.year) {
      return 1;
    }

    if (a.month < b.month) {
      return -1;
    }

    if (a.month > b.month) {
      return 1;
    }

    if (a.day < b.day) {
      return -1;
    }

    if (a.day > b.day) {
      return 1;
    }

    return 0;
  }

  /** Parses an ISO-8601 date string (`YYYY-MM-DD`) or a `Date` (read as UTC). */
  static from(value: string | Date): PlainDate {
    if (typeof value === 'string') {
      const match = value.match(ISO_DATE);

      if (!match) {
        throw new TypeError(value);
      }

      const [, year, month, day] = match;

      return new PlainDate(
        Number.parseInt(year as string, 10),
        Number.parseInt(month as string, 10),
        Number.parseInt(day as string, 10),
      );
    }

    return new PlainDate(value.getUTCFullYear(), value.getUTCMonth() + 1, value.getUTCDate());
  }
}

type YearMonthDuration = { months?: number; years?: number };

/** Minimal stand-in for `Temporal.PlainYearMonth`. */
export class PlainYearMonth {
  constructor(
    public readonly year: number,
    public readonly month: number,
  ) {}

  add(duration: YearMonthDuration): PlainYearMonth {
    const date = toDate(this);
    const months = (duration.months ?? 0) + (duration.years ?? 0) * 12;

    date.setUTCMonth(date.getUTCMonth() + months);

    return new PlainYearMonth(date.getUTCFullYear(), date.getUTCMonth() + 1);
  }

  equals(date: PlainDate | PlainYearMonth): boolean {
    return this.year === date.year && this.month === date.month;
  }

  toPlainDate(): PlainDate {
    return new PlainDate(this.year, this.month, 1);
  }

  toString(): string {
    return `${padZero(this.year, 4)}-${padZero(this.month, 2)}`;
  }

  static compare(
    a: PlainYearMonth | { year: number; month: number },
    b: PlainYearMonth | { year: number; month: number },
  ): CompareResult {
    if (a.year < b.year) {
      return -1;
    }

    if (a.year > b.year) {
      return 1;
    }

    if (a.month < b.month) {
      return -1;
    }

    if (a.month > b.month) {
      return 1;
    }

    return 0;
  }
}
