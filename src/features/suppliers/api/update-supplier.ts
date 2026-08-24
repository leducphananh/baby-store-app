import { supabase } from '@/services/supabase/client';
import { getSupplierErrorMessage } from '../utils/errors';
import type { SupplierFormValues } from '../schemas/supplierSchema';
import type { SupplierRow } from '../types/supplier';

type UpdateSupplierParams = {
  id: string;
  values: SupplierFormValues;
};

/**
 * Updates a supplier's editable fields. `status` is changed separately via
 * archive/restore, not through this form.
 */
export async function updateSupplier({ id, values }: UpdateSupplierParams): Promise<SupplierRow> {
  const { data, error } = await supabase
    .from('suppliers')
    // `suppliers` has no DB trigger to auto-refresh `updated_at` (verified
    // via information_schema.triggers), so it is set explicitly here.
    .update({
      name: values.name.trim(),
      phone: values.phone?.trim() || null,
      email: values.email?.trim() || null,
      address: values.address?.trim() || null,
      tax_code: values.tax_code?.trim() || null,
      contact_person: values.contact_person?.trim() || null,
      notes: values.notes?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(getSupplierErrorMessage(error));
  }

  return data;
}
