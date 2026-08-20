import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { Database } from '@/services/supabase/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isInitialized: boolean;
  setSession: (session: Session | null, profile?: Profile | null) => void;
  setInitialized: (initialized: boolean) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  session: null,
  user: null,
  profile: null,
  isInitialized: false,
  setSession: (session, profile = null) => set({ session, user: session?.user ?? null, profile }),
  setInitialized: (initialized) => set({ isInitialized: initialized }),
  signOut: () => set({ session: null, user: null, profile: null }),
}));
