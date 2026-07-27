import type { CSSProperties } from 'react';

/**
 * Visually hidden, but still announced. Inlined so the library works without
 * importing `temporal-calendar-react/styles.css`.
 */
export const visuallyHidden: CSSProperties = {
  position: 'absolute',
  transform: 'scale(0)',
};
