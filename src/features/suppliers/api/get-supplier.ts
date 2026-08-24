import { supabase } from '@/services/supabase/client';
import { SupplierNotFoundError, getSupplierErrorMessage } from '../utils/errors';
import type { SupplierRow } from '../types/supplier';

/** Fetches a single supplier by id. Throws `SupplierNotFoundError` if it does not exist. */
export async function getSupplierById(id: string): Promise<SupplierRow> {
  const { data, error } = await supabase.from('suppliers').select('*').eq('id', id).maybeSingle();

  if (error) {
    throw new Error(getSupplierErrorMessage(error));
  }

  if (!data) {
    throw new SupplierNotFoundError();
  }

  return data;
}
