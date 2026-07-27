import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { CalendarMonth } from '../calendar-month/CalendarMonth';
import { Months } from '../calendar-month/Months';
import type { DateRange } from '../utils/hooks';
import { CalendarRange, type CalendarRangeProps } from './CalendarRange';

const meta = {
  title: 'Calendars/CalendarRange',
  component: CalendarRange,
  tags: ['autodocs'],
  args: {
    today: '2026-07-15',
    months: 2,
  },
  render: (args) => (
    <CalendarRange {...args}>
      <Months count={args.months ?? 1} />
    </CalendarRange>
  ),
} satisfies Meta<typeof CalendarRange>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PreselectedRange: Story = {
  args: { defaultValue: ['2026-07-10', '2026-08-02'] },
};

export const SingleMonth: Story = {
  args: { months: 1 },
};

export const PageBySingle: Story = {
  args: { pageBy: 'single' },
};

const ControlledRange = (args: CalendarRangeProps) => {
  const [range, setRange] = useState<DateRange>([]);

  return (
    <>
      <p>
        Selected: <code>{range.join(' → ') || '(none)'}</code>
      </p>
      <CalendarRange {...args} value={range} onChange={setRange}>
        <CalendarMonth />
        <CalendarMonth offset={1} />
      </CalendarRange>
    </>
  );
};

export const Controlled: Story = {
  render: (args) => <ControlledRange {...args} />,
};
