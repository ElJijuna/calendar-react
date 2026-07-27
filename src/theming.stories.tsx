import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactNode, useId } from 'react';
import { CalendarDate } from './calendar-date/CalendarDate';
import { CalendarHeading } from './calendar-heading/CalendarHeading';
import { CalendarMonth } from './calendar-month/CalendarMonth';
import { CalendarRange } from './calendar-range/CalendarRange';

/**
 * Ports of the [Cally theming guide](https://wicky.nillia.ms/cally/guides/theming/).
 * Cally styles shadow parts with `::part(x)`; here the same tokens are plain
 * attributes, so `::part(day)` becomes `[data-part~="day"]`.
 */
const meta = {
  title: 'Guides/Theming',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Every node exposes a space-separated `data-part`. Match a single token with `~=`, ' +
          'combine tokens by chaining attribute selectors, and re-theme with the ' +
          '`--color-accent` / `--color-text-on-accent` custom properties.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Scopes a stylesheet to one example: `&` in the CSS is replaced by a class
 * unique to this instance, so stories on the docs page do not bleed into each
 * other.
 */
const Theme = ({ css, children }: { css: string; children: ReactNode }) => {
  const scope = `theme-${useId().replaceAll(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <div className={scope}>
      <style>{css.replaceAll('&', `.${scope}`)}</style>
      {children}
    </div>
  );
};
const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);
const TODAY = '2026-07-15';

/**
 * The coarsest knob: two custom properties drive selected days, focus rings and
 * range fills. Set them on the container (or anywhere above it).
 */
export const AccentColor: Story = {
  render: () => (
    <Theme
      css={`
        & [data-part~='container'] {
          --color-accent: #7048e8;
          --color-text-on-accent: #ffffff;
        }
      `}
    >
      <CalendarDate today={TODAY} defaultValue="2026-07-15">
        <CalendarMonth />
      </CalendarDate>
    </Theme>
  ),
};

/** Icons replace the default "Previous" / "Next" labels through props. */
export const NavigationIcons: Story = {
  render: () => (
    <Theme
      css={`
        & [data-part~='previous'],
        & [data-part~='next'] {
          border: 1px solid #d0d0d8;
          border-radius: 0.5rem;
          background: #fff;
        }

        & [data-part~='previous']:focus-visible,
        & [data-part~='next']:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 2px;
        }
      `}
    >
      <CalendarDate today={TODAY} previous={<ChevronLeft />} next={<ChevronRight />}>
        <CalendarMonth />
      </CalendarDate>
    </Theme>
  ),
};

/** `[data-part~="months"]` is a plain flex container — rearrange it freely. */
export const HorizontalMonths: Story = {
  render: () => (
    <Theme
      css={`
        & [data-part~='months'] {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 2rem;
        }
      `}
    >
      <CalendarDate today={TODAY} months={3}>
        <CalendarMonth />
        <CalendarMonth offset={1} />
        <CalendarMonth offset={2} />
      </CalendarDate>
    </Theme>
  ),
};

/**
 * Ranges expose `range-start`, `range-inner` and `range-end`. Chain the
 * selectors to catch a single day that is both ends of the range.
 */
export const RangeShape: Story = {
  render: () => (
    <Theme
      css={`
        & [data-part~='container'] {
          --color-accent: #7048e8;
          --color-text-on-accent: #ffffff;
        }

        & [data-part~='range-inner'] {
          background: #845ef7;
          color: #fff;
        }

        & [data-part~='range-start'] {
          border-start-end-radius: 0;
          border-end-end-radius: 0;
          border-start-start-radius: 999px;
          border-end-start-radius: 999px;
        }

        & [data-part~='range-end'] {
          border-start-start-radius: 0;
          border-end-start-radius: 0;
          border-start-end-radius: 999px;
          border-end-end-radius: 999px;
        }

        & [data-part~='range-start'][data-part~='range-end'] {
          border-radius: 999px;
        }
      `}
    >
      <CalendarRange today={TODAY} months={2} defaultValue={['2026-07-08', '2026-08-04']}>
        <CalendarMonth />
        <CalendarMonth offset={1} />
      </CalendarRange>
    </Theme>
  ),
};

/** Weekends, today and disallowed days, each addressed by its own token. */
export const DayStates: Story = {
  render: () => (
    <Theme
      css={`
        & [data-part~='container'] {
          --color-accent: #0b7285;
          --color-text-on-accent: #ffffff;
        }

        & [data-part~='day-0'],
        & [data-part~='day-6'] {
          color: #c92a2a;
        }

        & [data-part~='today'] {
          outline: 1px dashed currentColor;
          outline-offset: -3px;
        }

        & [data-part~='disallowed'] {
          text-decoration: line-through;
        }

        & [data-part~='holiday'] {
          font-weight: 700;
          color: #c2255c;
        }
      `}
    >
      <CalendarDate
        today={TODAY}
        showOutsideDays
        isDateDisallowed={(date) => [0, 6].includes(date.getUTCDay())}
        getDayParts={(date) => (date.getUTCDate() === 24 ? 'holiday' : '')}
      >
        <CalendarMonth />
      </CalendarDate>
    </Theme>
  ),
};

/** A dark theme is just different values for the same properties. */
export const Dark: Story = {
  render: () => (
    <Theme
      css={`
        & {
          padding: 1.5rem;
          border-radius: 0.75rem;
          background: #16161a;
          color: #e9ecef;
          inline-size: fit-content;
        }

        & [data-part~='container'] {
          --color-accent: #ffd43b;
          --color-text-on-accent: #16161a;
        }

        & [data-part~='weekday'] {
          color: #909296;
        }

        & [data-part~='day']:hover:where(:not(:disabled, [aria-disabled])) {
          background: #2c2e33;
        }

        & [data-part~='previous']:hover,
        & [data-part~='next']:hover {
          background: #2c2e33;
        }
      `}
    >
      <CalendarDate today={TODAY} defaultValue="2026-07-15" showWeekNumbers>
        <CalendarMonth />
      </CalendarDate>
    </Theme>
  ),
};

/** Everything at once: rounded days, a card, a custom heading and icons. */
export const FullTheme: Story = {
  render: () => (
    <Theme
      css={`
        & [data-part~='container'] {
          --color-accent: #7048e8;
          --color-text-on-accent: #ffffff;

          padding: 1.25rem;
          border: 1px solid #e9ecef;
          border-radius: 1rem;
          background: #fff;
          box-shadow: 0 10px 30px rgb(0 0 0 / 0.08);
          font-family: system-ui, sans-serif;
        }

        & [data-part~='heading'] {
          font-size: 1rem;
          letter-spacing: 0.02em;
        }

        & [data-part~='weekday'] {
          font-size: 0.75rem;
          font-weight: 600;
          color: #868e96;
          text-transform: uppercase;
        }

        & [data-part~='day'] {
          border-radius: 999px;
          transition: background 120ms ease;
        }

        & [data-part~='previous'],
        & [data-part~='next'] {
          border-radius: 999px;
          background: #f1f3f5;
        }

        & [data-part~='today']:not([aria-pressed='true']) {
          box-shadow: inset 0 0 0 1px var(--color-accent);
        }
      `}
    >
      <CalendarDate
        today={TODAY}
        defaultValue="2026-07-21"
        previous={<ChevronLeft />}
        next={<ChevronRight />}
      >
        <CalendarMonth heading={<CalendarHeading month="long" year="numeric" />} />
      </CalendarDate>
    </Theme>
  ),
};
