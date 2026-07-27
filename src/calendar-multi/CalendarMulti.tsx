import { type Ref, useImperativeHandle, useMemo } from 'react';
import { CalendarBase } from '../calendar-base/CalendarBase';
import type { CalendarContextValue } from '../calendar-base/context';
import { useCalendarBase } from '../calendar-base/useCalendarBase';
import type { CalendarHandle, CalendarSharedProps } from '../types';
import { useDateMultiValue } from '../utils/hooks';
import type { PlainDate } from '../utils/temporal';

export interface CalendarMultiProps extends CalendarSharedProps {
  /** Selected dates as ISO-8601 strings. Controlled. */
  value?: string[];
  /** Initially selected dates for the uncontrolled case. */
  defaultValue?: string[];
  /** Fires with the new selection whenever a day is toggled. */
  onChange?: (value: string[]) => void;
  ref?: Ref<CalendarHandle>;
}

/** Calendar for selecting any number of individual dates. */
export const CalendarMulti = ({
  value,
  defaultValue,
  onChange,
  min,
  max,
  today,
  focusedDate,
  defaultFocusedDate,
  firstDayOfWeek = 1,
  showOutsideDays = false,
  showWeekNumbers = false,
  locale,
  months = 1,
  pageBy = 'months',
  formatWeekday = 'narrow',
  isDateDisallowed,
  getDayParts,
  onPageChange,
  onFocusDay,
  previous,
  next,
  heading,
  className,
  children,
  ref,
}: CalendarMultiProps) => {
  const [selected, setSelected] = useDateMultiValue({
    value,
    defaultValue,
    fallback: [],
    onChange,
  });
  const calendar = useCalendarBase({
    min,
    max,
    today,
    months,
    pageBy,
    locale,
    focusedDate,
    defaultFocusedDate,
    onFocusDay,
    onPageChange,
    valueFallback: selected[0],
  });

  useImperativeHandle(
    ref,
    () => ({
      focus: calendar.focus,
      element: calendar.containerRef.current,
    }),
    [calendar.focus, calendar.containerRef],
  );

  const context = useMemo<CalendarContextValue>(
    () => ({
      type: 'multi',
      value: selected,
      min: calendar.min,
      max: calendar.max,
      today: calendar.today,
      page: calendar.page,
      focusedDate: calendar.focusedDate,
      firstDayOfWeek,
      showOutsideDays,
      showWeekNumbers,
      locale,
      formatWeekday,
      isDateDisallowed,
      getDayParts,
      focusDay: calendar.focusDay,
      selectDay: (date: PlainDate) => {
        const next = [...selected];
        const index = selected.findIndex((selectedDate) => selectedDate.equals(date));

        if (index < 0) {
          next.push(date);
        } else {
          next.splice(index, 1);
        }

        setSelected(next);
      },
    }),
    [
      selected,
      setSelected,
      calendar.min,
      calendar.max,
      calendar.today,
      calendar.page,
      calendar.focusedDate,
      calendar.focusDay,
      firstDayOfWeek,
      showOutsideDays,
      showWeekNumbers,
      locale,
      formatWeekday,
      isDateDisallowed,
      getDayParts,
    ],
  );

  return (
    <CalendarBase
      context={context}
      page={calendar.page}
      locale={locale}
      containerRef={calendar.containerRef}
      previous={calendar.previous}
      next={calendar.next}
      previousLabel={previous}
      nextLabel={next}
      heading={heading}
      className={className}
    >
      {children}
    </CalendarBase>
  );
};
