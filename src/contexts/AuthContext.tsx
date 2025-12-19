import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  plan: string; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState("FREE"); 

  // ✅ Helper: Fetch the REAL plan from the database
  const fetchLivePlan = async (userId: string) => {
    try {
      // 1. Try fetching from user_profiles
      const { data } = await supabase
        .from('user_profiles')
        .select('plan_tier')
        .eq('id', userId)
        .single();

      // ✅ FIX: Cast to 'any' to avoid "Property does not exist on type 'never'"
      const profile = data as any;

      if (profile?.plan_tier) {
        setPlan(profile.plan_tier.toUpperCase());
        return;
      }
      
      // 2. Fallback: Check metadata if DB fetch fails
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.plan_tier) {
        setPlan(user.user_metadata.plan_tier.toUpperCase());
      }
    } catch (error) {
      console.error("Plan sync failed:", error);
      setPlan("FREE");
    }
  };

  useEffect(() => {
    // 1. Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (session?.user) {
          fetchLivePlan(session.user.id);
        } else {
          setPlan("FREE"); 
        }
      }
    );

    // 2. Check for existing session (Page Load)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        fetchLivePlan(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setPlan("FREE");
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, plan }}>
      {children}
    </AuthContext.Provider>
  );
};