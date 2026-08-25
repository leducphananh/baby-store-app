/**
 * Formats a whole-VND amount as `"350.000 ₫"`. Implemented manually
 * (thousands-grouping + suffix) rather than via `Intl.NumberFormat` so the
 * output is deterministic across Hermes' ICU data rather than depending on
 * locale/currency-data support. Amounts are always whole VND — this app
 * never uses floating-point arithmetic for monetary values.
 */
export function formatCurrency(amount: number): string {
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? '-' : '';
  const digits = Math.abs(rounded).toString();
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${sign}${grouped} ₫`;
}
