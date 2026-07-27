import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { CalendarDate } from './calendar-date/CalendarDate';
import { CalendarMonth } from './calendar-month/CalendarMonth';
import { CalendarMulti } from './calendar-multi/CalendarMulti';
import { CalendarRange } from './calendar-range/CalendarRange';
import { CalendarSelectMonth } from './calendar-year-month/CalendarSelectMonth';
import { CalendarSelectYear } from './calendar-year-month/CalendarSelectYear';

const TODAY = '2026-07-15';

describe('accessibility', () => {
  it('CalendarDate has no violations', async () => {
    const { container } = render(
      <CalendarDate today={TODAY} defaultValue="2026-07-15" showWeekNumbers showOutsideDays>
        <CalendarMonth />
      </CalendarDate>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('CalendarRange has no violations across two months', async () => {
    const { container } = render(
      <CalendarRange today={TODAY} months={2} defaultValue={['2026-07-10', '2026-08-02']}>
        <CalendarMonth />
        <CalendarMonth offset={1} />
      </CalendarRange>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('CalendarMulti has no violations', async () => {
    const { container } = render(
      <CalendarMulti today={TODAY} defaultValue={['2026-07-10', '2026-07-12']}>
        <CalendarMonth />
      </CalendarMulti>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('the year and month selects have no violations', async () => {
    const { container } = render(
      <CalendarDate
        today={TODAY}
        heading={
          <>
            <CalendarSelectMonth />
            <CalendarSelectYear />
          </>
        }
      >
        <CalendarMonth />
      </CalendarDate>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
