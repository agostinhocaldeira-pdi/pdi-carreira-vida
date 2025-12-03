import { Achievement } from "@/hooks/useGamification";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Trophy } from "lucide-react";

interface AchievementNotificationProps {
  achievement: Achievement;
  onDismiss: () => void;
}

export function AchievementNotification({ achievement, onDismiss }: AchievementNotificationProps) {
  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-up">
      <Card className="p-4 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-500/30 shadow-lg max-w-sm">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-glow">
            <span className="text-2xl">{achievement.icon}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">
                Conquista Desbloqueada!
              </span>
            </div>
            <h3 className="font-bold text-foreground">{achievement.name}</h3>
            <p className="text-sm text-muted-foreground">{achievement.description}</p>
            <p className="text-xs text-amber-600 mt-1 font-medium">
              +{achievement.points} pontos
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onDismiss} className="h-6 w-6">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
