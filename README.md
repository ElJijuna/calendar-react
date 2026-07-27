# temporal-calendar

Small, feature-rich, accessible calendar components for **React 19** — a complete port of [Cally](https://github.com/WickyNilliams/cally) with no web components, no shadow DOM and **zero runtime dependencies**.

- 🗓️ Single date, date range and multi-date selection
- ♿ Full keyboard navigation, roving tabindex, ARIA and a live-announced heading
- 🌍 Localized through `Intl` — month names, weekday names and headings
- 🎨 Headless by default: every node carries a `data-part`, plus an optional stylesheet
- 🧩 Composable: you place the months, the heading and the year/month selects
- 📦 ESM-only, tree-shakeable, ~6.7 kB gzipped, typed end to end

```bash
npm install temporal-calendar
```

## Quick start

```tsx
import { CalendarDate, CalendarMonth } from 'temporal-calendar';
import 'temporal-calendar/styles.css'; // optional default theme

export function Example() {
  return (
    <CalendarDate defaultValue="2026-07-26" onChange={(value) => console.log(value)}>
      <CalendarMonth />
    </CalendarDate>
  );
}
```

Dates are always ISO-8601 strings (`YYYY-MM-DD`) — the same format Cally uses — while callbacks that report a *day* (`onFocusDay`, `onRangeStart`, `onRangeEnd`, `onPageChange`) give you a UTC `Date`.

## Components

| Component | Purpose |
| --- | --- |
| `CalendarDate` | Select a single date |
| `CalendarRange` | Select a start and an end date |
| `CalendarMulti` | Select any number of dates |
| `CalendarMonth` | One month grid — place one per visible month |
| `CalendarHeading` | Formatted heading for the calendar or a month |
| `CalendarSelectMonth` | Month `<select>` that moves the view |
| `CalendarSelectYear` | Year `<select>` that moves the view |

`CalendarMonth`, `CalendarHeading` and the selects must be rendered inside one of the three calendars — they read the shared context.

### Shared props

Accepted by `CalendarDate`, `CalendarRange` and `CalendarMulti`:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `min` | `string` | — | Earliest selectable date (ISO) |
| `max` | `string` | — | Latest selectable date (ISO) |
| `today` | `string` | — | Overrides "today", handy for tests |
| `focusedDate` | `string` | — | Controlled focused day |
| `defaultFocusedDate` | `string` | — | Initial focused day, uncontrolled |
| `firstDayOfWeek` | `0 – 6` | `1` | 0 = Sunday, 1 = Monday … |
| `showOutsideDays` | `boolean` | `false` | Render days from adjacent months |
| `showWeekNumbers` | `boolean` | `false` | Render an ISO week number column |
| `locale` | `string` | runtime locale | BCP 47 locale |
| `months` | `number` | `1` | Months in the view |
| `pageBy` | `'months' \| 'single'` | `'months'` | Page a whole view or one month |
| `formatWeekday` | `'narrow' \| 'short'` | `'narrow'` | Visible weekday header format |
| `isDateDisallowed` | `(date: Date) => boolean` | — | Non-selectable but still focusable |
| `getDayParts` | `(date: Date) => string` | — | Extra `data-part` tokens per day |
| `onFocusDay` | `(date: Date) => void` | — | Focused day changed |
| `onPageChange` | `({ start, end }) => void` | — | Visible page changed |
| `previous` / `next` | `ReactNode` | `'Previous'` / `'Next'` | Paging button content |
| `heading` | `ReactNode` | `<CalendarHeading year="numeric" />` | Replaces the visible heading |
| `className` | `string` | — | Class on the container |
| `ref` | `Ref<CalendarHandle>` | — | Imperative `focus()` + `element` |

### Per-component props

| Component | Prop | Type | Notes |
| --- | --- | --- | --- |
| `CalendarDate` | `value` / `defaultValue` | `string` | `onChange(value: string)` |
| `CalendarRange` | `value` / `defaultValue` | `[string, string] \| []` | `onChange(value)` fires on the second click |
| `CalendarRange` | `tentative` / `defaultTentative` | `string` | Pending range start |
| `CalendarRange` | `onRangeStart` / `onRangeEnd` | `(date: Date) => void` | First / second click |
| `CalendarMulti` | `value` / `defaultValue` | `string[]` | `onChange(value: string[])`, clicking toggles |
| `CalendarMonth` | `offset` | `number` | Months after the page start (default `0`) |
| `CalendarMonth` | `heading`, `weekNumberLabel` | `ReactNode` | Overrides the month heading / `#` label |
| `CalendarHeading` | `year`, `month` | `Intl` styles | Omit one to hide it |
| `CalendarSelectYear` | `maxYears`, `label` | `number`, `ReactNode` | Default `20`, `"Year"` |
| `CalendarSelectMonth` | `formatMonth`, `label` | `'long' \| 'short'`, `ReactNode` | Default `'long'`, `"Month"` |

Every calendar is **controlled when you pass `value`** and uncontrolled when you pass `defaultValue` (or nothing).

### Imperative handle

```tsx
const ref = useRef<CalendarHandle>(null);

ref.current?.focus();                      // the active day
ref.current?.focus({ target: 'previous' }); // the previous-page button
ref.current?.element;                       // the container element
```

## Keyboard

| Key | Action |
| --- | --- |
| <kbd>←</kbd> / <kbd>→</kbd> | Previous / next day (mirrored in RTL) |
| <kbd>↑</kbd> / <kbd>↓</kbd> | Same weekday, previous / next week |
| <kbd>Home</kbd> / <kbd>End</kbd> | First / last day of the week |
| <kbd>PageUp</kbd> / <kbd>PageDown</kbd> | Previous / next month |
| <kbd>Shift</kbd> + <kbd>PageUp</kbd> / <kbd>PageDown</kbd> | Previous / next year |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Select the focused day |

Movement is clamped to `min`/`max`, and the view pages automatically when focus leaves it.

## Styling

There is no shadow DOM, so Cally's `::part()` names are exposed as `data-part` tokens. Match them with `~=`:

```css
[data-part~='selected'] { background: rebeccapurple; color: white; }
[data-part~='today'] { outline: 1px dashed currentColor; }
[data-part~='range-inner'] { background: #eee; }
```

| Area | Tokens |
| --- | --- |
| Container | `container`, `header`, `heading`, `months`, `month` |
| Paging | `button`, `previous`, `next`, `disabled` |
| Grid | `table`, `tr`, `head`, `week`, `th`, `td`, `weekday`, `weeknumber`, `col-weeknumber`, `col-1` … `col-7` |
| Days | `button`, `day`, `day-0` … `day-6`, `selected`, `today`, `outside`, `disallowed`, `range-start`, `range-inner`, `range-end` |
| Selects | `select-container`, `label`, `select`, `option` |

The optional stylesheet exposes two custom properties:

```css
@import 'temporal-calendar/styles.css';

[data-part~='container'] {
  --color-accent: #4f46e5;
  --color-text-on-accent: white;
}
```

Prefer utility classes? Skip the stylesheet and target the same tokens with Tailwind's arbitrary variants:

```tsx
<CalendarDate className="[&_[data-part~='selected']]:bg-indigo-600">
```

## Migrating from Cally

| Cally | temporal-calendar |
| --- | --- |
| `<calendar-date value="…">` | `<CalendarDate value="…" onChange={…}>` |
| `value="2026-01-01/2026-01-05"` (range) | `value={['2026-01-01', '2026-01-05']}` |
| `value="2026-01-01 2026-01-02"` (multi) | `value={['2026-01-01', '2026-01-02']}` |
| `change` event | `onChange(value)` |
| `focusday` / `pagechange` events | `onFocusDay(date)` / `onPageChange({ start, end })` |
| `rangestart` / `rangeend` events | `onRangeStart(date)` / `onRangeEnd(date)` |
| `::part(day)` | `[data-part~='day']` |
| `<span slot="previous">` | `previous={<span>…</span>}` |
| `calendar.focus({ target })` | `ref.current.focus({ target })` |

Utilities are exported too, so `isDateDisallowed` can reuse the same date maths: `PlainDate`, `PlainYearMonth`, `getToday`, `getWeekNumber`, `startOfWeek`, `endOfWeek`, `endOfMonth`, `getViewOfMonth`, `clamp`, `toDate`.

## Accessibility

- The calendar is a `role="group"` labelled by a visually hidden, `aria-live="polite"` heading, so page changes are announced.
- Each month is a `<table>` with `scope="col"` weekday headers (full name for screen readers, abbreviation on screen) and `scope="row"` week numbers.
- Days are buttons with `aria-label` (localized), `aria-pressed`, `aria-current="date"` for today, `disabled` outside `min`/`max` and `aria-disabled` when disallowed.
- Exactly one day is in the tab order at a time (roving tabindex); the component never steals focus on mount.
- Every component is asserted with `jest-axe` in CI.

## Requirements

React 19 (uses `ref` as a prop) and any modern browser with `Intl.DateTimeFormat.prototype.formatRange`. The package is ESM-only.

---

## Badges

[![npm version](https://img.shields.io/npm/v/temporal-calendar.svg?logo=npm)](https://www.npmjs.com/package/temporal-calendar)
[![npm downloads](https://img.shields.io/npm/dm/temporal-calendar.svg?logo=npm)](https://www.npmjs.com/package/temporal-calendar)
[![CI](https://github.com/ElJijuna/calendar-react/actions/workflows/ci.yml/badge.svg)](https://github.com/ElJijuna/calendar-react/actions/workflows/ci.yml)
[![Release](https://github.com/ElJijuna/calendar-react/actions/workflows/release.yml/badge.svg)](https://github.com/ElJijuna/calendar-react/actions/workflows/release.yml)
[![CodeQL](https://github.com/ElJijuna/calendar-react/actions/workflows/codeql.yml/badge.svg)](https://github.com/ElJijuna/calendar-react/actions/workflows/codeql.yml)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/temporal-calendar)](https://bundlephobia.com/package/temporal-calendar)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](https://www.npmjs.com/package/temporal-calendar?activeTab=dependencies)
[![types included](https://img.shields.io/npm/types/temporal-calendar)](https://www.npmjs.com/package/temporal-calendar)
[![React 19](https://img.shields.io/badge/React-19-149eca?logo=react)](https://react.dev)
[![ESM only](https://img.shields.io/badge/module-ESM--only-f7df1e)](https://nodejs.org/api/esm.html)
[![provenance](https://img.shields.io/badge/npm-provenance-blue?logo=npm)](https://docs.npmjs.com/generating-provenance-statements)
[![code style: Biome](https://img.shields.io/badge/code_style-biome-60a5fa?logo=biome)](https://biomejs.dev)
[![tested with Jest](https://img.shields.io/badge/tested_with-jest-99424f?logo=jest)](https://jestjs.io)
[![a11y: jest-axe](https://img.shields.io/badge/a11y-jest--axe-663399)](https://github.com/nickcolley/jest-axe)
[![Storybook](https://img.shields.io/badge/Storybook-10-ff4785?logo=storybook)](https://storybook.js.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-yellow.svg)](./LICENSE)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

## Examples

### Single date, controlled

```tsx
import { useState } from 'react';
import { CalendarDate, CalendarMonth } from 'temporal-calendar';

function DatePicker() {
  const [value, setValue] = useState('2026-07-26');

  return (
    <CalendarDate value={value} onChange={setValue}>
      <CalendarMonth />
    </CalendarDate>
  );
}
```

### Date range across two months

```tsx
import { useState } from 'react';
import { CalendarMonth, CalendarRange, type DateRange } from 'temporal-calendar';

function Stay() {
  const [range, setRange] = useState<DateRange>([]);

  return (
    <CalendarRange
      months={2}
      value={range}
      onChange={setRange}
      onRangeStart={(date) => console.log('check-in', date)}
      onRangeEnd={(date) => console.log('check-out', date)}
    >
      <CalendarMonth />
      <CalendarMonth offset={1} />
    </CalendarRange>
  );
}
```

### Multiple dates

```tsx
import { useState } from 'react';
import { CalendarMonth, CalendarMulti } from 'temporal-calendar';

function Availability() {
  const [dates, setDates] = useState<string[]>([]);

  return (
    <CalendarMulti value={dates} onChange={setDates} showWeekNumbers>
      <CalendarMonth />
    </CalendarMulti>
  );
}
```

### A whole year, paging one month at a time

```tsx
<CalendarDate months={12} pageBy="single">
  {Array.from({ length: 12 }, (_, i) => (
    <CalendarMonth key={i} offset={i} />
  ))}
</CalendarDate>
```

### Bounds and business rules

```tsx
const isWeekend = (date: Date) => [0, 6].includes(date.getUTCDay());
const holidays = new Set(['2026-12-25', '2026-01-01']);

<CalendarDate
  min="2026-01-01"
  max="2026-12-31"
  isDateDisallowed={(date) => isWeekend(date) || holidays.has(date.toISOString().slice(0, 10))}
  getDayParts={(date) => (holidays.has(date.toISOString().slice(0, 10)) ? 'holiday' : '')}
>
  <CalendarMonth />
</CalendarDate>;
```

```css
[data-part~='holiday'] { color: crimson; }
```

### Year and month selects instead of a plain heading

```tsx
import {
  CalendarDate,
  CalendarMonth,
  CalendarSelectMonth,
  CalendarSelectYear,
} from 'temporal-calendar';

<CalendarDate
  heading={
    <>
      <CalendarSelectMonth formatMonth="short" />
      <CalendarSelectYear maxYears={30} />
    </>
  }
>
  <CalendarMonth />
</CalendarDate>;
```

### Custom paging buttons and month headings

```tsx
import { CalendarDate, CalendarHeading, CalendarMonth } from 'temporal-calendar';

<CalendarDate previous={<ChevronLeft aria-hidden />} next={<ChevronRight aria-hidden />}>
  <CalendarMonth heading={<CalendarHeading month="long" year="numeric" />} />
</CalendarDate>;
```

### Localization

```tsx
<CalendarDate locale="es-ES" firstDayOfWeek={1} formatWeekday="short">
  <CalendarMonth />
</CalendarDate>

<CalendarDate locale="ja-JP" firstDayOfWeek={0}>
  <CalendarMonth />
</CalendarDate>
```

Right-to-left works with a plain `dir` attribute — arrow keys mirror automatically:

```tsx
<div dir="rtl">
  <CalendarDate locale="ar-EG">
    <CalendarMonth />
  </CalendarDate>
</div>
```

### Inside a popover, with focus management

```tsx
import { useRef, useState } from 'react';
import { CalendarDate, CalendarMonth, type CalendarHandle } from 'temporal-calendar';

function DateField() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const calendar = useRef<CalendarHandle>(null);

  return (
    <>
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        {value || 'Pick a date'}
      </button>

      {open && (
        <div role="dialog" aria-label="Choose a date" ref={() => calendar.current?.focus()}>
          <CalendarDate
            ref={calendar}
            value={value}
            onChange={(next) => {
              setValue(next);
              setOpen(false);
            }}
          >
            <CalendarMonth />
          </CalendarDate>
        </div>
      )}
    </>
  );
}
```

### Reacting to the visible page

```tsx
<CalendarDate
  months={2}
  onPageChange={({ start, end }) => fetchAvailability({ start, end })}
  onFocusDay={(date) => console.log('focused', date)}
>
  <CalendarMonth />
  <CalendarMonth offset={1} />
</CalendarDate>
```

## Credits

A port of [Cally](https://github.com/WickyNilliams/cally) by [Nick Williams](https://github.com/WickyNilliams). All behaviour, prop names and part names come from that library.

## License

[MIT](./LICENSE)
