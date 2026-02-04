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
      <DialogContent className="w-[95vw] max-w-2xl h-[85vh] max-h-[85vh] overflow-hidden p-0 flex flex-col">
        <DialogHeader className="sr-only">
          <DialogTitle>Agenda Estratégica</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <Agenda />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgendaModal;
