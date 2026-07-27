import { render, screen } from '@testing-library/react';
import { CalendarDate } from '../calendar-date/CalendarDate';
import { CalendarMonth } from '../calendar-month/CalendarMonth';
import { CalendarHeading } from './CalendarHeading';

const TODAY = '2026-07-15';
/** The visible calendar heading, i.e. excluding the live region used for announcements. */
const visibleHeading = () =>
  document.querySelector<HTMLElement>(
    '[data-part~="header"] [data-part~="heading"]',
  ) as HTMLElement;
const monthHeading = () =>
  document.querySelector<HTMLElement>('[data-part~="month"] [data-part~="heading"]') as HTMLElement;

describe('CalendarHeading', () => {
  it('formats the visible page as a range inside a calendar', () => {
    render(
      <CalendarDate today={TODAY} months={2} heading={<CalendarHeading month="short" />}>
        <CalendarMonth />
        <CalendarMonth offset={1} />
      </CalendarDate>,
    );

    const expected = new Intl.DateTimeFormat(undefined, {
      timeZone: 'UTC',
      month: 'short',
    }).formatRange(new Date('2026-07-01T00:00:00Z'), new Date('2026-08-01T00:00:00Z'));

    // `toHaveTextContent` collapses whitespace, and Intl uses thin spaces around the dash
    expect(visibleHeading()).toHaveTextContent(expected.replace(/\s+/g, ' '));
  });

  it('shows only the year by default', () => {
    render(
      <CalendarDate today={TODAY}>
        <CalendarMonth />
      </CalendarDate>,
    );

    expect(visibleHeading()).toHaveTextContent('2026');
    expect(visibleHeading()).not.toHaveTextContent('July');
  });

  it('formats a single month inside CalendarMonth', () => {
    render(
      <CalendarDate today={TODAY}>
        <CalendarMonth heading={<CalendarHeading month="long" year="numeric" />} />
      </CalendarDate>,
    );

    expect(monthHeading()).toHaveTextContent('July 2026');
  });

  it('follows the calendar locale', () => {
    render(
      <CalendarDate today={TODAY} locale="ja-JP">
        <CalendarMonth heading={<CalendarHeading month="long" year="numeric" />} />
      </CalendarDate>,
    );

    expect(monthHeading()).toHaveTextContent('2026年7月');
  });

  it('renders standalone with the current month', () => {
    render(<CalendarHeading month="long" year="numeric" data-testid="heading" />);

    const now = new Date();
    const expected = new Intl.DateTimeFormat(undefined, {
      timeZone: 'UTC',
      month: 'long',
      year: 'numeric',
    }).format(new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1)));

    expect(screen.getByTestId('heading')).toHaveTextContent(expected);
  });

  it('forwards extra props to the rendered element', () => {
    render(<CalendarHeading year="numeric" className="custom" data-testid="heading" />);

    expect(screen.getByTestId('heading')).toHaveClass('custom');
  });
});
