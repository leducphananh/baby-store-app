import { supabase } from '@/services/supabase/client';
import { getCustomerErrorMessage } from '../utils/errors';
import type { CustomerRow, CustomerStatus } from '../types/customer';

async function updateStatus(id: string, status: CustomerStatus): Promise<CustomerRow> {
  const { data, error } = await supabase
    .from('customers')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(getCustomerErrorMessage(error));
  }

  return data;
}

/**
 * Archives a customer (status = 'archived'). This is a soft delete: a
 * customer is referenced by `orders.customer_id`, so historical rows are
 * never hard-deleted — the app never issues a DELETE against `customers`.
 * Archived customers stay in every historical view and simply drop out of
 * the default "active" filter used for new transactions.
 */
export function archiveCustomer(id: string): Promise<CustomerRow> {
  return updateStatus(id, 'archived');
}

/** Restores an archived customer back to active. */
export function restoreCustomer(id: string): Promise<CustomerRow> {
  return updateStatus(id, 'active');
}
