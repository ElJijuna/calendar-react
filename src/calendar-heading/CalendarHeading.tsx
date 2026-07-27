import type { ComponentPropsWithoutRef } from 'react';
import { useCalendarHeadingContext } from '../calendar-base/context';
import { toDate } from '../utils/date';
import { useDateFormatter } from '../utils/hooks';

export interface CalendarHeadingProps extends ComponentPropsWithoutRef<'span'> {
  /** `Intl.DateTimeFormat` year style. Omit to hide the year. */
  year?: 'numeric' | '2-digit';
  /** `Intl.DateTimeFormat` month style. Omit to hide the month. */
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
}

/**
 * Renders the formatted heading for the closest calendar or month.
 *
 * Inside `CalendarDate`/`CalendarRange`/`CalendarMulti` it formats the whole
 * visible page as a range; inside `CalendarMonth` it formats that month.
 */
export const CalendarHeading = ({ year, month, ...rest }: CalendarHeadingProps) => {
  const context = useCalendarHeadingContext();
  const options = {
    ...(year ? { year } : {}),
    ...(month ? { month } : {}),
  };
  const formatter = useDateFormatter(options, context.locale);
  const formatted =
    context.type === 'range'
      ? formatter.formatRange(toDate(context.value.start), toDate(context.value.end))
      : formatter.format(toDate(context.value));

  return <span {...rest}>{formatted}</span>;
};
