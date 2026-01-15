import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PendingTasksKanban } from "@/components/pending-tasks/PendingTasksKanban";
import { ListTodo } from "lucide-react";

interface PendingTasksModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PendingTasksModal = ({ open, onOpenChange }: PendingTasksModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-primary" />
            Lista de Pendências
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[calc(85vh-100px)]">
          <PendingTasksKanban compact showLink />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PendingTasksModal;
