import type { CustomerStatus } from '../types/customer';

const CUSTOMER_STATUS_LABELS: Record<CustomerStatus, string> = {
  active: 'Đang hoạt động',
  archived: 'Đã lưu trữ',
};

/** Vietnamese label for a customer status; falls back to the raw value for forward-compat. */
export function getCustomerStatusLabel(status: string): string {
  return CUSTOMER_STATUS_LABELS[status as CustomerStatus] ?? status;
}
