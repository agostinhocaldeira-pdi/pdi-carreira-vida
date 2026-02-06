/**
 * HubCard - Componente reutilizável para cards do Hub
 */

import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Info } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
  const [showLockedDialog, setShowLockedDialog] = useState(false);

  const handleClick = () => {
    if (isLocked) {
      setShowLockedDialog(true);
      return;
    }
    navigate(to);
  };

  const isPrimary = variant === 'primary';
  const isHighlighted = variant === 'highlighted';
  const isCompact = variant === 'compact';
  const isFeature = variant === 'feature';
  const isPremiumBlack = variant === 'premium-black';

  const cardContent = (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="h-full"
    >
      <Card 
        className={cn(
          "relative overflow-hidden transition-all duration-300 cursor-pointer group h-full border",
          // Primary variant - dark premium style
          isPrimary && "bg-card border-border shadow-sm hover:shadow-md hover:border-primary/20",
          // Highlighted variant - dark with gold accent (for Base Pessoal)
          isHighlighted && "bg-[#1A1F2C] border-[#D4AF37]/50 shadow-lg hover:shadow-xl hover:border-[#D4AF37]",
          // Premium Black variant - exclusive black premium style
          isPremiumBlack && "bg-[#0D0D0D] border-[#333] shadow-lg hover:shadow-xl hover:border-[#D4AF37]/50",
          // Compact variant - smaller cards
          isCompact && "bg-card border-border/50 hover:border-primary/30 hover:shadow-sm",
          // Feature variant - medium sized feature cards
          isFeature && "bg-card border-border/50 hover:border-primary/30 hover:shadow-md",
          // Default state
          !isPrimary && !isHighlighted && !isCompact && !isFeature && !isPremiumBlack && "bg-card border-border/50 hover:border-primary/30 hover:shadow-md",
          className
        )}
        onClick={handleClick}
      >
        {/* Badge */}
        {badge && (
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
                  : "w-10 h-10 bg-primary/10"
          )}>
            <div className={cn(
              isHighlighted ? "text-[#D4AF37]" : isPremiumBlack ? "text-[#D4AF37]" : "text-primary",
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
              (isCompact || isPremiumBlack) && !isHighlighted ? "text-[11px] sm:text-sm" : !isHighlighted && "text-base"
            )}>
              {title}
            </h3>
            {/* Description hidden on mobile for compact cards */}
            {description && (
              <p className={cn(
                "mt-1 leading-relaxed",
                isHighlighted ? "text-gray-400" : "text-muted-foreground",
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

  const dialogContent = (
    <Dialog open={showLockedDialog} onOpenChange={setShowLockedDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            Acesso Restrito
          </DialogTitle>
          <DialogDescription className="pt-2 text-base">
            {lockMessage || "Esta funcionalidade ainda não está disponível para você."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => setShowLockedDialog(false)}>
            Entendi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (tooltipContent) {
    return (
      <>
        <Tooltip>
          <TooltipTrigger asChild>
            {cardContent}
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <p className="text-sm">{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
        {dialogContent}
      </>
    );
  }

  return (
    <>
      {cardContent}
      {dialogContent}
    </>
  );
};

export default HubCard;
