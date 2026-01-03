import { Resolution } from "@/types/resolution";

const STORAGE_KEY = "resolution-tracker-data";

export function loadResolutions(): Resolution[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to load resolutions:", error);
    return [];
  }
}

export function saveResolutions(resolutions: Resolution[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resolutions));
  } catch (error) {
    console.error("Failed to save resolutions:", error);
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
