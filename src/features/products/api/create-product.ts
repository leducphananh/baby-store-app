import { supabase } from '@/services/supabase/client';
import { getProductErrorMessage } from '../utils/errors';
import type { ProductFormValues } from '../schemas/productSchema';
import type { ProductRow } from '../types/product';

/**
 * Creates a product. `status` is not part of the form — it defaults to
 * 'active' via the database column default. Price/stock fields are
 * validated as digit strings in the form and converted to `number` only
 * here (never via floating-point parsing — they are whole-VND integers).
 * A duplicate SKU/barcode is rejected by the DB's UNIQUE constraints and
 * mapped to a friendly message in `getProductErrorMessage`.
 */
export async function createProduct(values: ProductFormValues): Promise<ProductRow> {
  const { data, error } = await supabase
    .from('products')
    .insert({
      name: values.name.trim(),
      sku: values.sku,
      barcode: values.barcode || null,
      category_id: values.category_id || null,
      brand: values.brand?.trim() || null,
      unit: values.unit,
      description: values.description?.trim() || null,
      selling_price: Number(values.selling_price),
      default_purchase_price: Number(values.default_purchase_price),
      minimum_stock: Number(values.minimum_stock),
      origin_country: values.origin_country?.trim() || null,
      manufacturer: values.manufacturer?.trim() || null,
      distributor: values.distributor?.trim() || null,
      source_description: values.source_description?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(getProductErrorMessage(error));
  }

  return data;
}
