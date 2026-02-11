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
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden bg-background border-border">
        <DialogHeader className="pb-3 border-b border-border">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <ListTodo className="w-4 h-4 text-[#D4AF37]" />
            Micro Pendências
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[calc(85vh-100px)] pt-2">
          <PendingTasksKanban compact showLink />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PendingTasksModal;
