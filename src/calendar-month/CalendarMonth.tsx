import { type ReactNode, useId } from 'react';
import { CalendarHeadingContext, useCalendarContext } from '../calendar-base/context';
import { CalendarHeading } from '../calendar-heading/CalendarHeading';
import { getWeekNumber } from '../utils/date';
import { joinParts } from '../utils/parts';
import { visuallyHidden } from '../utils/styles';
import { useCalendarMonth } from './useCalendarMonth';

const mapToDayNumber = (firstDayOfWeek: number, i: number) => (i + firstDayOfWeek) % 7;

export interface CalendarMonthProps {
  /** Which month to render, relative to the start of the page. Defaults to 0. */
  offset?: number;
  /** Replaces the visible month heading. */
  heading?: ReactNode;
  /** Heading of the week number column. Defaults to "#". */
  weekNumberLabel?: ReactNode;
  className?: string;
}

/** A single month grid. Must be rendered inside one of the calendar components. */
export const CalendarMonth = ({
  offset = 0,
  heading,
  weekNumberLabel,
  className,
}: CalendarMonthProps) => {
  const context = useCalendarContext();
  const headingId = useId();
  const calendar = useCalendarMonth({ offset, context });

  return (
    <CalendarHeadingContext.Provider
      value={{ type: 'date', value: calendar.yearMonth, locale: context.locale }}
    >
      <div part="month" data-part="month" className={className}>
        <CalendarHeading id={headingId} month="long" style={visuallyHidden} />

        <div part="heading" data-part="heading">
          {heading ?? <CalendarHeading month="long" aria-hidden="true" />}
        </div>

        <table aria-labelledby={headingId} part="table" data-part="table">
          <colgroup>
            {context.showWeekNumbers && <col part="col-weeknumber" data-part="col-weeknumber" />}
            {[1, 2, 3, 4, 5, 6, 7].map((column) => (
              <col key={column} part={`col-${column}`} data-part={`col-${column}`} />
            ))}
          </colgroup>

          <thead>
            <tr part="tr head" data-part="tr head">
              {context.showWeekNumbers && (
                <th part="th weeknumber" data-part="th weeknumber">
                  {weekNumberLabel ?? (
                    <>
                      <span style={visuallyHidden}>Week</span>
                      <span aria-hidden="true">#</span>
                    </>
                  )}
                </th>
              )}

              {calendar.daysLong.map((dayName, i) => {
                const dayNumber = mapToDayNumber(context.firstDayOfWeek, i);
                const parts = joinParts('th', 'weekday', 'day', `day-${dayNumber}`);

                return (
                  <th key={dayName} part={parts} data-part={parts} scope="col">
                    <span style={visuallyHidden}>{dayName}</span>
                    <span aria-hidden="true">{calendar.daysVisible[i]}</span>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {calendar.weeks.map((week) => (
              <tr key={week[0].toString()} part="tr week" data-part="tr week">
                {context.showWeekNumbers && (
                  <th part="th weeknumber" data-part="th weeknumber" scope="row">
                    {getWeekNumber(week[0])}
                  </th>
                )}

                {week.map((date) => {
                  const dayProps = calendar.getDayProps(date);

                  return (
                    <td key={date.toString()} part="td" data-part="td">
                      {dayProps && (
                        <button type="button" {...dayProps}>
                          {date.day}
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CalendarHeadingContext.Provider>
  );
};
