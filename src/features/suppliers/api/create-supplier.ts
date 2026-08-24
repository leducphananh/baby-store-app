import { supabase } from '@/services/supabase/client';
import { getSupplierErrorMessage } from '../utils/errors';
import type { SupplierFormValues } from '../schemas/supplierSchema';
import type { SupplierRow } from '../types/supplier';

/**
 * Creates a supplier. `status` is not part of the form — it defaults to
 * 'active' via the database column default.
 *
 * No duplicate pre-check is performed: the `suppliers` table has no unique
 * constraint on phone/email/tax_code (verified via pg_constraint/pg_indexes
 * — see the Phase 3.2 walkthrough for this schema gap), so implementing one
 * here would falsely imply duplicates are prevented.
 */
export async function createSupplier(values: SupplierFormValues): Promise<SupplierRow> {
  const { data, error } = await supabase
    .from('suppliers')
    .insert({
      name: values.name.trim(),
      phone: values.phone?.trim() || null,
      email: values.email?.trim() || null,
      address: values.address?.trim() || null,
      tax_code: values.tax_code?.trim() || null,
      contact_person: values.contact_person?.trim() || null,
      notes: values.notes?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(getSupplierErrorMessage(error));
  }

  return data;
}
