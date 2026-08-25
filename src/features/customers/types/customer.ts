import type { Database } from '@/services/supabase/database.types';

export type CustomerRow = Database['public']['Tables']['customers']['Row'];
export type CustomerInsert = Database['public']['Tables']['customers']['Insert'];
export type CustomerUpdate = Database['public']['Tables']['customers']['Update'];

/** The two states a customer can be in. Customers are never hard-deleted. */
export type CustomerStatus = 'active' | 'archived';

/** Status used to filter the customer list; 'all' includes both. */
export type CustomerStatusFilter = CustomerStatus | 'all';
