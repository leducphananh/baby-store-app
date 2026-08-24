import { supabase } from '@/services/supabase/client';
import { getSupplierErrorMessage } from '../utils/errors';
import type { SupplierRow, SupplierStatus } from '../types/supplier';

async function updateStatus(id: string, status: SupplierStatus): Promise<SupplierRow> {
  const { data, error } = await supabase
    .from('suppliers')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(getSupplierErrorMessage(error));
  }

  return data;
}

/**
 * Archives a supplier (status = 'archived'). This is a soft delete: a
 * supplier may be referenced by import receipts / purchase invoices in a
 * later phase, so historical rows are never hard-deleted — the
 * `import_receipts.supplier_id` foreign key is `ON DELETE RESTRICT`
 * (verified via pg schema inspection), and the app never issues a DELETE
 * against `suppliers`.
 */
export function archiveSupplier(id: string): Promise<SupplierRow> {
  return updateStatus(id, 'archived');
}

/** Restores an archived supplier back to active. */
export function restoreSupplier(id: string): Promise<SupplierRow> {
  return updateStatus(id, 'active');
}
