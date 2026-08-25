import { z } from 'zod';

// Whole VND / integer-only fields. Kept as validated digit STRINGS (not
// z.coerce.number()) so the inferred form type matches what a TextInput can
// actually hold — the same reason phone/email in customerSchema avoid
// z.transform(). Conversion to `number` happens explicitly in the API layer
// (create-product.ts / update-product.ts), never via float parsing.
const INTEGER_REGEX = /^\d{1,12}$/;

function nonNegativeIntegerField(requiredMessage: string, invalidMessage: string) {
  return z.string().trim().min(1, requiredMessage).regex(INTEGER_REGEX, invalidMessage);
}

/** Optional, trimmed string field with a max length; empty string is treated as "not provided". */
function optionalTrimmed(maxLength: number, maxMessage: string) {
  return z.string().trim().max(maxLength, maxMessage).optional().or(z.literal(''));
}

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập tên sản phẩm.')
    .max(200, 'Tên sản phẩm không được vượt quá 200 ký tự.'),
  // Uppercased on submit — a reasonable, deterministic normalization (this
  // is a required field, so the transform doesn't change its optionality,
  // unlike the phone/email transform issue documented in customerSchema).
  sku: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập mã SKU.')
    .max(50, 'Mã SKU không được vượt quá 50 ký tự.')
    .transform((value) => value.toUpperCase()),
  // Never parsed as a number anywhere in this feature — barcodes may have
  // leading zeroes or exceed safe-integer assumptions.
  barcode: optionalTrimmed(64, 'Mã vạch không được vượt quá 64 ký tự.'),
  // `products.category_id` is nullable in the actual schema (verified via
  // information_schema — no NOT NULL), so it is optional here rather than
  // forced required; see the Phase 3.4 walkthrough for this schema-truth
  // decision (mirrors the same call made for customers.phone in Phase 3.3).
  category_id: z.string().trim().optional().or(z.literal('')),
  brand: optionalTrimmed(150, 'Thương hiệu không được vượt quá 150 ký tự.'),
  // Free text, not a fixed enum: the business needs values like "Hộp 20
  // miếng" or "Gói 12 cái" (quantity-per-package), which `products.unit`
  // (plain TEXT, no conversion columns) can hold as-is. `PRODUCT_UNITS` is
  // offered as quick-fill suggestions in the form, not an allowed-values
  // list — see the Phase 3.4 walkthrough for why a real packaging/unit
  // conversion model is out of scope for now.
  unit: z.string().trim().min(1, 'Vui lòng nhập đơn vị sản phẩm.').max(50, 'Đơn vị không được vượt quá 50 ký tự.'),
  description: optionalTrimmed(2000, 'Mô tả không được vượt quá 2000 ký tự.'),
  selling_price: nonNegativeIntegerField('Vui lòng nhập giá bán.', 'Giá bán không hợp lệ.'),
  default_purchase_price: nonNegativeIntegerField(
    'Vui lòng nhập giá nhập mặc định.',
    'Giá nhập mặc định không hợp lệ.'
  ),
  minimum_stock: nonNegativeIntegerField(
    'Vui lòng nhập mức tồn kho tối thiểu.',
    'Mức tồn kho tối thiểu không hợp lệ.'
  ),
  origin_country: optionalTrimmed(100, 'Quốc gia xuất xứ không được vượt quá 100 ký tự.'),
  manufacturer: optionalTrimmed(150, 'Nhà sản xuất không được vượt quá 150 ký tự.'),
  distributor: optionalTrimmed(150, 'Nhà phân phối không được vượt quá 150 ký tự.'),
  source_description: optionalTrimmed(500, 'Mô tả nguồn gốc không được vượt quá 500 ký tự.'),
});

export type ProductFormValues = z.infer<typeof productSchema>;
