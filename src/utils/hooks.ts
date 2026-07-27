import { useCallback, useMemo, useRef, useState } from 'react';
import type { DaysOfWeek } from './date';
import { PlainDate, type PlainYearMonth } from './temporal';

function safeFrom<T extends PlainDate | PlainYearMonth>(
  Ctr: { from(value: string): T },
  value: string | undefined,
): T | undefined {
  if (value) {
    try {
      return Ctr.from(value);
    } catch {
      return undefined;
    }
  }

  return undefined;
}

export interface ControllableStateOptions<T> {
  value: T | undefined;
  defaultValue: T | undefined;
  fallback: T;
  onChange?: ((value: T) => void) | undefined;
}

/**
 * Controlled/uncontrolled state. When `value` is provided the component never
 * writes to internal state — it only reports changes through `onChange`.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  fallback,
  onChange,
}: ControllableStateOptions<T>): readonly [T, (next: T) => void] {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<T>(defaultValue ?? fallback);
  const onChangeRef = useRef(onChange);

  onChangeRef.current = onChange;
  const resolved = isControlled ? value : internal;
  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) {
        setInternal(next);
      }

      onChangeRef.current?.(next);
    },
    [isControlled],
  );

  return [resolved, setValue] as const;
}

/** A single ISO date string (`YYYY-MM-DD`) as a `PlainDate`. */
export function useDateValue(
  options: ControllableStateOptions<string>,
): readonly [PlainDate | undefined, (date: PlainDate | undefined) => void] {
  const [value, setValue] = useControllableState(options);
  const date = useMemo(() => safeFrom(PlainDate, value), [value]);
  const setDate = useCallback(
    (next: PlainDate | undefined) => setValue(next ? next.toString() : ''),
    [setValue],
  );

  return [date, setDate] as const;
}

export type DateRange = [string, string] | [];
export type PlainDateRange = [PlainDate, PlainDate] | [];

/** A `[start, end]` pair of ISO date strings as `PlainDate`s. */
export function useDateRangeValue(
  options: ControllableStateOptions<DateRange>,
): readonly [PlainDateRange, (range: PlainDateRange) => void] {
  const [value, setValue] = useControllableState(options);
  const range = useMemo((): PlainDateRange => {
    const start = safeFrom(PlainDate, value[0]);
    const end = safeFrom(PlainDate, value[1]);

    return start && end ? [start, end] : [];
  }, [value]);
  const setRange = useCallback(
    (next: PlainDateRange) => {
      setValue(next.length === 2 ? [next[0].toString(), next[1].toString()] : []);
    },
    [setValue],
  );

  return [range, setRange] as const;
}

/** A list of ISO date strings as `PlainDate`s, skipping invalid entries. */
export function useDateMultiValue(
  options: ControllableStateOptions<string[]>,
): readonly [PlainDate[], (dates: PlainDate[]) => void] {
  const [value, setValue] = useControllableState(options);
  const multi = useMemo(() => {
    const result: PlainDate[] = [];

    for (const date of value) {
      const parsed = safeFrom(PlainDate, date);

      if (parsed) {
        result.push(parsed);
      }
    }

    return result;
  }, [value]);
  const setMulti = useCallback(
    (dates: PlainDate[]) => setValue(dates.map((date) => date.toString())),
    [setValue],
  );

  return [multi, setMulti] as const;
}

type DateFormatOptions = Pick<Intl.DateTimeFormatOptions, 'year' | 'month' | 'day' | 'weekday'>;

export function useDateFormatter(options: DateFormatOptions, locale?: string): Intl.DateTimeFormat {
  // depend on the individual options so a fresh object literal does not rebuild
  // the formatter on every render
  const { year, month, day, weekday } = options;

  return useMemo(
    () => new Intl.DateTimeFormat(locale, { timeZone: 'UTC', year, month, day, weekday }),
    [locale, year, month, day, weekday],
  );
}

export type WeekdayOption = {
  weekday: NonNullable<Intl.DateTimeFormatOptions['weekday']>;
};

/** Localized weekday names, ordered from `firstDayOfWeek`. */
export function useDayNames(
  options: WeekdayOption,
  firstDayOfWeek: DaysOfWeek,
  locale?: string,
): string[] {
  const formatter = useDateFormatter(options, locale);

  return useMemo(() => {
    const days: string[] = [];
    const day = new Date();

    for (let i = 0; i < 7; i++) {
      const index = (day.getUTCDay() - firstDayOfWeek + 7) % 7;

      days[index] = formatter.format(day);
      day.setUTCDate(day.getUTCDate() + 1);
    }

    return days;
  }, [firstDayOfWeek, formatter]);
}

/** Parses an ISO date prop, ignoring invalid values (mirrors Cally). */
export function useParsedDate(value: string | undefined): PlainDate | undefined {
  return useMemo(() => safeFrom(PlainDate, value), [value]);
}
