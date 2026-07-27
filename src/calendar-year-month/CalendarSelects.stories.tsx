import type { Meta, StoryObj } from '@storybook/react-vite';
import { CalendarDate } from '../calendar-date/CalendarDate';
import { CalendarMonth } from '../calendar-month/CalendarMonth';
import { CalendarSelectMonth } from './CalendarSelectMonth';
import { CalendarSelectYear } from './CalendarSelectYear';

const meta = {
  title: 'Building blocks/Year and month selects',
  component: CalendarSelectYear,
  tags: ['autodocs'],
} satisfies Meta<typeof CalendarSelectYear>;

export default meta;
type Story = StoryObj<typeof meta>;

export const YearSelect: Story = {
  args: { maxYears: 20 },
  render: (args) => (
    <CalendarDate today="2026-07-15" heading={<CalendarSelectYear {...args} />}>
      <CalendarMonth />
    </CalendarDate>
  ),
};

export const MonthAndYear: Story = {
  render: () => (
    <CalendarDate
      today="2026-07-15"
      min="2026-03-01"
      max="2027-09-30"
      heading={
        <span style={{ display: 'flex', gap: '0.5rem' }}>
          <CalendarSelectMonth formatMonth="short" />
          <CalendarSelectYear />
        </span>
      }
    >
      <CalendarMonth />
    </CalendarDate>
  ),
};

export const Localized: Story = {
  render: () => (
    <CalendarDate
      today="2026-07-15"
      locale="es-ES"
      heading={
        <span style={{ display: 'flex', gap: '0.5rem' }}>
          <CalendarSelectMonth label="Mes" />
          <CalendarSelectYear label="Año" />
        </span>
      }
    >
      <CalendarMonth />
    </CalendarDate>
  ),
};
