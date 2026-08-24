import { supabase } from '@/services/supabase/client';
import { getSupplierErrorMessage } from '../utils/errors';
import type { SupplierRow, SupplierStatusFilter } from '../types/supplier';

type GetSuppliersParams = {
  search?: string;
  status?: SupplierStatusFilter;
};

/**
 * Fetches suppliers, filtered server-side by status (defaults to 'active')
 * and an optional case-insensitive search across name, phone, tax_code and
 * contact_person.
 */
export async function getSuppliers({ search, status = 'active' }: GetSuppliersParams = {}): Promise<SupplierRow[]> {
  let query = supabase.from('suppliers').select('*').order('name', { ascending: true });

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
      query = query.or(
        `name.ilike.${pattern},phone.ilike.${pattern},tax_code.ilike.${pattern},contact_person.ilike.${pattern}`
      );
    }
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(getSupplierErrorMessage(error));
  }

  return data ?? [];
}
