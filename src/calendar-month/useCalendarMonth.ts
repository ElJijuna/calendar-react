import type { KeyboardEvent, MouseEvent } from 'react';
import { useMemo } from 'react';
import type { CalendarContextValue } from '../calendar-base/context';
import { clamp, endOfWeek, getToday, getViewOfMonth, startOfWeek, toDate } from '../utils/date';
import { useDateFormatter, useDayNames } from '../utils/hooks';
import { joinParts } from '../utils/parts';
import type { PlainDate } from '../utils/temporal';

const inRange = (date: PlainDate, min?: PlainDate, max?: PlainDate) =>
  clamp(date, min, max) === date;

function isLTR(element: Element): boolean {
  try {
    return element.matches(':dir(ltr)');
  } catch {
    const dir = element.closest('[dir]')?.getAttribute('dir');

    return dir !== 'rtl';
  }
}

const dayOptions = { month: 'long', day: 'numeric' } as const;
const longDayOptions = { weekday: 'long' } as const;

export interface DayProps {
  'data-part': string;
  part: string;
  tabIndex: number;
  disabled: boolean;
  'aria-disabled': boolean | undefined;
  'aria-pressed': boolean | undefined;
  'aria-current': 'date' | undefined;
  'aria-label': string;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  onClick: () => void;
  onMouseOver: (event: MouseEvent<HTMLButtonElement>) => void;
}

interface UseCalendarMonthOptions {
  offset: number;
  context: CalendarContextValue;
}

export function useCalendarMonth({ offset, context }: UseCalendarMonthOptions) {
  const {
    firstDayOfWeek,
    isDateDisallowed,
    min,
    max,
    today,
    page,
    locale,
    focusedDate,
    formatWeekday,
  } = context;
  const todaysDate = today ?? getToday();
  const daysLong = useDayNames(longDayOptions, firstDayOfWeek, locale);
  const visibleDayOptions = useMemo(() => ({ weekday: formatWeekday }), [formatWeekday]);
  const daysVisible = useDayNames(visibleDayOptions, firstDayOfWeek, locale);
  const dayFormatter = useDateFormatter(dayOptions, locale);
  const yearMonth = useMemo(() => page.start.add({ months: offset }), [page, offset]);
  const weeks = useMemo(
    () => getViewOfMonth(yearMonth, firstDayOfWeek),
    [yearMonth, firstDayOfWeek],
  );

  function focusDay(date: PlainDate) {
    context.focusDay(clamp(date, min, max));
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    let date: PlainDate;

    const ltr = isLTR(e.currentTarget);

    switch (e.key) {
      case 'ArrowRight':
        date = focusedDate.add({ days: ltr ? 1 : -1 });
        break;
      case 'ArrowLeft':
        date = focusedDate.add({ days: ltr ? -1 : 1 });
        break;
      case 'ArrowDown':
        date = focusedDate.add({ days: 7 });
        break;
      case 'ArrowUp':
        date = focusedDate.add({ days: -7 });
        break;
      case 'PageUp':
        date = focusedDate.add(e.shiftKey ? { years: -1 } : { months: -1 });
        break;
      case 'PageDown':
        date = focusedDate.add(e.shiftKey ? { years: 1 } : { months: 1 });
        break;
      case 'Home':
        date = startOfWeek(focusedDate, firstDayOfWeek);
        break;
      case 'End':
        date = endOfWeek(focusedDate, firstDayOfWeek);
        break;
      default:
        return;
    }

    focusDay(date);
    e.preventDefault();
  }

  function getDayProps(date: PlainDate): DayProps | undefined {
    const isInMonth = yearMonth.equals(date);

    // days outside of month are only shown if `showOutsideDays` is true
    if (!context.showOutsideDays && !isInMonth) {
      return undefined;
    }

    const isFocusedDay = date.equals(focusedDate);
    const isToday = date.equals(todaysDate);
    const asDate = toDate(date);
    const isDisallowed = isDateDisallowed?.(asDate) ?? false;
    const isDisabled = !inRange(date, min, max);

    let rangeParts = '';
    let isSelected: boolean | undefined;

    if (context.type === 'range') {
      const [start, end] = context.value;
      const isRangeStart = start?.equals(date);
      const isRangeEnd = end?.equals(date);

      isSelected = Boolean(start && end && inRange(date, start, end));

      rangeParts = joinParts(
        isRangeStart && 'range-start',
        isRangeEnd && 'range-end',
        isSelected && !isRangeStart && !isRangeEnd && 'range-inner',
      );
    } else if (context.type === 'multi') {
      isSelected = context.value.some((d) => d.equals(date));
    } else {
      isSelected = context.value?.equals(date) ?? false;
    }

    const parts = joinParts(
      'button',
      'day',
      `day-${asDate.getUTCDay()}`,
      // outside days are never shown as selected
      isInMonth ? isSelected && 'selected' : 'outside',
      isDisallowed && 'disallowed',
      isToday && 'today',
      context.getDayParts?.(asDate),
      rangeParts,
    );

    return {
      'data-part': parts,
      part: parts,
      tabIndex: isInMonth && isFocusedDay ? 0 : -1,
      disabled: isDisabled,
      'aria-disabled': isDisallowed || undefined,
      'aria-pressed': isInMonth ? isSelected : undefined,
      'aria-current': isToday ? 'date' : undefined,
      'aria-label': dayFormatter.format(asDate),
      onKeyDown,
      onClick() {
        if (!isDisallowed) {
          context.selectDay(date);
        }

        focusDay(date);
      },
      onMouseOver() {
        if (!isDisallowed && !isDisabled) {
          context.hoverDay?.(date);
        }
      },
    };
  }

  return {
    weeks,
    yearMonth,
    daysLong,
    daysVisible,
    getDayProps,
  };
}
