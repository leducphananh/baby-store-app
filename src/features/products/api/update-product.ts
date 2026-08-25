import { supabase } from '@/services/supabase/client';
import { getProductErrorMessage } from '../utils/errors';
import type { ProductFormValues } from '../schemas/productSchema';
import type { ProductRow } from '../types/product';

type UpdateProductParams = {
  id: string;
  values: ProductFormValues;
};

/**
 * Updates a product's editable master-data fields. `status` is changed
 * separately via archive/restore, not through this form. This never
 * touches `product_batches`/`inventory_transactions`/order tables — it is
 * a plain single-row update against `products`.
 */
export async function updateProduct({ id, values }: UpdateProductParams): Promise<ProductRow> {
  const { data, error } = await supabase
    .from('products')
    // `products` has no DB trigger to auto-refresh `updated_at` (verified
    // via information_schema.triggers), so it is set explicitly here.
    .update({
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
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(getProductErrorMessage(error));
  }

  return data;
}
