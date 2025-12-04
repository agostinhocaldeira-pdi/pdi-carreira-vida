import * as React from "react";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

export const VoiceInputButton = React.forwardRef<
  HTMLButtonElement,
  VoiceInputButtonProps
>(({ onTranscript, disabled, className }, ref) => {
  const { transcript, isListening, isSupported, startListening, stopListening } =
    useSpeechRecognition();

  React.useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
    }
  }, [transcript, onTranscript]);

  if (!isSupported) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          ref={ref}
          type="button"
          onClick={handleClick}
          disabled={disabled}
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-all duration-200",
            "hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            isListening
              ? "text-red-500 bg-red-100 dark:bg-red-950 animate-pulse"
              : "text-muted-foreground hover:text-foreground",
            className
          )}
          aria-label={isListening ? "Parar gravação" : "Iniciar comando de voz"}
        >
          {isListening ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isListening ? "Clique para parar" : "Clique para falar"}</p>
      </TooltipContent>
    </Tooltip>
  );
});

VoiceInputButton.displayName = "VoiceInputButton";
