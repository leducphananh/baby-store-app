import { getSupabaseErrorMessage } from '@/utils/supabase-error';

/** Postgres error-code overrides specific to the categories/products relationship. */
const CATEGORY_ERROR_OVERRIDES: Record<string, string> = {
  '23503': 'Không thể xóa danh mục vì vẫn còn sản phẩm đang sử dụng.', // foreign_key_violation
  '23505': 'Danh mục này đã tồn tại.', // unique_violation
};

export function getCategoryErrorMessage(error: unknown): string {
  return getSupabaseErrorMessage(error, CATEGORY_ERROR_OVERRIDES);
}

/** Thrown when a category with the same (case-insensitive) name already exists. */
export class DuplicateCategoryNameError extends Error {
  constructor() {
    super('Danh mục này đã tồn tại.');
    this.name = 'DuplicateCategoryNameError';
  }
}

/** Thrown when trying to delete a category that is still referenced by products. */
export class CategoryInUseError extends Error {
  constructor() {
    super('Không thể xóa danh mục vì vẫn còn sản phẩm đang sử dụng.');
    this.name = 'CategoryInUseError';
  }
}

/** Thrown when a category id does not exist (or was already deleted). */
export class CategoryNotFoundError extends Error {
  constructor() {
    super('Không tìm thấy danh mục.');
    this.name = 'CategoryNotFoundError';
  }
}
