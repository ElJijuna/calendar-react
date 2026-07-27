import { render, screen, within } from '@testing-library/react';
import { CalendarDate } from '../calendar-date/CalendarDate';
import { CalendarHeading } from '../calendar-heading/CalendarHeading';
import { CalendarMonth } from './CalendarMonth';

const TODAY = '2026-07-15';

describe('CalendarMonth', () => {
  it('renders one grid per month, offset from the page start', () => {
    render(
      <CalendarDate today={TODAY} months={3}>
        <CalendarMonth />
        <CalendarMonth offset={1} />
        <CalendarMonth offset={2} />
      </CalendarDate>,
    );

    const tables = screen.getAllByRole('table');

    expect(tables).toHaveLength(3);
    expect(tables[0]).toHaveAccessibleName('July');
    expect(tables[1]).toHaveAccessibleName('August');
    expect(tables[2]).toHaveAccessibleName('September');
  });

  it('exposes weekday headers with a long name and a visible abbreviation', () => {
    render(
      <CalendarDate today={TODAY} formatWeekday="short">
        <CalendarMonth />
      </CalendarDate>,
    );

    const [monday] = screen.getAllByRole('columnheader');

    expect(monday).toHaveAccessibleName('Monday');
    expect(monday).toHaveTextContent('Mon');
    expect(monday?.getAttribute('data-part')).toContain('weekday');
  });

  it('uses narrow weekday names by default', () => {
    render(
      <CalendarDate today={TODAY}>
        <CalendarMonth />
      </CalendarDate>,
    );

    expect(screen.getAllByRole('columnheader')[0]).toHaveTextContent('M');
  });

  it('renders a week number column with a custom label', () => {
    render(
      <CalendarDate today={TODAY} showWeekNumbers>
        <CalendarMonth weekNumberLabel="Wk" />
      </CalendarDate>,
    );

    expect(screen.getAllByRole('columnheader')).toHaveLength(8);
    expect(screen.getAllByRole('columnheader')[0]).toHaveTextContent('Wk');
    expect(screen.getAllByRole('rowheader')[0]).toHaveTextContent('27');
  });

  it('accepts a custom month heading', () => {
    render(
      <CalendarDate today={TODAY}>
        <CalendarMonth heading={<CalendarHeading month="short" year="numeric" />} />
      </CalendarDate>,
    );

    expect(screen.getByText('Jul 2026')).toBeInTheDocument();
  });

  it('tags every day cell with its weekday part', () => {
    render(
      <CalendarDate today={TODAY}>
        <CalendarMonth />
      </CalendarDate>,
    );

    // 2026-07-15 is a Wednesday -> day-3
    expect(screen.getByRole('button', { name: 'July 15' }).getAttribute('data-part')).toContain(
      'day-3',
    );
  });

  it('leaves empty cells for outside days by default', () => {
    render(
      <CalendarDate today={TODAY}>
        <CalendarMonth />
      </CalendarDate>,
    );

    const firstWeek = screen.getAllByRole('row')[1] as HTMLElement;

    // July 2026 starts on a Wednesday, so Monday and Tuesday are empty
    expect(within(firstWeek).getAllByRole('cell')[0]).toBeEmptyDOMElement();
    expect(within(firstWeek).getAllByRole('button')).toHaveLength(5);
  });
});
