import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { CalendarHeading } from '../calendar-heading/CalendarHeading';
import { CalendarMonth } from '../calendar-month/CalendarMonth';
import { Months } from '../calendar-month/Months';
import { CalendarSelectMonth } from '../calendar-year-month/CalendarSelectMonth';
import { CalendarSelectYear } from '../calendar-year-month/CalendarSelectYear';
import { CalendarDate, type CalendarDateProps } from './CalendarDate';

const meta = {
  title: 'Calendars/CalendarDate',
  component: CalendarDate,
  tags: ['autodocs'],
  args: {
    today: '2026-07-15',
    defaultValue: '2026-07-15',
  },
  argTypes: {
    firstDayOfWeek: { control: { type: 'inline-radio' }, options: [0, 1, 6] },
    pageBy: { control: { type: 'inline-radio' }, options: ['months', 'single'] },
    formatWeekday: { control: { type: 'inline-radio' }, options: ['narrow', 'short'] },
    months: { control: { type: 'number', min: 1, max: 12 } },
  },
  render: (args) => (
    <CalendarDate {...args}>
      <Months count={args.months ?? 1} />
    </CalendarDate>
  ),
} satisfies Meta<typeof CalendarDate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TwoMonths: Story = {
  args: { months: 2 },
};

export const WeekNumbersAndOutsideDays: Story = {
  args: { showWeekNumbers: true, showOutsideDays: true },
};

export const Bounded: Story = {
  args: { min: '2026-07-06', max: '2026-07-24' },
};

export const WeekendsDisallowed: Story = {
  args: {
    isDateDisallowed: (date: Date) => [0, 6].includes(date.getUTCDay()),
  },
};

export const Localized: Story = {
  args: { locale: 'es-ES', formatWeekday: 'short' },
};

export const WithYearAndMonthSelects: Story = {
  args: {
    heading: (
      <span style={{ display: 'flex', gap: '0.5rem' }}>
        <CalendarSelectMonth formatMonth="short" />
        <CalendarSelectYear maxYears={30} />
      </span>
    ),
  },
};

export const CustomChrome: Story = {
  args: {
    previous: '←',
    next: '→',
  },
  render: (args) => (
    <CalendarDate {...args}>
      <CalendarMonth heading={<CalendarHeading month="long" year="numeric" />} />
    </CalendarDate>
  ),
};

const ControlledDate = (args: CalendarDateProps) => {
  const [value, setValue] = useState('2026-07-15');

  return (
    <>
      <p>
        Selected: <code>{value || '(none)'}</code>
      </p>
      <CalendarDate {...args} value={value} onChange={setValue}>
        <CalendarMonth />
      </CalendarDate>
    </>
  );
};

export const Controlled: Story = {
  render: (args) => <ControlledDate {...args} />,
};
