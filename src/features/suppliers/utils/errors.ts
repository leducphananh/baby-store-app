import { getSupabaseErrorMessage } from '@/utils/supabase-error';

/**
 * Postgres error-code overrides for suppliers. Note: `suppliers` currently
 * has NO unique constraint on phone/email/tax_code (verified via
 * pg_constraint/pg_indexes) — this override exists for forward-compatibility
 * in case such a constraint is added later; it does not mean duplicates are
 * actually prevented today. See the Phase 3.2 walkthrough for this gap.
 */
const SUPPLIER_ERROR_OVERRIDES: Record<string, string> = {
  '23505': 'Thông tin nhà cung cấp đã tồn tại.', // unique_violation
};

export function getSupplierErrorMessage(error: unknown): string {
  return getSupabaseErrorMessage(error, SUPPLIER_ERROR_OVERRIDES);
}

/** Thrown when a supplier id does not exist. */
export class SupplierNotFoundError extends Error {
  constructor() {
    super('Không tìm thấy nhà cung cấp.');
    this.name = 'SupplierNotFoundError';
  }
}
