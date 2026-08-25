import { supabase } from '@/services/supabase/client';
import { getCustomerErrorMessage } from '../utils/errors';
import { normalizePhone } from '../utils/phone';
import type { CustomerFormValues } from '../schemas/customerSchema';
import type { CustomerRow } from '../types/customer';

type UpdateCustomerParams = {
  id: string;
  values: CustomerFormValues;
};

/**
 * Updates a customer's editable fields. `status` is changed separately via
 * archive/restore, not through this form. `phone` is normalized the same
 * way as on create — see `createCustomer`.
 */
export async function updateCustomer({ id, values }: UpdateCustomerParams): Promise<CustomerRow> {
  const { data, error } = await supabase
    .from('customers')
    // `customers` has no DB trigger to auto-refresh `updated_at` (verified
    // via information_schema.triggers), so it is set explicitly here.
    .update({
      name: values.name.trim(),
      phone: values.phone ? normalizePhone(values.phone) : null,
      email: values.email ? values.email.toLowerCase() : null,
      address: values.address?.trim() || null,
      notes: values.notes?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(getCustomerErrorMessage(error));
  }

  return data;
}
