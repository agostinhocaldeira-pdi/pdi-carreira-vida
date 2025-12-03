import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface EmployeeProgressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: {
    id: string;
    name: string;
    email: string;
  } | null;
}

const EmployeeProgressModal = ({ open, onOpenChange, employee }: EmployeeProgressModalProps) => {
  const [progressData, setProgressData] = useState({
    objectives: { total: 0, completed: 0, pending: 0 },
    goals: { total: 0, completed: 0, pending: 0 },
    actions: { total: 0, completed: 0, pending: 0 },
  });

  useEffect(() => {
    if (employee && open) {
      // Simular carregamento de dados do funcionário
      // Em produção, isso viria do Supabase filtrado por user_id do funcionário
      const employeeKey = `employee_progress_${employee.id}`;
      const savedProgress = localStorage.getItem(employeeKey);
      
      if (savedProgress) {
        setProgressData(JSON.parse(savedProgress));
      } else {
        // Dados mockados para demonstração
        setProgressData({
          objectives: { total: 3, completed: 1, pending: 1 },
          goals: { total: 5, completed: 2, pending: 2 },
          actions: { total: 12, completed: 6, pending: 3 },
        });
      }
    }
  }, [employee, open]);

  const calculatePercentage = (completed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Progresso de {employee.name}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{employee.email}</p>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Resumo Geral */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {calculatePercentage(
                    progressData.objectives.completed + progressData.goals.completed + progressData.actions.completed,
                    progressData.objectives.total + progressData.goals.total + progressData.actions.total
                  )}%
                </div>
                <p className="text-xs text-muted-foreground">Progresso Geral</p>
              </CardContent>
            </Card>
            <Card className="bg-amber-500/5 border-amber-500/20">
              <CardContent className="pt-4 text-center">
                <div className="text-2xl font-bold text-amber-500">
                  {progressData.objectives.pending + progressData.goals.pending + progressData.actions.pending}
                </div>
                <p className="text-xs text-muted-foreground">Itens Pendentes</p>
              </CardContent>
            </Card>
            <Card className="bg-green-500/5 border-green-500/20">
              <CardContent className="pt-4 text-center">
                <div className="text-2xl font-bold text-green-500">
                  {progressData.objectives.completed + progressData.goals.completed + progressData.actions.completed}
                </div>
                <p className="text-xs text-muted-foreground">Itens Concluídos</p>
              </CardContent>
            </Card>
          </div>

          {/* Objetivos */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Objetivos
                </div>
                <Badge variant="outline">
                  {progressData.objectives.completed}/{progressData.objectives.total}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress 
                value={calculatePercentage(progressData.objectives.completed, progressData.objectives.total)} 
                className="h-3"
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  {progressData.objectives.completed} concluídos
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-500" />
                  {progressData.objectives.pending} pendentes
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Metas */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  Metas
                </div>
                <Badge variant="outline">
                  {progressData.goals.completed}/{progressData.goals.total}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress 
                value={calculatePercentage(progressData.goals.completed, progressData.goals.total)} 
                className="h-3"
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  {progressData.goals.completed} concluídas
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-500" />
                  {progressData.goals.pending} pendentes
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Ações
                </div>
                <Badge variant="outline">
                  {progressData.actions.completed}/{progressData.actions.total}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress 
                value={calculatePercentage(progressData.actions.completed, progressData.actions.total)} 
                className="h-3"
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  {progressData.actions.completed} concluídas
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-500" />
                  {progressData.actions.pending} pendentes
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Alertas */}
          {(progressData.objectives.pending > 0 || progressData.goals.pending > 0 || progressData.actions.pending > 0) && (
            <Card className="border-amber-500/50 bg-amber-500/5">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-700 dark:text-amber-400">Atenção</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Este funcionário possui {progressData.objectives.pending + progressData.goals.pending + progressData.actions.pending} itens pendentes 
                      que precisam de acompanhamento.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeProgressModal;
