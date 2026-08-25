import { getSupabaseErrorMessage } from '@/utils/supabase-error';

/**
 * Postgres error-code overrides for customers. `customers.phone` has a real
 * UNIQUE constraint (`customers_phone_key`, verified via pg_constraint), so
 * a 23505 unique_violation on this table always means a duplicate phone
 * number — unlike suppliers, which has no such constraint.
 */
const CUSTOMER_ERROR_OVERRIDES: Record<string, string> = {
  '23505': 'Số điện thoại này đã được sử dụng cho một khách hàng khác.',
};

export function getCustomerErrorMessage(error: unknown): string {
  return getSupabaseErrorMessage(error, CUSTOMER_ERROR_OVERRIDES);
}

/** Thrown when a customer id does not exist. */
export class CustomerNotFoundError extends Error {
  constructor() {
    super('Không tìm thấy khách hàng.');
    this.name = 'CustomerNotFoundError';
  }
}
