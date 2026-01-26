import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LogoutButtonProps {
  variant?: "default" | "ghost" | "outline" | "destructive" | "secondary" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  showText?: boolean;
  className?: string;
}

const LogoutButton = ({ variant = "ghost", size = "sm", showText = true, className = "" }: LogoutButtonProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Você saiu da sua conta");
    navigate("/news");
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      className={`gap-1 sm:gap-2 ${className}`}
    >
      <LogOut className="w-4 h-4" />
      {showText && <span className="hidden sm:inline">Sair</span>}
    </Button>
  );
};

export default LogoutButton;
