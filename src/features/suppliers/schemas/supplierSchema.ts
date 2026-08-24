import { z } from 'zod';

const PHONE_REGEX = /^[0-9+\-.\s()]{6,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Optional, trimmed string field with a max length; empty string is treated as "not provided". */
function optionalTrimmed(maxLength: number, maxMessage: string) {
  return z.string().trim().max(maxLength, maxMessage).optional().or(z.literal(''));
}

export const supplierSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập tên nhà cung cấp.')
    .max(150, 'Tên nhà cung cấp không được vượt quá 150 ký tự.'),
  phone: optionalTrimmed(20, 'Số điện thoại không được vượt quá 20 ký tự.').refine(
    (value) => !value || PHONE_REGEX.test(value),
    { message: 'Số điện thoại không hợp lệ.' }
  ),
  email: optionalTrimmed(255, 'Email không được vượt quá 255 ký tự.').refine(
    (value) => !value || EMAIL_REGEX.test(value),
    { message: 'Email không hợp lệ.' }
  ),
  address: optionalTrimmed(255, 'Địa chỉ không được vượt quá 255 ký tự.'),
  tax_code: optionalTrimmed(50, 'Mã số thuế không được vượt quá 50 ký tự.'),
  contact_person: optionalTrimmed(150, 'Người liên hệ không được vượt quá 150 ký tự.'),
  notes: optionalTrimmed(1000, 'Ghi chú không được vượt quá 1000 ký tự.'),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;
