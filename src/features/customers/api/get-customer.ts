import { supabase } from '@/services/supabase/client';
import { CustomerNotFoundError, getCustomerErrorMessage } from '../utils/errors';
import type { CustomerRow } from '../types/customer';

/** Fetches a single customer by id. Throws `CustomerNotFoundError` if it does not exist. */
export async function getCustomerById(id: string): Promise<CustomerRow> {
  const { data, error } = await supabase.from('customers').select('*').eq('id', id).maybeSingle();

  if (error) {
    throw new Error(getCustomerErrorMessage(error));
  }

  if (!data) {
    throw new CustomerNotFoundError();
  }

  return data;
}
