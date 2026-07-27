import { type Ref, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { CalendarBase } from '../calendar-base/CalendarBase';
import type { CalendarContextValue } from '../calendar-base/context';
import { useCalendarBase } from '../calendar-base/useCalendarBase';
import type { CalendarHandle, CalendarSharedProps } from '../types';
import { toDate } from '../utils/date';
import { type DateRange, useDateRangeValue, useDateValue } from '../utils/hooks';
import { PlainDate } from '../utils/temporal';

const sort = (a: PlainDate, b: PlainDate): [PlainDate, PlainDate] =>
  PlainDate.compare(a, b) < 0 ? [a, b] : [b, a];

export interface CalendarRangeProps extends CalendarSharedProps {
  /** Selected range as `[start, end]` ISO dates, or `[]`. Controlled. */
  value?: DateRange;
  /** Initially selected range for the uncontrolled case. */
  defaultValue?: DateRange;
  /** Fires when a complete range has been selected. */
  onChange?: (value: DateRange) => void;
  /** Pending start of a range, ISO-8601. Controlled. */
  tentative?: string;
  /** Initial pending start of a range for the uncontrolled case. */
  defaultTentative?: string;
  /** Fires when the first date of a range is picked. */
  onRangeStart?: (date: Date) => void;
  /** Fires when the second date of a range is picked. */
  onRangeEnd?: (date: Date) => void;
  ref?: Ref<CalendarHandle>;
}

/** Calendar for selecting a date range. */
export const CalendarRange = ({
  value,
  defaultValue,
  onChange,
  tentative,
  defaultTentative,
  onRangeStart,
  onRangeEnd,
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
}: CalendarRangeProps) => {
  const [selected, setSelected] = useDateRangeValue({
    value,
    defaultValue,
    fallback: [],
    onChange,
  });
  const [tentativeDate, setTentativeDate] = useDateValue({
    value: tentative,
    defaultValue: defaultTentative,
    fallback: '',
    onChange: undefined,
  });
  const [hovered, setHovered] = useState<PlainDate | undefined>(undefined);
  const tentativeKey = tentativeDate?.toString();

  // reset the hover preview whenever the tentative start changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: the key is the trigger, not a value read inside
  useEffect(() => {
    setHovered(undefined);
  }, [tentativeKey]);

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

  const range = useMemo(
    () => (tentativeDate ? sort(tentativeDate, hovered ?? tentativeDate) : selected),
    [tentativeDate, hovered, selected],
  );
  const context = useMemo<CalendarContextValue>(
    () => ({
      type: 'range',
      value: range,
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
      focusDay: (date: PlainDate) => {
        calendar.focusDay(date);

        if (tentativeDate) {
          setHovered(date);
        }
      },
      hoverDay: (date: PlainDate) => {
        if (tentativeDate) {
          setHovered(date);
        }
      },
      selectDay: (date: PlainDate) => {
        if (!tentativeDate) {
          setTentativeDate(date);
          onRangeStart?.(toDate(date));

          return;
        }

        setSelected(sort(tentativeDate, date));
        setTentativeDate(undefined);
        onRangeEnd?.(toDate(date));
      },
    }),
    [
      range,
      tentativeDate,
      setTentativeDate,
      setSelected,
      onRangeStart,
      onRangeEnd,
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
