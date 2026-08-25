import { supabase } from '@/services/supabase/client';
import { getCustomerErrorMessage } from '../utils/errors';
import type { CustomerRow, CustomerStatusFilter } from '../types/customer';

type GetCustomersParams = {
  search?: string;
  status?: CustomerStatusFilter;
};

/**
 * Fetches customers, filtered server-side by status (defaults to 'active')
 * and an optional case-insensitive search across name, phone and email.
 * Phone is a major search key for fast store operation, so it is always
 * included alongside name/email rather than requiring a separate search
 * mode.
 */
export async function getCustomers({ search, status = 'active' }: GetCustomersParams = {}): Promise<CustomerRow[]> {
  let query = supabase.from('customers').select('*').order('name', { ascending: true });

  if (status !== 'all') {
    query = query.eq('status', status);
  }

  const trimmedSearch = search?.trim();
  if (trimmedSearch) {
    // `,` and `()` are structural characters in PostgREST's `or=` filter
    // syntax — strip them from the needle so a search term containing them
    // cannot break the query.
    const sanitized = trimmedSearch.replace(/[,()]/g, '').trim();
    if (sanitized) {
      const pattern = `%${sanitized}%`;
      query = query.or(`name.ilike.${pattern},phone.ilike.${pattern},email.ilike.${pattern}`);
    }
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(getCustomerErrorMessage(error));
  }

  return data ?? [];
}
