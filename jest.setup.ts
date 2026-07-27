import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// jsdom does not implement `:dir()`, used to detect writing direction.
// Fall back to a `dir` attribute lookup so keyboard tests can exercise RTL.
const originalMatches = Element.prototype.matches;

Element.prototype.matches = function matches(this: Element, selector: string): boolean {
  if (selector === ':dir(ltr)' || selector === ':dir(rtl)') {
    const wanted = selector.slice(5, -1);
    const closest = this.closest('[dir]');
    const dir = closest?.getAttribute('dir') ?? 'ltr';

    return dir === wanted;
  }

  return originalMatches.call(this, selector);
};
