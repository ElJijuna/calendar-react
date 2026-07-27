import type { ChangeEvent, ReactNode } from 'react';
import { useCalendarContext } from '../calendar-base/context';
import { SelectBase, type SelectOption } from './SelectBase';

function times<T>(n: number, fn: (i: number) => T): T[] {
  return Array.from({ length: n }, (_, i) => fn(i));
}

export interface CalendarSelectYearProps {
  /** How many years to offer, centred on the focused year. Defaults to 20. */
  maxYears?: number;
  /** Label for the select. Defaults to "Year". */
  label?: ReactNode;
  className?: string;
}

/** A year `<select>` that moves the focused date. Render inside a calendar. */
export const CalendarSelectYear = ({
  maxYears = 20,
  label = 'Year',
  className,
}: CalendarSelectYearProps) => {
  const { min, max, focusedDate, focusDay } = useCalendarContext();
  const focusedYearMonth = focusedDate.toPlainYearMonth();
  const currentYear = focusedYearMonth.year;
  const halfRange = Math.floor(maxYears / 2);
  const defaultMin = currentYear - halfRange;
  const defaultMax = currentYear + (maxYears - halfRange - 1);
  const minYear = Math.max(defaultMin, min?.year ?? Number.NEGATIVE_INFINITY);
  const maxYear = Math.min(defaultMax, max?.year ?? Number.POSITIVE_INFINITY);
  const options: SelectOption[] = times(Math.max(maxYear - minYear + 1, 0), (i) => {
    const year = minYear + i;

    return { label: `${year}`, value: `${year}` };
  });

  function onChange(e: ChangeEvent<HTMLSelectElement>) {
    const year = Number.parseInt(e.currentTarget.value, 10);

    focusDay(focusedDate.add({ years: year - focusedYearMonth.year }));
  }

  return (
    <SelectBase
      className={className}
      label={label}
      options={options}
      value={`${currentYear}`}
      onChange={onChange}
    />
  );
};
