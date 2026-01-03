export type FrequencyType = "daily" | "weekly" | "monthly";

export interface CompletionRecord {
  timestamp: number;
}

export interface Resolution {
  id: string;
  title: string;
  note?: string;
  frequency: {
    type: FrequencyType;
    targetCount: number;
  };
  completions: CompletionRecord[];
  createdAt: number;
}

export interface ResolutionFormData {
  title: string;
  note?: string;
  frequencyType: FrequencyType;
  targetCount: number;
}
