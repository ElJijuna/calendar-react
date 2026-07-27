import { type ReactNode, type RefObject, useId } from 'react';
import { CalendarHeading } from '../calendar-heading/CalendarHeading';
import { joinParts } from '../utils/parts';
import { visuallyHidden } from '../utils/styles';
import {
  CalendarContext,
  type CalendarContextValue,
  CalendarHeadingContext,
  type CalendarPage,
} from './context';

interface PageButtonProps {
  name: 'previous' | 'next';
  onClick: (() => void) | undefined;
  children: ReactNode;
}

const PageButton = ({ name, onClick, children }: PageButtonProps) => {
  const disabled = !onClick;

  return (
    <button
      type="button"
      part={joinParts('button', name, disabled && 'disabled')}
      data-part={joinParts('button', name, disabled && 'disabled')}
      aria-disabled={disabled || undefined}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export interface CalendarBaseProps {
  context: CalendarContextValue;
  page: CalendarPage;
  locale?: string | undefined;
  containerRef: RefObject<HTMLDivElement | null>;
  previous: (() => void) | undefined;
  next: (() => void) | undefined;
  previousLabel?: ReactNode;
  nextLabel?: ReactNode;
  heading?: ReactNode;
  className?: string | undefined;
  children?: ReactNode;
}

/** Shared chrome (header, paging buttons, live heading) for every calendar. */
export const CalendarBase = ({
  context,
  page,
  locale,
  containerRef,
  previous,
  next,
  previousLabel,
  nextLabel,
  heading,
  className,
  children,
}: CalendarBaseProps) => {
  const headingId = useId();

  return (
    <CalendarContext.Provider value={context}>
      <CalendarHeadingContext.Provider value={{ type: 'range', value: page, locale }}>
        {/* biome-ignore lint/a11y/useSemanticElements: a fieldset would add unwanted form semantics; Cally uses role="group" too */}
        <div
          ref={containerRef}
          role="group"
          aria-labelledby={headingId}
          part="container"
          data-part="container"
          className={className}
        >
          <CalendarHeading
            id={headingId}
            month="long"
            year="numeric"
            style={visuallyHidden}
            aria-live="polite"
            aria-atomic="true"
          />

          <div part="header" data-part="header">
            <PageButton name="previous" onClick={previous}>
              {previousLabel ?? 'Previous'}
            </PageButton>

            <div part="heading" data-part="heading">
              {heading ?? <CalendarHeading year="numeric" aria-hidden="true" />}
            </div>

            <PageButton name="next" onClick={next}>
              {nextLabel ?? 'Next'}
            </PageButton>
          </div>

          <div part="months" data-part="months">
            {children}
          </div>
        </div>
      </CalendarHeadingContext.Provider>
    </CalendarContext.Provider>
  );
};
