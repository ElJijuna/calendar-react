import type { Meta, StoryObj } from '@storybook/react-vite';
import { CalendarDate } from '../calendar-date/CalendarDate';
import { CalendarHeading } from '../calendar-heading/CalendarHeading';
import { CalendarMonth } from './CalendarMonth';

const meta = {
  title: 'Building blocks/CalendarMonth',
  component: CalendarMonth,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CalendarDate today="2026-07-15" months={3} showWeekNumbers>
        <Story />
      </CalendarDate>
    ),
  ],
} satisfies Meta<typeof CalendarMonth>;

export default meta;
type Story = StoryObj<typeof meta>;

/** `offset` picks which month of the page to render. */
export const Offset: Story = {
  args: { offset: 1 },
};

export const CustomHeading: Story = {
  args: {
    heading: <CalendarHeading month="short" year="2-digit" />,
  },
};

export const CustomWeekNumberLabel: Story = {
  args: { weekNumberLabel: 'Wk' },
};
