import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame, Star, Target, Sparkles, HelpCircle } from "lucide-react";
import { useGamification } from "@/hooks/useGamification";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ExportPDFButton } from "@/components/reports/ExportPDFButton";

export function GamificationCard() {
  const { 
    streak, 
    getUnlockedAchievements, 
    getLockedAchievements,
    getProgressToNextLevel 
  } = useGamification();

  const unlockedAchievements = getUnlockedAchievements();
  const lockedAchievements = getLockedAchievements();
  const progress = getProgressToNextLevel();

  return (
    <Card className="shadow-medium border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-yellow-500/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-glow">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Sua Jornada</CardTitle>
              <CardDescription>Conquistas e progresso</CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="gap-1.5 bg-amber-500/10 text-amber-700 border-amber-500/30">
            <Star className="w-3 h-3 fill-amber-500" />
            Nível {streak.level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Level Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progresso para nível {streak.level + 1}</span>
            <span className="font-medium">{streak.total_points} pts</span>
          </div>
          <Progress value={progress.percentage} className="h-2 bg-amber-100" />
          <p className="text-xs text-muted-foreground text-right">
            {progress.current}/{progress.next} pontos
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-background rounded-lg border">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xl font-bold">{streak.current_streak}</span>
            </div>
            <span className="text-xs text-muted-foreground">Dias seguidos</span>
          </div>
          <div className="text-center p-3 bg-background rounded-lg border">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="text-xl font-bold">{streak.longest_streak}</span>
            </div>
            <span className="text-xs text-muted-foreground">Maior streak</span>
          </div>
          <div className="text-center p-3 bg-background rounded-lg border">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-xl font-bold">{unlockedAchievements.length}</span>
            </div>
            <span className="text-xs text-muted-foreground">Conquistas</span>
          </div>
        </div>

        {/* Achievements Grid */}
        <TooltipProvider delayDuration={100}>
          <div className="space-y-2">
            <Tooltip>
              <TooltipTrigger>
                <span className="text-sm font-medium flex items-center gap-2 cursor-help w-fit">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  Conquistas ({unlockedAchievements.length}/{unlockedAchievements.length + lockedAchievements.length})
                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[250px]">
                <p className="text-sm">Acesse o FAQ na seção Suporte para entender sobre Gamificação e Badges</p>
              </TooltipContent>
            </Tooltip>
            <div className="flex flex-wrap gap-2">
              {unlockedAchievements.slice(0, 8).map((achievement) => (
                <Tooltip key={achievement.code}>
                  <TooltipTrigger>
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center border-2 border-amber-300 shadow-sm hover:scale-110 transition-transform cursor-pointer">
                      <span className="text-lg">{achievement.icon}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">{achievement.name}</p>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
              {lockedAchievements.slice(0, 4).map((achievement) => (
                <Tooltip key={achievement.code}>
                  <TooltipTrigger>
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center border border-border opacity-50 cursor-pointer">
                      <span className="text-lg grayscale">🔒</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">{achievement.name}</p>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
              {(unlockedAchievements.length + lockedAchievements.length) > 12 && (
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center border border-border text-xs font-medium">
                  +{(unlockedAchievements.length + lockedAchievements.length) - 12}
                </div>
              )}
            </div>
          </div>
        </TooltipProvider>

        {/* Export PDF Button */}
        <div className="pt-2 border-t">
          <ExportPDFButton />
        </div>
      </CardContent>
    </Card>
  );
}
