import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LogOut } from "lucide-react";
import { useUnsavedChanges } from "@/contexts/UnsavedChangesContext";
import { toast } from "sonner";

interface LogoutButtonProps {
  variant?: "default" | "ghost" | "outline" | "destructive" | "secondary" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  showText?: boolean;
  className?: string;
}

const LogoutButton = ({ variant = "ghost", size = "sm", showText = true, className = "" }: LogoutButtonProps) => {
  const navigate = useNavigate();
  const { hasUnsavedChanges, markAsSaved } = useUnsavedChanges();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleLogoutClick = () => {
    if (hasUnsavedChanges) {
      setShowConfirmDialog(true);
    } else {
      performLogout();
    }
  };

  const performLogout = () => {
    markAsSaved();
    toast.success("Você saiu da sua conta");
    navigate("/");
  };

  const handleConfirmLogout = () => {
    setShowConfirmDialog(false);
    performLogout();
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleLogoutClick}
        className={`gap-1 sm:gap-2 ${className}`}
      >
        <LogOut className="w-4 h-4" />
        {showText && <span className="hidden sm:inline">Sair</span>}
      </Button>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Alterações não salvas</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem alterações que não foram salvas. Se sair agora, essas alterações serão perdidas. Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmLogout} className="bg-destructive hover:bg-destructive/90">
              Sair sem salvar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default LogoutButton;
