import type { Database } from '@/services/supabase/database.types';

export type SupplierRow = Database['public']['Tables']['suppliers']['Row'];
export type SupplierInsert = Database['public']['Tables']['suppliers']['Insert'];
export type SupplierUpdate = Database['public']['Tables']['suppliers']['Update'];

/** The two states a supplier can be in. Suppliers are never hard-deleted. */
export type SupplierStatus = 'active' | 'archived';

/** Status used to filter the supplier list; 'all' includes both. */
export type SupplierStatusFilter = SupplierStatus | 'all';
