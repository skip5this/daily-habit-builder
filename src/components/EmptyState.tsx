import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onAddClick: () => void;
}

export function EmptyState({ onAddClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-6">
        <Sparkles className="w-7 h-7 text-primary" />
      </div>
      <h2 className="font-display text-2xl font-medium text-foreground mb-2">
        Start your journey
      </h2>
      <p className="text-muted-foreground max-w-xs mb-8">
        Create your first resolution and begin tracking your progress, one day at a time.
      </p>
      <Button onClick={onAddClick} size="lg" className="rounded-full px-8">
        Add Resolution
      </Button>
    </div>
  );
}
