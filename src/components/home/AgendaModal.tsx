/**
 * AgendaModal - Modal que exibe a Agenda Estratégica na Home
 * Replica a funcionalidade da seção Agenda do Painel de Controle
 */

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Agenda } from "@/components/agenda/Agenda";

interface AgendaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AgendaModal = ({ open, onOpenChange }: AgendaModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Agenda Estratégica</DialogTitle>
        </DialogHeader>
        <div className="p-0">
          <Agenda />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgendaModal;
