import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakBadgeProps {
  streak: number;
  className?: string;
}

export function StreakBadge({ streak, className }: StreakBadgeProps) {
  if (streak === 0) return null;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded-full bg-streak/10 text-streak",
        className
      )}
    >
      <Flame className="w-3.5 h-3.5" />
      <span className="text-xs font-medium">{streak}</span>
    </div>
  );
}
