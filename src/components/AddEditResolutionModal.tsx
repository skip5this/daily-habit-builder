import { useEffect, useState } from "react";
import { Resolution, ResolutionFormData, FrequencyType } from "@/types/resolution";
import { getMaxTargetCount } from "@/lib/resolution-utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface AddEditResolutionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resolution?: Resolution | null;
  onSave: (data: ResolutionFormData) => void;
}

export function AddEditResolutionModal({
  open,
  onOpenChange,
  resolution,
  onSave,
}: AddEditResolutionModalProps) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [frequencyType, setFrequencyType] = useState<FrequencyType>("weekly");
  const [targetCount, setTargetCount] = useState(1);

  const isEditing = !!resolution;
  const maxTarget = getMaxTargetCount(frequencyType);

  useEffect(() => {
    if (resolution) {
      setTitle(resolution.title);
      setNote(resolution.note || "");
      setFrequencyType(resolution.frequency.type);
      setTargetCount(resolution.frequency.targetCount);
    } else {
      setTitle("");
      setNote("");
      setFrequencyType("weekly");
      setTargetCount(1);
    }
  }, [resolution, open]);

  useEffect(() => {
    // Adjust target count when frequency type changes
    if (targetCount > maxTarget) {
      setTargetCount(maxTarget);
    }
  }, [frequencyType, maxTarget, targetCount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      note: note.trim() || undefined,
      frequencyType,
      targetCount,
    });
    onOpenChange(false);
  };

  const frequencyLabels: Record<FrequencyType, string> = {
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {isEditing ? "Edit Resolution" : "New Resolution"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label htmlFor="title">What's your resolution?</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Walk with my partner"
              className="text-base"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add any helpful context..."
              className="resize-none text-base"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>How often?</Label>
            <Select
              value={frequencyType}
              onValueChange={(v) => setFrequencyType(v as FrequencyType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {maxTarget > 1 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Target completions</Label>
                <span className="text-sm font-medium text-muted-foreground">
                  {targetCount}x per {frequencyLabels[frequencyType].toLowerCase()}
                </span>
              </div>
              <Slider
                value={[targetCount]}
                onValueChange={([v]) => setTargetCount(v)}
                min={1}
                max={maxTarget}
                step={1}
                className="py-2"
              />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={!title.trim()}>
              {isEditing ? "Save Changes" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
