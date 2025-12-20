// src/pages/Auth.tsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Chrome, Loader2, MailCheck, ShieldCheck, User } from 'lucide-react';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Flow States
  const [checkEmail, setCheckEmail] = useState(false);
  const [needsCompletion, setNeedsCompletion] = useState(false); // For Google Users

  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // 1. Session & Interception Logic
  useEffect(() => {
    if (user) {
      const meta = user.user_metadata || {};
      
      // ✅ CORE RULE CHECK: Has the user explicitly accepted terms?
      if (meta.terms_accepted === true) {
        navigate('/'); // All good, go to dashboard
      } else {
        // 🛑 STOP: User logged in (e.g. via Google) but hasn't accepted terms yet.
        // We keep them here and show the "Complete Signup" screen.
        setNeedsCompletion(true);
        // Pre-fill name from Google if available
        if (meta.full_name) setFullName(meta.full_name);
      }
    }
  }, [user, navigate]);

  // 2. Handle Google Login (Step 1)
  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // ⚠️ IMPORTANT: Send them back to /auth to perform the Terms check
          redirectTo: `${window.location.origin}/auth`, 
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setLoading(false);
    }
  };

  // 3. Finalize Google Signup (Step 3 & 4)
  const completeGoogleSignup = async () => {
    if (!agreedToTerms) {
       toast({ title: "Terms Required", description: "You must agree to the Terms & Privacy Policy.", variant: "destructive" });
       return;
    }
    setLoading(true);
    try {
      // Update the user record with the legal timestamp
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          terms_accepted: true,
          terms_accepted_at: new Date().toISOString(),
          terms_version: '1.0'
        }
      });
      
      if (error) throw error;
      
      toast({ title: "Setup Complete", description: "Welcome to TradeOmen!" });
      navigate('/'); // NOW they are allowed in
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // 4. Handle Email/Password Auth
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Welcome back!", description: "Successfully signed in." });
      } else {
        // Sign Up Validation
        if (!agreedToTerms) {
           toast({ title: "Agreement Required", description: "You must check the box to continue.", variant: "destructive" });
           setLoading(false);
           return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
            data: {
              full_name: fullName,
              terms_accepted: true, // ✅ Recorded at moment of checkbox click
              terms_accepted_at: new Date().toISOString(),
            }
          },
        });
        if (error) throw error;
        setCheckEmail(true);
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // --- VIEW: Check Email ---
  if (checkEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 animate-in fade-in">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <MailCheck className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Verify your email</CardTitle>
            <CardDescription>We sent a link to <strong>{email}</strong></CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => setCheckEmail(false)}>Back to Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- VIEW: Google "Complete Signup" Interception ---
  if (needsCompletion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 animate-in zoom-in-95">
        <Card className="w-full max-w-md border-primary shadow-lg">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-center">Final Step</CardTitle>
            <CardDescription className="text-center">
              Please confirm your details and accept our terms to activate your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                placeholder="Your Name"
              />
            </div>
            
            <div className="flex items-start space-x-3 p-4 border rounded-lg bg-muted/30">
              <Checkbox 
                id="google-terms" 
                checked={agreedToTerms}
                onCheckedChange={(c) => setAgreedToTerms(c as boolean)}
                className="mt-1"
              />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor="google-terms" className="text-sm font-medium leading-none cursor-pointer">
                  I agree to the Terms & Privacy Policy
                </label>
                <p className="text-xs text-muted-foreground">
                  By creating an account, you agree to our <Link to="/legal/terms" target="_blank" className="underline">Terms of Service</Link> and <Link to="/legal/privacy" target="_blank" className="underline">Privacy Policy</Link>.
                </p>
              </div>
            </div>

            <Button 
              className="w-full" 
              size="lg" 
              onClick={completeGoogleSignup}
              disabled={!agreedToTerms || loading} // ✅ CORE RULE: Physically disabled until checked
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Complete Signup
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- VIEW: Standard Login / Signup ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl border-border/60">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
          </div>
          <CardTitle className="text-2xl text-center font-bold">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin ? 'Enter your credentials to access your account' : 'Start your journey to consistent profitability'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <Button variant="outline" className="w-full relative" onClick={handleGoogleAuth} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Chrome className="mr-2 h-4 w-4" />}
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>

            {/* ✅ CORE RULE: Mandatory Checkbox for Email Signup */}
            {!isLogin && (
              <div className="flex items-start space-x-3 pt-2 animate-in fade-in slide-in-from-top-2">
                <Checkbox 
                  id="terms" 
                  checked={agreedToTerms}
                  onCheckedChange={(c) => setAgreedToTerms(c as boolean)}
                  className="mt-1"
                />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="terms" className="text-sm font-medium leading-none cursor-pointer">
                    I agree to the Terms & Privacy Policy
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Required to create your account.
                  </p>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || (!isLogin && !agreedToTerms)} // ✅ CORE RULE: Button disabled if unchecked
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>

          <div className="text-center text-sm">
            <button type="button" onClick={() => { setIsLogin(!isLogin); setAgreedToTerms(false); }} className="text-primary hover:underline">
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};