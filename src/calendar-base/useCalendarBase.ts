import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CalendarFocusOptions, PageChangeDetail, Pagination } from '../types';
import { clamp, endOfMonth, getToday, toDate } from '../utils/date';
import { useControllableState, useParsedDate } from '../utils/hooks';
import { type PlainDate, PlainYearMonth } from '../utils/temporal';
import type { CalendarPage } from './context';

function diffInMonths(a: PlainYearMonth, b: PlainYearMonth): number {
  return (b.year - a.year) * 12 + b.month - a.month;
}

function createPage(start: PlainYearMonth, months: number, pageBy: Pagination): CalendarPage {
  let anchor = start;

  if (months === 12 && pageBy !== 'single') {
    anchor = new PlainYearMonth(start.year, 1);
  }

  return {
    start: anchor,
    end: anchor.add({ months: months - 1 }),
  };
}

interface UsePaginationOptions {
  pageBy: Pagination;
  focusedDate: PlainDate;
  months: number;
  min?: PlainDate | undefined;
  max?: PlainDate | undefined;
  goto: (date: PlainDate) => void;
  onPageChange?: ((detail: PageChangeDetail) => void) | undefined;
}

function usePagination({
  pageBy,
  focusedDate,
  months,
  min,
  max,
  goto,
  onPageChange,
}: UsePaginationOptions) {
  const step = pageBy === 'single' ? 1 : months;
  const [page, setPage] = useState<CalendarPage>(() =>
    createPage(focusedDate.toPlainYearMonth(), months, pageBy),
  );
  const onPageChangeRef = useRef(onPageChange);

  onPageChangeRef.current = onPageChange;
  const gotoRef = useRef(goto);

  gotoRef.current = goto;
  const updatePageBy = useCallback(
    (by: number) => {
      setPage((current) => {
        const next = createPage(current.start.add({ months: by }), months, pageBy);

        onPageChangeRef.current?.({
          start: toDate(next.start),
          end: toDate(endOfMonth(next.end)),
        });

        return next;
      });
    },
    [months, pageBy],
  );
  const contains = useCallback(
    (date: PlainDate, from: PlainYearMonth = page.start) => {
      const diff = diffInMonths(from, date.toPlainYearMonth());

      return diff >= 0 && diff < months;
    },
    [months, page.start],
  );
  // The two effects below are deliberately one-directional: each reacts to its
  // own trigger and only *reads* the other side, so the reads go through refs.
  const containsRef = useRef(contains);

  containsRef.current = contains;
  const updatePageByRef = useRef(updatePageBy);

  updatePageByRef.current = updatePageBy;
  const focusedDateRef = useRef(focusedDate);

  focusedDateRef.current = focusedDate;
  const pageStartRef = useRef(page.start);

  pageStartRef.current = page.start;

  // page change -> pull the focused date into the visible page
  useEffect(() => {
    const currentFocusedDate = focusedDateRef.current;

    if (containsRef.current(currentFocusedDate)) {
      return;
    }

    const diff = diffInMonths(currentFocusedDate.toPlainYearMonth(), page.start);

    gotoRef.current(currentFocusedDate.add({ months: diff }));
  }, [page.start]);

  // focused date change -> move the page to it
  useEffect(() => {
    if (containsRef.current(focusedDate)) {
      return;
    }

    const diff = diffInMonths(pageStartRef.current, focusedDate.toPlainYearMonth());

    // if we only move one month either way, move by step
    if (diff === -1) {
      updatePageByRef.current(-step);
    } else if (diff === months) {
      updatePageByRef.current(step);
    } else {
      // anything else, move in steps of months
      updatePageByRef.current(Math.floor(diff / months) * months);
    }
  }, [focusedDate, step, months]);

  // keep the page shape in sync when `months` / `pageBy` change
  const shape = `${months}:${pageBy}`;
  const previousShape = useRef(shape);

  useEffect(() => {
    if (previousShape.current === shape) {
      return;
    }

    previousShape.current = shape;
    setPage((current) => createPage(current.start, months, pageBy));
  }, [shape, months, pageBy]);

  return {
    page,
    previous: !min || !contains(min) ? () => updatePageBy(-step) : undefined,
    next: !max || !contains(max) ? () => updatePageBy(step) : undefined,
  };
}

export interface UseCalendarBaseOptions {
  min?: string | undefined;
  max?: string | undefined;
  today?: string | undefined;
  months: number;
  pageBy: Pagination;
  locale?: string | undefined;
  focusedDate?: string | undefined;
  defaultFocusedDate?: string | undefined;
  onFocusDay?: ((date: Date) => void) | undefined;
  onPageChange?: ((detail: PageChangeDetail) => void) | undefined;
  /** Focused day fallback derived from the current value (Cally's `focusedDate = value`). */
  valueFallback?: PlainDate | undefined;
}

export function useCalendarBase({
  min: minProp,
  max: maxProp,
  today: todayProp,
  months,
  pageBy,
  focusedDate: focusedDateProp,
  defaultFocusedDate,
  onFocusDay,
  onPageChange,
  valueFallback,
}: UseCalendarBaseOptions) {
  const min = useParsedDate(minProp);
  const max = useParsedDate(maxProp);
  const today = useParsedDate(todayProp);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shouldFocusRef = useRef(false);
  const onFocusDayRef = useRef(onFocusDay);

  onFocusDayRef.current = onFocusDay;
  const [focusedDateValue, setFocusedDateValue] = useControllableState<string>({
    value: focusedDateProp,
    defaultValue: defaultFocusedDate,
    fallback: '',
    onChange: undefined,
  });
  const parsedFocusedDate = useParsedDate(focusedDateValue);
  const focusedDate = useMemo(
    () => clamp(parsedFocusedDate ?? valueFallback ?? today ?? getToday(), min, max),
    [parsedFocusedDate, valueFallback, today, min, max],
  );
  const setFocusedDate = useCallback(
    (date: PlainDate) => setFocusedDateValue(date.toString()),
    [setFocusedDateValue],
  );
  const goto = useCallback(
    (date: PlainDate) => {
      setFocusedDate(date);
      onFocusDayRef.current?.(toDate(date));
    },
    [setFocusedDate],
  );
  const { page, previous, next } = usePagination({
    pageBy,
    focusedDate,
    months,
    min,
    max,
    goto,
    onPageChange,
  });
  /** Returns whether an element was actually focused. */
  const focus = useCallback((options?: CalendarFocusOptions): boolean => {
    const container = containerRef.current;

    if (!container) {
      return false;
    }

    const target = options?.target ?? 'day';
    const selector =
      target === 'day'
        ? '[data-part~="day"][tabindex="0"]'
        : `[data-part~="${target}"][data-part~="button"]`;
    const element = container.querySelector<HTMLElement>(selector);

    element?.focus(options);

    return Boolean(element);
  }, []);
  /**
   * Cally re-focuses the active day after every `focusday`. In React that has
   * to be opt-in per interaction, otherwise the calendar would steal focus on
   * mount and on unrelated prop updates.
   */
  const focusDay = useCallback(
    (date: PlainDate) => {
      shouldFocusRef.current = true;
      goto(clamp(date, min, max));
    },
    [goto, min, max],
  );

  // The focused day may not be mounted yet when the page has to move first, so
  // the request is kept pending until a day actually takes focus. `focus` is
  // stable, so listing it costs nothing.
  // biome-ignore lint/correctness/useExhaustiveDependencies: focusedDate/page.start are triggers, read through the DOM rather than the closure
  useEffect(() => {
    if (!shouldFocusRef.current) {
      return;
    }

    if (focus()) {
      shouldFocusRef.current = false;
    }
  }, [focusedDate, page.start, focus]);

  return {
    page,
    focusedDate,
    focusDay,
    min,
    max,
    today,
    next,
    previous,
    focus,
    containerRef,
  };
}
