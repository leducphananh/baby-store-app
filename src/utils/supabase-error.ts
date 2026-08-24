import { PostgrestError } from '@supabase/supabase-js';

/**
 * Generic, Vietnamese-friendly fallback used whenever an error cannot be
 * mapped to something more specific. Never surface raw Supabase/Postgres
 * error text to the user.
 */
export const DEFAULT_ERROR_MESSAGE = 'Đã xảy ra lỗi. Vui lòng thử lại.';

const DEFAULT_POSTGRES_ERROR_MESSAGES: Record<string, string> = {
  '22P02': 'Không tìm thấy dữ liệu.', // invalid_text_representation (e.g. malformed uuid in an id filter)
  '23503': 'Không thể thực hiện vì dữ liệu đang được sử dụng ở nơi khác.', // foreign_key_violation
  '23505': 'Dữ liệu này đã tồn tại.', // unique_violation
  '42501': 'Bạn không có quyền thực hiện thao tác này.', // insufficient_privilege (RLS)
  PGRST116: 'Không tìm thấy dữ liệu.', // .single() found 0 or >1 rows
};

function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string' &&
    'code' in error
  );
}

function isNetworkError(error: unknown): boolean {
  return error instanceof Error && /network|fetch/i.test(error.message);
}

/**
 * Maps a Supabase/Postgrest error (or an unknown thrown value) to a
 * Vietnamese-friendly message. Pass `overrides` to customize the message
 * for specific Postgres error codes in a given feature's context (e.g. a
 * foreign-key violation means something different for each table).
 */
export function getSupabaseErrorMessage(error: unknown, overrides?: Record<string, string>): string {
  if (!error) return DEFAULT_ERROR_MESSAGE;

  if (isPostgrestError(error)) {
    if (overrides?.[error.code]) return overrides[error.code];
    if (DEFAULT_POSTGRES_ERROR_MESSAGES[error.code]) return DEFAULT_POSTGRES_ERROR_MESSAGES[error.code];
    return DEFAULT_ERROR_MESSAGE;
  }

  if (isNetworkError(error)) {
    return 'Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.';
  }

  return DEFAULT_ERROR_MESSAGE;
}
