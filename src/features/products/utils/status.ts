import type { ProductStatus } from '../types/product';

const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  active: 'Đang hoạt động',
  archived: 'Đã lưu trữ',
};

/** Vietnamese label for a product status; falls back to the raw value for forward-compat. */
export function getProductStatusLabel(status: string): string {
  return PRODUCT_STATUS_LABELS[status as ProductStatus] ?? status;
}
