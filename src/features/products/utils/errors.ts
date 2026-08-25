import { getSupabaseErrorMessage } from '@/utils/supabase-error';

/**
 * `products` has TWO unique constraints (`products_sku_key`,
 * `products_barcode_key`, verified via pg_constraint), both raising the
 * same Postgres code `23505`. A single code→message map (as used by
 * Categories/Suppliers/Customers) can't distinguish which column collided,
 * so this inspects the error text for the constraint name instead.
 */
function isUniqueViolation(error: unknown): error is { code: string; message?: string; details?: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: unknown }).code === '23505'
  );
}

export function getProductErrorMessage(error: unknown): string {
  if (isUniqueViolation(error)) {
    const text = `${error.message ?? ''} ${error.details ?? ''}`.toLowerCase();
    if (text.includes('sku')) {
      return 'Mã SKU này đã tồn tại.';
    }
    if (text.includes('barcode')) {
      return 'Mã vạch này đã tồn tại.';
    }
    return 'Dữ liệu này đã tồn tại.';
  }

  return getSupabaseErrorMessage(error);
}

/** Thrown when a product id does not exist. */
export class ProductNotFoundError extends Error {
  constructor() {
    super('Không tìm thấy sản phẩm.');
    this.name = 'ProductNotFoundError';
  }
}
