import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useInsightAudio } from '@/hooks/useInsightAudio';

interface InsightAudioButtonProps {
  insight: string | null;
}

export function InsightAudioButton({ insight }: InsightAudioButtonProps) {
  const { isPlaying, isGenerating, playAudio, stopAudio, audioUrl } = useInsightAudio(insight);

  if (!insight) return null;

  const handleClick = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      playAudio();
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={handleClick}
          disabled={isGenerating}
          className={`h-8 w-8 ${isPlaying ? 'bg-primary/10 border-primary' : ''}`}
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isPlaying ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {isGenerating 
            ? 'Gerando áudio...' 
            : isPlaying 
              ? 'Parar áudio' 
              : audioUrl 
                ? 'Ouvir insight' 
                : 'Gerar e ouvir insight'}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
