import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onAddClick: () => void;
  hasResolutions: boolean;
}

export function Header({ onAddClick, hasResolutions }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 py-4 px-6">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Resolutions
          </h1>
          <p className="text-sm text-muted-foreground">
            Track your progress
          </p>
        </div>
        {hasResolutions && (
          <Button
            onClick={onAddClick}
            size="icon"
            className="h-10 w-10 rounded-full shadow-soft"
          >
            <Plus className="h-5 w-5" />
          </Button>
        )}
      </div>
    </header>
  );
}
