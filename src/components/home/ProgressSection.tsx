import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, CheckCircle2 } from "lucide-react";

const ProgressSection = () => {
  // Mock data - will be dynamic later
  const progressData = {
    objectives: 65,
    goals: 45,
    actions: 78,
  };

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          Seu Progresso
        </CardTitle>
        <CardDescription>Acompanhe o desenvolvimento do seu PDI</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Objetivos */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Objetivos</p>
                  <p className="text-2xl font-bold">{progressData.objectives}%</p>
                </div>
              </div>
            </div>
            <Progress value={progressData.objectives} className="h-2" />
            <p className="text-xs text-muted-foreground">
              3 de 5 objetivos em andamento
            </p>
          </div>

          {/* Metas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium">Metas</p>
                  <p className="text-2xl font-bold">{progressData.goals}%</p>
                </div>
              </div>
            </div>
            <Progress value={progressData.goals} className="h-2" />
            <p className="text-xs text-muted-foreground">
              9 de 20 metas concluídas
            </p>
          </div>

          {/* Ações */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Ações</p>
                  <p className="text-2xl font-bold">{progressData.actions}%</p>
                </div>
              </div>
            </div>
            <Progress value={progressData.actions} className="h-2" />
            <p className="text-xs text-muted-foreground">
              78 de 100 ações realizadas
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressSection;
