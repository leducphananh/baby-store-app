/**
 * `products.unit` is a plain TEXT column (no units table in this phase — see
 * the Phase 3.4 walkthrough for the documented future schema gap around
 * packaging/unit conversion). This is the application-level list of allowed
 * values; the one pre-existing row in the database uses `'box'`, which is
 * already covered here, so no persisted value needs to change.
 */
export const PRODUCT_UNITS = [
  { value: 'piece', label: 'Miếng' },
  { value: 'pack', label: 'Gói' },
  { value: 'box', label: 'Hộp' },
  { value: 'bottle', label: 'Bình/Chai' },
  { value: 'can', label: 'Lon' },
  { value: 'bag', label: 'Túi' },
  { value: 'g', label: 'Gram' },
  { value: 'kg', label: 'Kg' },
  { value: 'ml', label: 'ml' },
  { value: 'l', label: 'Lít' },
] as const;

export type ProductUnitValue = (typeof PRODUCT_UNITS)[number]['value'];

/** Vietnamese label for a unit value; falls back to the raw value for forward-compat with data outside this list. */
export function getProductUnitLabel(unit: string): string {
  return PRODUCT_UNITS.find((option) => option.value === unit)?.label ?? unit;
}
