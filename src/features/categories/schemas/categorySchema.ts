import { z } from 'zod';

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập tên danh mục.')
    .max(100, 'Tên danh mục không được vượt quá 100 ký tự.'),
  description: z
    .string()
    .trim()
    .max(500, 'Mô tả không được vượt quá 500 ký tự.')
    .optional()
    .or(z.literal('')),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
