import { Resolution, FrequencyType, CompletionRecord } from "@/types/resolution";
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  endOfDay,
  endOfWeek,
  endOfMonth,
  isWithinInterval,
  subDays,
  subWeeks,
  subMonths,
} from "date-fns";

export function getPeriodBounds(
  frequencyType: FrequencyType,
  referenceDate: Date = new Date()
): { start: Date; end: Date } {
  switch (frequencyType) {
    case "daily":
      return {
        start: startOfDay(referenceDate),
        end: endOfDay(referenceDate),
      };
    case "weekly":
      return {
        start: startOfWeek(referenceDate, { weekStartsOn: 1 }),
        end: endOfWeek(referenceDate, { weekStartsOn: 1 }),
      };
    case "monthly":
      return {
        start: startOfMonth(referenceDate),
        end: endOfMonth(referenceDate),
      };
  }
}

export function getCompletionsInPeriod(
  completions: CompletionRecord[],
  frequencyType: FrequencyType,
  referenceDate: Date = new Date()
): number {
  const { start, end } = getPeriodBounds(frequencyType, referenceDate);
  return completions.filter((c) =>
    isWithinInterval(new Date(c.timestamp), { start, end })
  ).length;
}

export function getCurrentPeriodCount(resolution: Resolution): number {
  return getCompletionsInPeriod(
    resolution.completions,
    resolution.frequency.type
  );
}

export function getProgressPercent(resolution: Resolution): number {
  const current = getCurrentPeriodCount(resolution);
  const target = resolution.frequency.targetCount;
  return Math.min(100, Math.round((current / target) * 100));
}

export function getPreviousPeriodDate(
  frequencyType: FrequencyType,
  referenceDate: Date
): Date {
  switch (frequencyType) {
    case "daily":
      return subDays(referenceDate, 1);
    case "weekly":
      return subWeeks(referenceDate, 1);
    case "monthly":
      return subMonths(referenceDate, 1);
  }
}

export function calculateStreak(resolution: Resolution): number {
  const { frequency, completions } = resolution;
  
  if (completions.length === 0) return 0;

  let streak = 0;
  let checkDate = new Date();
  
  // Check if current period is complete
  const currentPeriodCount = getCompletionsInPeriod(
    completions,
    frequency.type,
    checkDate
  );
  
  // If current period is complete, start counting from current period
  if (currentPeriodCount >= frequency.targetCount) {
    streak = 1;
    checkDate = getPreviousPeriodDate(frequency.type, checkDate);
  } else {
    // Start checking from previous period
    checkDate = getPreviousPeriodDate(frequency.type, checkDate);
  }

  // Count consecutive completed periods going backwards
  while (true) {
    const periodCount = getCompletionsInPeriod(
      completions,
      frequency.type,
      checkDate
    );
    
    if (periodCount >= frequency.targetCount) {
      streak++;
      checkDate = getPreviousPeriodDate(frequency.type, checkDate);
    } else {
      break;
    }
    
    // Safety limit
    if (streak > 1000) break;
  }

  return streak;
}

export function getFrequencyLabel(
  type: FrequencyType,
  targetCount: number
): string {
  const typeLabels: Record<FrequencyType, string> = {
    daily: "day",
    weekly: "week",
    monthly: "month",
  };
  
  const times = targetCount === 1 ? "time" : "times";
  return `${targetCount} ${times} per ${typeLabels[type]}`;
}

export function getMaxTargetCount(type: FrequencyType): number {
  switch (type) {
    case "daily":
      return 1;
    case "weekly":
      return 6;
    case "monthly":
      return 30;
  }
}
