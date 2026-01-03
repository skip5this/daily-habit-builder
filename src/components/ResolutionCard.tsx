import { Check, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Resolution } from "@/types/resolution";
import {
  getCurrentPeriodCount,
  getProgressPercent,
  calculateStreak,
  getFrequencyLabel,
} from "@/lib/resolution-utils";
import { ProgressBar } from "./ProgressBar";
import { StreakBadge } from "./StreakBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ResolutionCardProps {
  resolution: Resolution;
  onComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ResolutionCard({
  resolution,
  onComplete,
  onEdit,
  onDelete,
}: ResolutionCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const currentCount = getCurrentPeriodCount(resolution);
  const targetCount = resolution.frequency.targetCount;
  const progress = getProgressPercent(resolution);
  const streak = calculateStreak(resolution);
  const isComplete = currentCount >= targetCount;

  const handleComplete = () => {
    if (isComplete) return;
    
    setIsAnimating(true);
    onComplete();
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="bg-card rounded-lg p-5 shadow-card animate-fade-in">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display text-lg font-medium text-foreground truncate">
              {resolution.title}
            </h3>
            <StreakBadge streak={streak} />
          </div>
          {resolution.note && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {resolution.note}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {getFrequencyLabel(resolution.frequency.type, targetCount)}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <ProgressBar percent={progress} className="mb-2" />
          <p className="text-xs text-muted-foreground">
            {currentCount} of {targetCount} completed
          </p>
        </div>

        <Button
          onClick={handleComplete}
          disabled={isComplete}
          size="icon"
          className={cn(
            "h-12 w-12 rounded-full transition-all duration-300",
            isComplete
              ? "bg-success text-success-foreground cursor-default"
              : "bg-primary text-primary-foreground hover:bg-primary/90",
            isAnimating && "animate-check-bounce"
          )}
        >
          <Check className={cn("h-5 w-5", isComplete && "stroke-[3]")} />
        </Button>
      </div>
    </div>
  );
}
