/**
 * HubCard - Componente reutilizável para cards do Hub
 */

import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface HubCardProps {
  title: string;
  description?: string;
  icon: ReactNode;
  to: string;
  isLocked?: boolean;
  lockMessage?: string;
  variant?: 'primary' | 'highlighted' | 'default' | 'compact' | 'feature';
  tooltipContent?: string;
  badge?: string;
  children?: ReactNode;
  className?: string;
}

export const HubCard = ({ 
  title, 
  description, 
  icon, 
  to, 
  isLocked = false,
  lockMessage,
  variant = 'default',
  tooltipContent,
  badge,
  children,
  className
}: HubCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isLocked) return;
    navigate(to);
  };

  const isPrimary = variant === 'primary';
  const isHighlighted = variant === 'highlighted';
  const isCompact = variant === 'compact';
  const isFeature = variant === 'feature';

  const cardContent = (
    <motion.div
      whileHover={!isLocked ? { scale: 1.01, y: -2 } : {}}
      whileTap={!isLocked ? { scale: 0.99 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="h-full"
    >
      <Card 
        className={cn(
          "relative overflow-hidden transition-all duration-300 cursor-pointer group h-full border",
          // Primary variant - dark premium style
          isPrimary && "bg-card border-border shadow-sm hover:shadow-md hover:border-primary/20",
          // Highlighted variant - dark with gold accent
          isHighlighted && !isLocked && "bg-[#1A1F2C] border-[#D4AF37]/50 shadow-lg hover:shadow-xl hover:border-[#D4AF37]",
          // Compact variant - smaller cards
          isCompact && "bg-card border-border/50 hover:border-primary/30 hover:shadow-sm",
          // Feature variant - medium sized feature cards
          isFeature && "bg-card border-border/50 hover:border-primary/30 hover:shadow-md",
          // Locked state
          isLocked && "bg-muted/30 border-border/20 opacity-60 cursor-not-allowed",
          // Default state
          !isPrimary && !isHighlighted && !isCompact && !isFeature && !isLocked && "bg-card border-border/50 hover:border-primary/30 hover:shadow-md",
          className
        )}
        onClick={handleClick}
      >
        {/* Lock overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="text-center p-3">
              <Lock className="w-5 h-5 text-muted-foreground/40 mx-auto mb-1.5" />
              <p className="text-[10px] text-muted-foreground/60 leading-tight max-w-[120px]">{lockMessage}</p>
            </div>
          </div>
        )}

        {/* Badge */}
        {badge && !isLocked && (
          <div className="absolute top-2 right-2 z-5">
            <span className={cn(
              "text-[10px] font-medium px-2 py-0.5 rounded-full",
              isHighlighted 
                ? "bg-[#D4AF37] text-[#1A1F2C]" 
                : "bg-primary/10 text-primary"
            )}>
              {badge}
            </span>
          </div>
        )}

        {/* Content wrapper */}
        <div className={cn(
          "flex flex-col h-full",
          isCompact ? "p-3" : isFeature ? "p-4" : "p-4 sm:p-5"
        )}>
          {/* Icon */}
          <div className={cn(
            "rounded-lg flex items-center justify-center shrink-0",
            isHighlighted 
              ? "w-10 h-10 bg-[#D4AF37]/20" 
              : isCompact 
                ? "w-8 h-8 bg-primary/10" 
                : "w-10 h-10 bg-primary/10",
            isLocked && "bg-muted/50"
          )}>
            <div className={cn(
              isHighlighted ? "text-[#D4AF37]" : "text-primary",
              isLocked && "text-muted-foreground/40",
              isCompact ? "w-4 h-4" : "w-5 h-5"
            )}>
              {icon}
            </div>
          </div>

          {/* Text content */}
          <div className="mt-3 flex-1">
            <h3 className={cn(
              "font-semibold leading-tight",
              isHighlighted ? "text-white" : "text-foreground",
              isLocked && "text-muted-foreground/60",
              isCompact ? "text-sm" : "text-base"
            )}>
              {title}
            </h3>
            {/* Description hidden on mobile for compact cards */}
            {description && (
              <p className={cn(
                "mt-1 leading-relaxed",
                isHighlighted ? "text-gray-400" : "text-muted-foreground",
                isLocked && "text-muted-foreground/40",
                isCompact ? "text-xs hidden" : "text-sm",
                isFeature && "hidden sm:block"
              )}>
                {description}
              </p>
            )}
          </div>

          {/* Custom children content */}
          {children}

          {/* CTA for highlighted cards */}
          {isHighlighted && !isLocked && (
            <div className="mt-4 pt-3 border-t border-[#D4AF37]/20">
              <div className="flex items-center text-[#D4AF37] text-sm font-medium group-hover:translate-x-1 transition-transform">
                Iniciar Mapeamento
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );

  if (tooltipContent) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {cardContent}
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <p className="text-sm">{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return cardContent;
};

export default HubCard;
