/**
 * Normalizes a phone number for storage and comparison: trims whitespace
 * and strips common separators (spaces, dashes, dots, parentheses) so
 * visibly different variants of the same number — "098 123 4567",
 * "098-123-4567", "0981234567" — are stored consistently and correctly
 * collide against the `customers.phone` UNIQUE constraint.
 *
 * This is intentionally simple: it only affects values entered through the
 * app going forward and never rewrites existing historical rows.
 */
export function normalizePhone(value: string): string {
  return value.trim().replace(/[\s\-.()]/g, '');
}
