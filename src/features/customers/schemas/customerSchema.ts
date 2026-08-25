import { z } from 'zod';

import { normalizePhone } from '../utils/phone';

// Permissive on purpose: after normalization this only checks that the
// value is digits (with an optional leading `+`) of a plausible length, so
// it does not reject legitimate Vietnamese mobile numbers (10 digits) or
// landlines (area code + local number) while still catching junk input.
const PHONE_REGEX = /^\+?\d{9,11}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Optional, trimmed string field with a max length; empty string is treated as "not provided". */
function optionalTrimmed(maxLength: number, maxMessage: string) {
  return z.string().trim().max(maxLength, maxMessage).optional().or(z.literal(''));
}

export const customerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập tên khách hàng.')
    .max(150, 'Tên khách hàng không được vượt quá 150 ký tự.'),
  // `customers.phone` is nullable in the actual schema (no NOT NULL), so it
  // is not required here. Validation runs against the normalized form (see
  // normalizePhone) so "098 123 4567" is accepted just like "0981234567" —
  // but the field itself is intentionally NOT transformed here: doing so
  // would turn `phone`/`email` from optional keys into required-but-possibly
  // undefined keys in the inferred type, which breaks the RHF/zodResolver
  // input/output type match. Normalization for storage happens explicitly
  // in the API layer (create-customer.ts / update-customer.ts) instead.
  phone: optionalTrimmed(20, 'Số điện thoại không được vượt quá 20 ký tự.').refine(
    (value) => !value || PHONE_REGEX.test(normalizePhone(value)),
    { message: 'Số điện thoại không hợp lệ.' }
  ),
  email: optionalTrimmed(255, 'Email không được vượt quá 255 ký tự.').refine(
    (value) => !value || EMAIL_REGEX.test(value.toLowerCase()),
    { message: 'Email không hợp lệ.' }
  ),
  address: optionalTrimmed(255, 'Địa chỉ không được vượt quá 255 ký tự.'),
  notes: optionalTrimmed(1000, 'Ghi chú không được vượt quá 1000 ký tự.'),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
