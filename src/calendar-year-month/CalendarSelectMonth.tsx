import { type ChangeEvent, type ReactNode, useMemo } from 'react';
import { useCalendarContext } from '../calendar-base/context';
import { useDateFormatter } from '../utils/hooks';
import { PlainYearMonth } from '../utils/temporal';
import { SelectBase, type SelectOption } from './SelectBase';

export interface CalendarSelectMonthProps {
  /** `Intl` month style used for the option labels. Defaults to `"long"`. */
  formatMonth?: 'long' | 'short';
  /** Label for the select. Defaults to "Month". */
  label?: ReactNode;
  className?: string;
}

/** A month `<select>` that moves the focused date. Render inside a calendar. */
export const CalendarSelectMonth = ({
  formatMonth = 'long',
  label = 'Month',
  className,
}: CalendarSelectMonthProps) => {
  const { min, max, focusedDate, locale, focusDay } = useCalendarContext();
  const formatOptions = useMemo(() => ({ month: formatMonth }) as const, [formatMonth]);
  const formatter = useDateFormatter(formatOptions, locale);
  const monthNames = useMemo(() => {
    const months: string[] = [];
    const day = new Date();

    day.setUTCDate(1);

    for (let i = 0; i < 12; i++) {
      const index = (day.getUTCMonth() + 12) % 12;

      months[index] = formatter.format(day);
      day.setUTCMonth(day.getUTCMonth() + 1);
    }

    return months;
  }, [formatter]);
  const focusedYearMonth = focusedDate.toPlainYearMonth();
  const options: SelectOption[] = monthNames.map((monthLabel, index) => {
    const month = index + 1;
    const yearMonth = focusedYearMonth.add({ months: month - focusedYearMonth.month });
    const disabled =
      (min !== undefined && PlainYearMonth.compare(yearMonth, min) < 0) ||
      (max !== undefined && PlainYearMonth.compare(yearMonth, max) > 0);

    return { label: monthLabel, value: `${month}`, disabled };
  });

  function onChange(e: ChangeEvent<HTMLSelectElement>) {
    const month = Number.parseInt(e.currentTarget.value, 10);

    focusDay(focusedDate.add({ months: month - focusedYearMonth.month }));
  }

  return (
    <SelectBase
      className={className}
      label={label}
      options={options}
      value={`${focusedYearMonth.month}`}
      onChange={onChange}
    />
  );
};
