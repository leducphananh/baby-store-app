import React, { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { supabase } from '@/services/supabase/client';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setSession, setInitialized } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    async function hydrateSession(session: any) {
      if (!session) {
        if (mounted) setSession(null);
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (mounted) setSession(session, profile);
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      hydrateSession(session).finally(() => {
        if (mounted) setInitialized(true);
      });
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      hydrateSession(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setSession, setInitialized]);

  return <>{children}</>;
}
