import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { CalendarDate } from '../calendar-date/CalendarDate';
import { CalendarMonth } from '../calendar-month/CalendarMonth';
import { CalendarSelectMonth } from './CalendarSelectMonth';
import { CalendarSelectYear } from './CalendarSelectYear';

const TODAY = '2026-07-15';

function setup(ui: ReactNode, props: { min?: string; max?: string } = {}) {
  const user = userEvent.setup();
  const utils = render(
    <CalendarDate today={TODAY} heading={ui} {...props}>
      <CalendarMonth />
    </CalendarDate>,
  );

  return { user, ...utils };
}

describe('CalendarSelectYear', () => {
  it('offers maxYears centred on the focused year', () => {
    setup(<CalendarSelectYear />);

    const select = screen.getByRole('combobox', { name: 'Year' });
    const options = within(select).getAllByRole('option');

    expect(options).toHaveLength(20);
    expect(options[0]).toHaveValue('2016');
    expect(options.at(-1)).toHaveValue('2035');
    expect(select).toHaveValue('2026');
  });

  it('honours maxYears', () => {
    setup(<CalendarSelectYear maxYears={5} />);

    expect(
      within(screen.getByRole('combobox', { name: 'Year' })).getAllByRole('option'),
    ).toHaveLength(5);
  });

  it('clamps the options to min and max', () => {
    setup(<CalendarSelectYear />, { min: '2025-01-01', max: '2027-12-31' });

    const options = within(screen.getByRole('combobox', { name: 'Year' })).getAllByRole('option');

    expect(options.map((option) => option.getAttribute('value'))).toEqual(['2025', '2026', '2027']);
  });

  it('moves the calendar when a year is picked', async () => {
    const { user } = setup(<CalendarSelectYear />);

    await user.selectOptions(screen.getByRole('combobox', { name: 'Year' }), '2028');

    expect(screen.getByRole('table')).toHaveAccessibleName('July');
    expect(screen.getByRole('group')).toHaveAccessibleName('July 2028');
  });

  it('accepts a custom label', () => {
    setup(<CalendarSelectYear label="Año" />);
    expect(screen.getByRole('combobox', { name: 'Año' })).toBeInTheDocument();
  });
});

describe('CalendarSelectMonth', () => {
  it('lists twelve months and selects the focused one', () => {
    setup(<CalendarSelectMonth />);

    const select = screen.getByRole('combobox', { name: 'Month' });
    const options = within(select).getAllByRole('option');

    expect(options).toHaveLength(12);
    expect(options[0]).toHaveTextContent('January');
    expect(select).toHaveValue('7');
  });

  it('formats month names with the calendar locale', () => {
    render(
      <CalendarDate today={TODAY} locale="es-ES" heading={<CalendarSelectMonth />}>
        <CalendarMonth />
      </CalendarDate>,
    );

    expect(
      within(screen.getByRole('combobox', { name: 'Month' })).getAllByRole('option')[0],
    ).toHaveTextContent('enero');
  });

  it('shortens month names on request', () => {
    setup(<CalendarSelectMonth formatMonth="short" />);

    expect(
      within(screen.getByRole('combobox', { name: 'Month' })).getAllByRole('option')[0],
    ).toHaveTextContent('Jan');
  });

  it('disables months outside min/max', () => {
    setup(<CalendarSelectMonth />, { min: '2026-06-01', max: '2026-08-31' });

    const options = within(screen.getByRole('combobox', { name: 'Month' })).getAllByRole('option');

    expect(options[0]).toBeDisabled();
    expect(options[5]).toBeEnabled();
    expect(options[6]).toBeEnabled();
    expect(options[8]).toBeDisabled();
  });

  it('moves the calendar when a month is picked', async () => {
    const { user } = setup(<CalendarSelectMonth />);

    await user.selectOptions(screen.getByRole('combobox', { name: 'Month' }), '10');

    expect(screen.getByRole('table')).toHaveAccessibleName('October');
  });
});
