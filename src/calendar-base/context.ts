import { createContext, useContext } from 'react';
import type { DaysOfWeek } from '../utils/date';
import { getToday } from '../utils/date';
import type { PlainDate, PlainYearMonth } from '../utils/temporal';

export interface CalendarPage {
  start: PlainYearMonth;
  end: PlainYearMonth;
}

interface CalendarContextBase {
  min?: PlainDate | undefined;
  max?: PlainDate | undefined;
  today?: PlainDate | undefined;
  firstDayOfWeek: DaysOfWeek;
  isDateDisallowed?: ((date: Date) => boolean) | undefined;
  getDayParts?: ((date: Date) => string) | undefined;
  page: CalendarPage;
  focusedDate: PlainDate;
  showOutsideDays?: boolean | undefined;
  showWeekNumbers?: boolean | undefined;
  locale?: string | undefined;
  formatWeekday: 'narrow' | 'short';
  /** Replaces Cally's bubbling `selectday` event. */
  selectDay: (date: PlainDate) => void;
  /** Replaces Cally's bubbling `focusday` event. */
  focusDay: (date: PlainDate) => void;
  /** Replaces Cally's bubbling `hoverday` event. */
  hoverDay?: ((date: PlainDate) => void) | undefined;
}

export interface CalendarDateContextValue extends CalendarContextBase {
  type: 'date';
  value?: PlainDate | undefined;
}

export interface CalendarRangeContextValue extends CalendarContextBase {
  type: 'range';
  value: [PlainDate, PlainDate] | [];
}

export interface CalendarMultiContextValue extends CalendarContextBase {
  type: 'multi';
  value: PlainDate[];
}

export type CalendarContextValue =
  | CalendarDateContextValue
  | CalendarRangeContextValue
  | CalendarMultiContextValue;

const today = getToday();
const noop = () => undefined;
const defaultCalendarContext: CalendarContextValue = {
  type: 'date',
  firstDayOfWeek: 1,
  formatWeekday: 'narrow',
  focusedDate: today,
  page: { start: today.toPlainYearMonth(), end: today.toPlainYearMonth() },
  selectDay: noop,
  focusDay: noop,
};

export const CalendarContext = createContext<CalendarContextValue>(defaultCalendarContext);

export function useCalendarContext(): CalendarContextValue {
  return useContext(CalendarContext);
}

export interface HeadingRangeContextValue {
  type: 'range';
  value: CalendarPage;
  locale?: string | undefined;
}

export interface HeadingDateContextValue {
  type: 'date';
  value: PlainYearMonth;
  locale?: string | undefined;
}

export type CalendarHeadingContextValue = HeadingRangeContextValue | HeadingDateContextValue;

export const CalendarHeadingContext = createContext<CalendarHeadingContextValue>({
  type: 'date',
  value: today.toPlainYearMonth(),
});

export function useCalendarHeadingContext(): CalendarHeadingContextValue {
  return useContext(CalendarHeadingContext);
}
