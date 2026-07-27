import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { CalendarMonth } from '../calendar-month/CalendarMonth';
import type { CalendarHandle } from '../types';
import { CalendarDate, type CalendarDateProps } from './CalendarDate';

const TODAY = '2026-07-15';

function setup(props: Partial<CalendarDateProps> = {}) {
  const user = userEvent.setup();
  const utils = render(
    <CalendarDate today={TODAY} {...props}>
      <CalendarMonth />
    </CalendarDate>,
  );

  return { user, ...utils };
}

const day = (label: string) => screen.getByRole('button', { name: label });
/** Intl inserts locale-specific separators into ranges, so build the expectation with Intl too. */
const pageName = (start: string, end: string, locale?: string) =>
  new Intl.DateTimeFormat(locale, {
    timeZone: 'UTC',
    month: 'long',
    year: 'numeric',
  }).formatRange(new Date(start), new Date(end));
const focusedDay = () =>
  document.querySelector<HTMLButtonElement>('[data-part~="day"][tabindex="0"]');

describe('CalendarDate', () => {
  it('renders a labelled group with a month grid', () => {
    setup();

    expect(screen.getByRole('group')).toHaveAccessibleName('July 2026');
    expect(screen.getByRole('table')).toHaveAccessibleName('July');
    expect(screen.getAllByRole('columnheader')).toHaveLength(7);
    // 5 weeks in July 2026 when weeks start on Monday
    expect(screen.getAllByRole('row')).toHaveLength(6);
  });

  it('starts weeks on Monday by default and honours firstDayOfWeek', () => {
    const { rerender } = setup();

    expect(screen.getAllByRole('columnheader')[0]).toHaveAccessibleName('Monday');

    rerender(
      <CalendarDate today={TODAY} firstDayOfWeek={0}>
        <CalendarMonth />
      </CalendarDate>,
    );
    expect(screen.getAllByRole('columnheader')[0]).toHaveAccessibleName('Sunday');
  });

  it('marks today with aria-current and a today part', () => {
    setup();

    const today = day('July 15');

    expect(today).toHaveAttribute('aria-current', 'date');
    expect(today.getAttribute('data-part')).toContain('today');
  });

  it('selects a day when uncontrolled and reports the ISO value', async () => {
    const onChange = jest.fn();
    const { user } = setup({ onChange });

    await user.click(day('July 20'));

    expect(onChange).toHaveBeenCalledWith('2026-07-20');
    expect(day('July 20')).toHaveAttribute('aria-pressed', 'true');
  });

  it('does not update its own value when controlled', async () => {
    const onChange = jest.fn();
    const { user } = setup({ value: '2026-07-10', onChange });

    await user.click(day('July 20'));

    expect(onChange).toHaveBeenCalledWith('2026-07-20');
    expect(day('July 10')).toHaveAttribute('aria-pressed', 'true');
    expect(day('July 20')).toHaveAttribute('aria-pressed', 'false');
  });

  it('respects defaultValue and focuses the selected day', () => {
    setup({ defaultValue: '2026-07-09' });

    expect(day('July 9')).toHaveAttribute('aria-pressed', 'true');
    expect(focusedDay()).toBe(day('July 9'));
  });

  it('disables days outside min/max', () => {
    setup({ min: '2026-07-10', max: '2026-07-20' });

    expect(day('July 9')).toBeDisabled();
    expect(day('July 10')).toBeEnabled();
    expect(day('July 21')).toBeDisabled();
  });

  it('marks disallowed days as aria-disabled and ignores clicks', async () => {
    const onChange = jest.fn();
    const { user } = setup({
      onChange,
      isDateDisallowed: (date) => date.getUTCDate() === 20,
    });
    const disallowed = day('July 20');

    expect(disallowed).toHaveAttribute('aria-disabled', 'true');
    expect(disallowed.getAttribute('data-part')).toContain('disallowed');

    await user.click(disallowed);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('hides outside days unless showOutsideDays is set', () => {
    const { rerender } = setup();

    expect(screen.queryByRole('button', { name: 'June 29' })).not.toBeInTheDocument();

    rerender(
      <CalendarDate today={TODAY} showOutsideDays>
        <CalendarMonth />
      </CalendarDate>,
    );

    const outside = day('June 29');

    expect(outside.getAttribute('data-part')).toContain('outside');
  });

  it('renders ISO week numbers on request', () => {
    setup({ showWeekNumbers: true });

    const weekNumbers = screen.getAllByRole('rowheader').map((cell) => cell.textContent);

    expect(weekNumbers).toEqual(['27', '28', '29', '30', '31']);
  });

  it('formats headings and day names for the given locale', () => {
    setup({ locale: 'es-ES' });

    expect(screen.getByRole('group')).toHaveAccessibleName('julio de 2026');
    expect(screen.getAllByRole('columnheader')[0]).toHaveAccessibleName('lunes');
  });

  it('renders several months and pages by view', async () => {
    const onPageChange = jest.fn();
    const user = userEvent.setup();

    render(
      <CalendarDate today={TODAY} months={2} onPageChange={onPageChange}>
        <CalendarMonth />
        <CalendarMonth offset={1} />
      </CalendarDate>,
    );

    expect(screen.getByRole('group')).toHaveAccessibleName(pageName('2026-07-01', '2026-08-01'));

    await user.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByRole('group')).toHaveAccessibleName(pageName('2026-09-01', '2026-10-01'));
    expect(onPageChange).toHaveBeenCalledWith({
      start: new Date('2026-09-01T00:00:00.000Z'),
      end: new Date('2026-10-31T00:00:00.000Z'),
    });
  });

  it('pages one month at a time with pageBy="single"', async () => {
    const user = userEvent.setup();

    render(
      <CalendarDate today={TODAY} months={2} pageBy="single">
        <CalendarMonth />
        <CalendarMonth offset={1} />
      </CalendarDate>,
    );

    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByRole('group')).toHaveAccessibleName(pageName('2026-08-01', '2026-09-01'));
  });

  it('marks paging buttons as disabled at the bounds', () => {
    setup({ min: '2026-07-01', max: '2026-07-31' });

    const previous = screen.getByRole('button', { name: 'Previous' });

    expect(previous).toHaveAttribute('aria-disabled', 'true');
    expect(previous.getAttribute('data-part')).toContain('disabled');
    expect(screen.getByRole('button', { name: 'Next' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('does not steal focus on mount', () => {
    setup({ defaultValue: '2026-07-09' });
    expect(document.body).toHaveFocus();
  });

  describe('keyboard', () => {
    it.each([
      ['{ArrowRight}', 'July 16'],
      ['{ArrowLeft}', 'July 14'],
      ['{ArrowDown}', 'July 22'],
      ['{ArrowUp}', 'July 8'],
      ['{Home}', 'July 13'],
      ['{End}', 'July 19'],
      ['{PageUp}', 'June 15'],
      ['{PageDown}', 'August 15'],
      ['{Shift>}{PageUp}{/Shift}', 'July 15'],
    ])('%s moves focus to %s', async (keys, expected) => {
      const { user } = setup();

      await user.click(day('July 15'));
      await user.keyboard(keys);

      expect(document.activeElement).toHaveAccessibleName(expected);
    });

    it('moves by a year with shift+PageUp/PageDown', async () => {
      const onFocusDay = jest.fn();
      const { user } = setup({ onFocusDay });

      await user.click(day('July 15'));
      onFocusDay.mockClear();
      await user.keyboard('{Shift>}{PageDown}{/Shift}');

      expect(onFocusDay).toHaveBeenCalledWith(new Date('2027-07-15T00:00:00.000Z'));
    });

    it('inverts left/right in RTL', async () => {
      const user = userEvent.setup();

      render(
        <div dir="rtl">
          <CalendarDate today={TODAY}>
            <CalendarMonth />
          </CalendarDate>
        </div>,
      );

      await user.click(day('July 15'));
      await user.keyboard('{ArrowRight}');

      expect(document.activeElement).toHaveAccessibleName('July 14');
    });

    it('clamps movement to min/max', async () => {
      const { user } = setup({ min: '2026-07-14', max: '2026-07-16' });

      await user.click(day('July 15'));
      await user.keyboard('{ArrowUp}');

      expect(document.activeElement).toHaveAccessibleName('July 14');
    });

    it('keeps a single day in the tab order', async () => {
      const { user } = setup();

      await user.click(day('July 20'));

      const tabbable = document.querySelectorAll('[data-part~="day"][tabindex="0"]');

      expect(tabbable).toHaveLength(1);
      expect(tabbable[0]).toHaveAccessibleName('July 20');
    });

    it('pages the view when focus leaves the visible month', async () => {
      const { user } = setup();

      await user.click(day('July 31'));
      await user.keyboard('{ArrowRight}');

      expect(screen.getByRole('group')).toHaveAccessibleName('August 2026');
      expect(document.activeElement).toHaveAccessibleName('August 1');
    });

    it('ignores unrelated keys', async () => {
      const { user } = setup();

      await user.click(day('July 15'));
      await user.keyboard('a');

      expect(document.activeElement).toHaveAccessibleName('July 15');
    });
  });

  describe('imperative focus', () => {
    it('focuses the active day, previous and next buttons', () => {
      const ref = createRef<CalendarHandle>();

      render(
        <CalendarDate ref={ref} today={TODAY}>
          <CalendarMonth />
        </CalendarDate>,
      );

      ref.current?.focus();
      expect(document.activeElement).toHaveAccessibleName('July 15');

      ref.current?.focus({ target: 'previous' });
      expect(document.activeElement).toHaveAccessibleName('Previous');

      ref.current?.focus({ target: 'next' });
      expect(document.activeElement).toHaveAccessibleName('Next');
    });

    it('exposes the container element', () => {
      const ref = createRef<CalendarHandle>();

      render(
        <CalendarDate ref={ref} today={TODAY}>
          <CalendarMonth />
        </CalendarDate>,
      );

      expect(ref.current?.element).toBe(screen.getByRole('group'));
    });
  });

  it('supports custom paging labels and headings', () => {
    setup({ previous: '←', next: '→', heading: <span>Custom heading</span> });

    expect(screen.getByRole('button', { name: '←' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '→' })).toBeInTheDocument();
    expect(screen.getByText('Custom heading')).toBeInTheDocument();
  });

  it('adds custom day parts', () => {
    setup({ getDayParts: (date) => (date.getUTCDate() === 4 ? 'holiday' : '') });

    expect(day('July 4').getAttribute('data-part')).toContain('holiday');
  });
});
