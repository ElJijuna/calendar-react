---
'temporal-calendar-react': minor
---

Initial release: a complete React 19 port of Cally.

- `CalendarDate`, `CalendarRange` and `CalendarMulti` with controlled and uncontrolled values
- `CalendarMonth`, `CalendarHeading`, `CalendarSelectMonth` and `CalendarSelectYear` building blocks
- Full keyboard navigation, roving tabindex and ARIA parity with Cally
- Localization through `Intl`, week numbers, outside days, multi-month paging (`months`, `pageBy`)
- Headless `data-part` styling hooks plus an optional `temporal-calendar-react/styles.css` theme
- Exported date utilities: `PlainDate`, `PlainYearMonth`, `getViewOfMonth`, `getWeekNumber` and friends
