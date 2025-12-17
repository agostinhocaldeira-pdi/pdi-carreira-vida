import { Target, Rocket, Sparkles } from "lucide-react";

interface PDILoaderProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  variant?: "target" | "rocket" | "sparkles";
}

export const PDILoader = ({ 
  text = "Carregando...", 
  size = "md",
  variant = "target"
}: PDILoaderProps) => {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  const Icon = variant === "rocket" ? Rocket : variant === "sparkles" ? Sparkles : Target;

  return (
    <div className="flex flex-col items-center justify-center gap-2 py-4">
      <div className="relative">
        {/* Pulse ring animation */}
        <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-primary/20 animate-ping`} />
        
        {/* Icon with bounce animation */}
        <Icon 
          className={`${sizeClasses[size]} text-primary animate-bounce relative z-10`}
          style={{ animationDuration: "1.5s" }}
        />
      </div>
      
      {text && (
        <p className={`${textSizeClasses[size]} text-muted-foreground animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
};
