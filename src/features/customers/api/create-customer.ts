import { supabase } from '@/services/supabase/client';
import { getCustomerErrorMessage } from '../utils/errors';
import { normalizePhone } from '../utils/phone';
import type { CustomerFormValues } from '../schemas/customerSchema';
import type { CustomerRow } from '../types/customer';

/**
 * Creates a customer. `status` is not part of the form — it defaults to
 * 'active' via the database column default. `phone` is normalized (spaces/
 * dashes/dots/parens stripped) before being stored, so visibly different
 * variants of the same number are never saved as inconsistent duplicates.
 * A duplicate phone is rejected by the DB's `customers_phone_key` UNIQUE
 * constraint and mapped to a friendly message in `getCustomerErrorMessage`.
 */
export async function createCustomer(values: CustomerFormValues): Promise<CustomerRow> {
  const { data, error } = await supabase
    .from('customers')
    .insert({
      name: values.name.trim(),
      phone: values.phone ? normalizePhone(values.phone) : null,
      email: values.email ? values.email.toLowerCase() : null,
      address: values.address?.trim() || null,
      notes: values.notes?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(getCustomerErrorMessage(error));
  }

  return data;
}
