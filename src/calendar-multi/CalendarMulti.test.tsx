import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { CalendarMonth } from '../calendar-month/CalendarMonth';
import type { CalendarHandle } from '../types';
import { CalendarMulti, type CalendarMultiProps } from './CalendarMulti';

const TODAY = '2026-07-15';

function setup(props: Partial<CalendarMultiProps> = {}) {
  const user = userEvent.setup();
  const utils = render(
    <CalendarMulti today={TODAY} {...props}>
      <CalendarMonth />
    </CalendarMulti>,
  );

  return { user, ...utils };
}

const day = (label: string) => screen.getByRole('button', { name: label });
const Controlled = () => {
  const [value, setValue] = useState<string[]>([]);

  return (
    <CalendarMulti today={TODAY} value={value} onChange={setValue}>
      <CalendarMonth />
    </CalendarMulti>
  );
};

describe('CalendarMulti', () => {
  it('adds dates as they are clicked', async () => {
    const onChange = jest.fn();
    const { user } = setup({ onChange });

    await user.click(day('July 10'));
    expect(onChange).toHaveBeenLastCalledWith(['2026-07-10']);

    await user.click(day('July 12'));
    expect(onChange).toHaveBeenLastCalledWith(['2026-07-10', '2026-07-12']);
  });

  it('removes a date when it is clicked again', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();

    render(<Controlled />);

    await user.click(day('July 10'));
    await user.click(day('July 12'));
    expect(day('July 10')).toHaveAttribute('aria-pressed', 'true');

    await user.click(day('July 10'));
    expect(day('July 10')).toHaveAttribute('aria-pressed', 'false');
    expect(day('July 12')).toHaveAttribute('aria-pressed', 'true');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders a defaultValue as selected', () => {
    setup({ defaultValue: ['2026-07-02', '2026-07-20'] });

    expect(day('July 2')).toHaveAttribute('aria-pressed', 'true');
    expect(day('July 20')).toHaveAttribute('aria-pressed', 'true');
    expect(day('July 3')).toHaveAttribute('aria-pressed', 'false');
  });

  it('ignores invalid entries in the value', () => {
    setup({ value: ['nope', '2026-07-20'] });

    expect(day('July 20')).toHaveAttribute('aria-pressed', 'true');
  });

  it('exposes an imperative focus handle', () => {
    const ref = createRef<CalendarHandle>();

    render(
      <CalendarMulti ref={ref} today={TODAY}>
        <CalendarMonth />
      </CalendarMulti>,
    );

    ref.current?.focus();
    expect(document.activeElement).toHaveAccessibleName('July 15');
    expect(ref.current?.element).toBe(screen.getByRole('group'));
  });
});
