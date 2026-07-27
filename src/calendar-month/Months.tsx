import { CalendarMonth } from './CalendarMonth';

/** Renders `count` consecutive month grids. Used by the stories. */
export const Months = ({ count }: { count: number }) => (
  <>
    {Array.from({ length: count }, (_, i) => `month-${i}`).map((key, i) => (
      <CalendarMonth key={key} offset={i} />
    ))}
  </>
);
