import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { CalendarMonth } from '../calendar-month/CalendarMonth';
import { Months } from '../calendar-month/Months';
import { CalendarMulti, type CalendarMultiProps } from './CalendarMulti';

const meta = {
  title: 'Calendars/CalendarMulti',
  component: CalendarMulti,
  tags: ['autodocs'],
  args: {
    today: '2026-07-15',
  },
  render: (args) => (
    <CalendarMulti {...args}>
      <Months count={args.months ?? 1} />
    </CalendarMulti>
  ),
} satisfies Meta<typeof CalendarMulti>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Preselected: Story = {
  args: { defaultValue: ['2026-07-06', '2026-07-13', '2026-07-20'] },
};

export const WithWeekNumbers: Story = {
  args: { showWeekNumbers: true, months: 2 },
};

const ControlledMulti = (args: CalendarMultiProps) => {
  const [dates, setDates] = useState<string[]>([]);

  return (
    <>
      <p>
        Selected: <code>{dates.join(', ') || '(none)'}</code>
      </p>
      <CalendarMulti {...args} value={dates} onChange={setDates}>
        <CalendarMonth />
      </CalendarMulti>
    </>
  );
};

export const Controlled: Story = {
  render: (args) => <ControlledMulti {...args} />,
};
