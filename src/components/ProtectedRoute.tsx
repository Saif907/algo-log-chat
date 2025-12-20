import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // 1. Check if user is logged in
  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // 2. 🛑 FORCE ACCEPTANCE CHECK 🛑
  // If they are logged in BUT haven't accepted terms -> Kick them to Auth
  if (user.user_metadata?.terms_accepted !== true) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};