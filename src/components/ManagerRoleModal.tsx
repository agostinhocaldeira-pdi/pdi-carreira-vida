import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Home, Users } from "lucide-react";

interface ManagerRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ManagerRoleModal = ({ open, onOpenChange }: ManagerRoleModalProps) => {
  const navigate = useNavigate();

  const handleMeuPDI = () => {
    onOpenChange(false);
    navigate("/home");
  };

  const handleGestaoPDIs = () => {
    onOpenChange(false);
    navigate("/gestao-pdis");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl">Bem-vindo de volta!</DialogTitle>
          <DialogDescription className="text-base">
            O que você gostaria de acessar?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-4">
          <Button
            size="lg"
            variant="outline"
            onClick={handleMeuPDI}
            className="h-16 justify-start gap-4 text-left"
          >
            <div className="p-2 rounded-full bg-primary/10">
              <Home className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Meu PDI</p>
              <p className="text-xs text-muted-foreground font-normal">
                Acesse seu desenvolvimento pessoal
              </p>
            </div>
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleGestaoPDIs}
            className="h-16 justify-start gap-4 text-left"
          >
            <div className="p-2 rounded-full bg-green-500/10">
              <Users className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="font-semibold">Gestão de PDI's</p>
              <p className="text-xs text-muted-foreground font-normal">
                Acompanhe o desenvolvimento da sua equipe
              </p>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManagerRoleModal;
