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
  variant?: 'primary' | 'highlighted' | 'default' | 'compact' | 'feature' | 'premium-black';
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
  const isPremiumBlack = variant === 'premium-black';

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
          // Highlighted variant - dark with gold accent (for Base Pessoal)
          isHighlighted && !isLocked && "bg-[#1A1F2C] border-[#D4AF37]/50 shadow-lg hover:shadow-xl hover:border-[#D4AF37]",
          // Premium Black variant - exclusive black premium style
          isPremiumBlack && !isLocked && "bg-[#0D0D0D] border-[#333] shadow-lg hover:shadow-xl hover:border-[#D4AF37]/50",
          isPremiumBlack && isLocked && "bg-[#1A1A1A] border-[#333]/50",
          // Compact variant - smaller cards
          isCompact && "bg-card border-border/50 hover:border-primary/30 hover:shadow-sm",
          // Feature variant - medium sized feature cards
          isFeature && "bg-card border-border/50 hover:border-primary/30 hover:shadow-md",
          // Locked state (for non premium-black variants)
          isLocked && !isPremiumBlack && "bg-muted/30 border-border/20 opacity-60 cursor-not-allowed",
          // Default state
          !isPrimary && !isHighlighted && !isCompact && !isFeature && !isPremiumBlack && !isLocked && "bg-card border-border/50 hover:border-primary/30 hover:shadow-md",
          className
        )}
        onClick={handleClick}
      >
        {/* Lock overlay - only icon on mobile, with text on larger screens */}
        {isLocked && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="text-center p-3">
              <Lock className="w-5 h-5 text-muted-foreground/40 mx-auto" />
              <p className="text-[10px] text-muted-foreground/60 leading-tight max-w-[120px] hidden sm:block mt-1.5">{lockMessage}</p>
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
          isCompact || isHighlighted || isPremiumBlack ? "p-2 sm:p-3" : isFeature ? "p-4" : "p-4 sm:p-5"
        )}>
          {/* Icon */}
          <div className={cn(
            "rounded-lg flex items-center justify-center shrink-0",
            isHighlighted 
              ? "w-7 h-7 sm:w-10 sm:h-10 bg-[#D4AF37]/20" 
              : isPremiumBlack
                ? "w-7 h-7 sm:w-8 sm:h-8 bg-[#D4AF37]/20"
                : isCompact 
                  ? "w-7 h-7 sm:w-8 sm:h-8 bg-primary/10" 
                  : "w-10 h-10 bg-primary/10",
            isLocked && !isPremiumBlack && "bg-muted/50"
          )}>
            <div className={cn(
              isHighlighted ? "text-[#D4AF37]" : isPremiumBlack ? "text-[#D4AF37]" : "text-primary",
              isLocked && !isPremiumBlack && "text-muted-foreground/40",
              isLocked && isPremiumBlack && "text-[#D4AF37]/50",
              isCompact || isPremiumBlack || isHighlighted ? "w-3.5 h-3.5 sm:w-4 sm:h-4" : "w-5 h-5"
            )}>
              {icon}
            </div>
          </div>

          {/* Text content */}
          <div className="mt-2 sm:mt-3 flex-1">
            <h3 className={cn(
              "font-semibold leading-tight",
              isHighlighted ? "text-white text-[11px] sm:text-base" : isPremiumBlack ? "text-white" : "text-foreground",
              isLocked && !isPremiumBlack && "text-muted-foreground/60",
              isLocked && isPremiumBlack && "text-white/50",
              (isCompact || isPremiumBlack) && !isHighlighted ? "text-[11px] sm:text-sm" : !isHighlighted && "text-base"
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

          {/* CTA for highlighted cards - hidden on mobile */}
          {isHighlighted && !isLocked && (
            <div className="mt-4 pt-3 border-t border-[#D4AF37]/20 hidden sm:block">
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
