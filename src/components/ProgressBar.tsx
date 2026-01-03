import { cn } from "@/lib/utils";

interface ProgressBarProps {
  percent: number;
  className?: string;
}

export function ProgressBar({ percent, className }: ProgressBarProps) {
  const isComplete = percent >= 100;

  return (
    <div
      className={cn(
        "h-2 w-full rounded-full bg-progress-bg overflow-hidden",
        className
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500 ease-out",
          isComplete ? "bg-success" : "bg-progress-fill"
        )}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
