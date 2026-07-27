import type { ReactNode } from 'react';
import type { DaysOfWeek } from './utils/date';

/** How the calendar advances when paging: whole view, or one month at a time. */
export type Pagination = 'single' | 'months';

export interface PageChangeDetail {
  start: Date;
  end: Date;
}

export interface CalendarFocusOptions extends FocusOptions {
  target?: 'day' | 'next' | 'previous';
}

/** Imperative handle exposed through `ref` on every calendar. */
export interface CalendarHandle {
  focus: (options?: CalendarFocusOptions) => void;
  /** The rendered container element. */
  element: HTMLDivElement | null;
}

/** Props shared by `CalendarDate`, `CalendarRange` and `CalendarMulti`. */
export interface CalendarSharedProps {
  /** Earliest selectable date, ISO-8601 (`YYYY-MM-DD`). */
  min?: string;
  /** Latest selectable date, ISO-8601 (`YYYY-MM-DD`). */
  max?: string;
  /** Overrides "today", useful for testing. ISO-8601 (`YYYY-MM-DD`). */
  today?: string;
  /** Focused day, ISO-8601. Controlled — pair with `onFocusDay`. */
  focusedDate?: string;
  /** Initial focused day for the uncontrolled case, ISO-8601. */
  defaultFocusedDate?: string;
  /** 0 = Sunday … 6 = Saturday. Defaults to 1 (Monday). */
  firstDayOfWeek?: DaysOfWeek;
  /** Render days that fall outside the displayed month. */
  showOutsideDays?: boolean;
  /** Render an ISO week number column. */
  showWeekNumbers?: boolean;
  /** BCP 47 locale. Defaults to the runtime locale. */
  locale?: string;
  /** Number of months in the view. Defaults to 1. */
  months?: number;
  /** Paging step. Defaults to `"months"` (a whole view at a time). */
  pageBy?: Pagination;
  /** Weekday header format. Defaults to `"narrow"`. */
  formatWeekday?: 'narrow' | 'short';
  /** Marks a date as non-selectable while keeping it focusable. */
  isDateDisallowed?: (date: Date) => boolean;
  /** Extra space-separated `data-part` tokens for a given day. */
  getDayParts?: (date: Date) => string;
  /** Fires when the visible page changes. */
  onPageChange?: (detail: PageChangeDetail) => void;
  /** Fires when the focused day changes. */
  onFocusDay?: (date: Date) => void;
  /** Content of the previous-page button. Defaults to "Previous". */
  previous?: ReactNode;
  /** Content of the next-page button. Defaults to "Next". */
  next?: ReactNode;
  /** Replaces the visible heading. Defaults to `<CalendarHeading year="numeric" />`. */
  heading?: ReactNode;
  className?: string;
  /** The `<CalendarMonth />` elements (and any extra controls) to render. */
  children?: ReactNode;
}
