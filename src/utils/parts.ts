/**
 * Joins part tokens into a single `data-part` attribute value.
 *
 * Mirrors the `part` attribute of the underlying web components, so consumers
 * can style with `[data-part~="selected"]` where they would have used
 * `::part(selected)`.
 */
export function joinParts(...parts: Array<string | false | null | undefined>): string {
  return parts
    .filter((part): part is string => Boolean(part))
    .join(' ')
    .trim()
    .replace(/\s+/g, ' ');
}
