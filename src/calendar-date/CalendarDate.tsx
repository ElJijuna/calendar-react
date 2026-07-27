import { type Ref, useImperativeHandle, useMemo } from 'react';
import { CalendarBase } from '../calendar-base/CalendarBase';
import type { CalendarContextValue } from '../calendar-base/context';
import { useCalendarBase } from '../calendar-base/useCalendarBase';
import type { CalendarHandle, CalendarSharedProps } from '../types';
import { useDateValue } from '../utils/hooks';
import type { PlainDate } from '../utils/temporal';

export interface CalendarDateProps extends CalendarSharedProps {
  /** Selected date, ISO-8601 (`YYYY-MM-DD`). Controlled. */
  value?: string;
  /** Initially selected date for the uncontrolled case. */
  defaultValue?: string;
  /** Fires with the newly selected ISO date. */
  onChange?: (value: string) => void;
  ref?: Ref<CalendarHandle>;
}

/** Calendar for selecting a single date. */
export const CalendarDate = ({
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
}: CalendarDateProps) => {
  const [selected, setSelected] = useDateValue({
    value,
    defaultValue,
    fallback: '',
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
    valueFallback: selected,
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
      type: 'date',
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
      selectDay: (date: PlainDate) => setSelected(date),
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
