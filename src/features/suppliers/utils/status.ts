import type { SupplierStatus } from '../types/supplier';

const SUPPLIER_STATUS_LABELS: Record<SupplierStatus, string> = {
  active: 'Đang hoạt động',
  archived: 'Đã lưu trữ',
};

/** Vietnamese label for a supplier status; falls back to the raw value for forward-compat. */
export function getSupplierStatusLabel(status: string): string {
  return SUPPLIER_STATUS_LABELS[status as SupplierStatus] ?? status;
}
