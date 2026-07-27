import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { CalendarMonth } from '../calendar-month/CalendarMonth';
import type { CalendarHandle } from '../types';
import { CalendarRange, type CalendarRangeProps } from './CalendarRange';

const TODAY = '2026-07-15';

function setup(props: Partial<CalendarRangeProps> = {}) {
  const user = userEvent.setup();
  const utils = render(
    <CalendarRange today={TODAY} {...props}>
      <CalendarMonth />
    </CalendarRange>,
  );

  return { user, ...utils };
}

const day = (label: string) => screen.getByRole('button', { name: label });
const partsOf = (label: string) => day(label).getAttribute('data-part') ?? '';

describe('CalendarRange', () => {
  it('selects a range with two clicks', async () => {
    const onChange = jest.fn();
    const { user } = setup({ onChange });

    await user.click(day('July 10'));
    expect(onChange).not.toHaveBeenCalled();

    await user.click(day('July 14'));
    expect(onChange).toHaveBeenCalledWith(['2026-07-10', '2026-07-14']);
  });

  it('sorts a range picked backwards', async () => {
    const onChange = jest.fn();
    const { user } = setup({ onChange });

    await user.click(day('July 20'));
    await user.click(day('July 12'));

    expect(onChange).toHaveBeenCalledWith(['2026-07-12', '2026-07-20']);
  });

  it('fires rangestart and rangeend', async () => {
    const onRangeStart = jest.fn();
    const onRangeEnd = jest.fn();
    const { user } = setup({ onRangeStart, onRangeEnd });

    await user.click(day('July 10'));
    expect(onRangeStart).toHaveBeenCalledWith(new Date('2026-07-10T00:00:00.000Z'));
    expect(onRangeEnd).not.toHaveBeenCalled();

    await user.click(day('July 14'));
    expect(onRangeEnd).toHaveBeenCalledWith(new Date('2026-07-14T00:00:00.000Z'));
  });

  it('marks range start, inner and end parts', () => {
    setup({ value: ['2026-07-10', '2026-07-13'] });

    expect(partsOf('July 10')).toContain('range-start');
    expect(partsOf('July 11')).toContain('range-inner');
    expect(partsOf('July 12')).toContain('range-inner');
    expect(partsOf('July 13')).toContain('range-end');
    expect(partsOf('July 14')).not.toContain('range');
    expect(day('July 11')).toHaveAttribute('aria-pressed', 'true');
  });

  it('previews the range on hover while tentative', async () => {
    const { user } = setup();

    await user.click(day('July 10'));
    await user.hover(day('July 13'));

    expect(partsOf('July 10')).toContain('range-start');
    expect(partsOf('July 12')).toContain('range-inner');
    expect(partsOf('July 13')).toContain('range-end');
  });

  it('previews backwards while tentative', async () => {
    const { user } = setup();

    await user.click(day('July 20'));
    await user.hover(day('July 18'));

    expect(partsOf('July 18')).toContain('range-start');
    expect(partsOf('July 20')).toContain('range-end');
  });

  it('previews while moving with the keyboard', async () => {
    const { user } = setup();

    await user.click(day('July 10'));
    await user.keyboard('{ArrowRight}{ArrowRight}');

    expect(partsOf('July 11')).toContain('range-inner');
    expect(partsOf('July 12')).toContain('range-end');
  });

  it('accepts a controlled tentative start', () => {
    setup({ tentative: '2026-07-08' });

    expect(partsOf('July 8')).toContain('range-start');
  });

  it('does not preview disallowed days on hover', async () => {
    const { user } = setup({ isDateDisallowed: (date) => date.getUTCDate() === 13 });

    await user.click(day('July 10'));
    await user.hover(day('July 13'));

    expect(partsOf('July 12')).not.toContain('range-inner');
  });

  it('starts from defaultValue and focuses its start', () => {
    setup({ defaultValue: ['2026-07-04', '2026-07-06'] });

    expect(partsOf('July 4')).toContain('range-start');
    expect(document.querySelector('[data-part~="day"][tabindex="0"]')).toBe(day('July 4'));
  });

  it('exposes an imperative focus handle', () => {
    const ref = createRef<CalendarHandle>();

    render(
      <CalendarRange ref={ref} today={TODAY}>
        <CalendarMonth />
      </CalendarRange>,
    );

    ref.current?.focus({ target: 'next' });
    expect(document.activeElement).toHaveAccessibleName('Next');
    expect(ref.current?.element).toBe(screen.getByRole('group'));
  });
});
