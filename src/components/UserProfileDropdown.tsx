// frontend/src/components/UserProfileDropdown.tsx
import { useState } from "react";
import { User, Settings, CreditCard, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfileDropdownProps {
  collapsed: boolean;
}

export const UserProfileDropdown = ({ collapsed }: UserProfileDropdownProps) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const menuItems = [
    { icon: User, label: "View Profile", onClick: () => navigate("/settings/profile") },
    { icon: Settings, label: "Settings", onClick: () => navigate("/settings") },
    { icon: CreditCard, label: "Billing", onClick: () => navigate("/settings/billing") },
  ];

  const userEmail = user?.email || "trader@example.com";
  const userInitial = (user?.user_metadata?.full_name || userEmail).charAt(0).toUpperCase();
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors focus:outline-none",
            collapsed && "justify-center"
          )}
        >
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage src={avatarUrl} alt="User Avatar" className="object-cover" />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium truncate">
                  {user?.user_metadata?.full_name || "Trader"}
                </p>
                <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
              </div>
              <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={collapsed ? "start" : "end"} side={collapsed ? "right" : "bottom"} className="w-56 mb-2">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{user?.user_metadata?.full_name || "Trader"}</p>
            <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        {menuItems.map((item, index) => (
          <DropdownMenuItem key={index} onClick={item.onClick} className="cursor-pointer">
            <item.icon className="mr-2 h-4 w-4" />
            <span>{item.label}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive cursor-pointer focus:bg-destructive/10" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};