import { useState, useEffect, useCallback } from "react";
import { Resolution, ResolutionFormData } from "@/types/resolution";
import { loadResolutions, saveResolutions, generateId } from "@/lib/storage";

export function useResolutions() {
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const loaded = loadResolutions();
    setResolutions(loaded);
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever resolutions change
  useEffect(() => {
    if (isLoaded) {
      saveResolutions(resolutions);
    }
  }, [resolutions, isLoaded]);

  const addResolution = useCallback((data: ResolutionFormData) => {
    const newResolution: Resolution = {
      id: generateId(),
      title: data.title,
      note: data.note,
      frequency: {
        type: data.frequencyType,
        targetCount: data.targetCount,
      },
      completions: [],
      createdAt: Date.now(),
    };

    setResolutions((prev) => [...prev, newResolution]);
    return newResolution;
  }, []);

  const updateResolution = useCallback(
    (id: string, data: Partial<ResolutionFormData>) => {
      setResolutions((prev) =>
        prev.map((r) => {
          if (r.id !== id) return r;
          return {
            ...r,
            title: data.title ?? r.title,
            note: data.note ?? r.note,
            frequency: {
              type: data.frequencyType ?? r.frequency.type,
              targetCount: data.targetCount ?? r.frequency.targetCount,
            },
          };
        })
      );
    },
    []
  );

  const deleteResolution = useCallback((id: string) => {
    setResolutions((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const addCompletion = useCallback((id: string) => {
    setResolutions((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        return {
          ...r,
          completions: [...r.completions, { timestamp: Date.now() }],
        };
      })
    );
  }, []);

  return {
    resolutions,
    isLoaded,
    addResolution,
    updateResolution,
    deleteResolution,
    addCompletion,
  };
}
