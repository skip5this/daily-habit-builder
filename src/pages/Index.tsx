import { useState } from "react";
import { Resolution, ResolutionFormData } from "@/types/resolution";
import { useResolutions } from "@/hooks/useResolutions";
import { Header } from "@/components/Header";
import { ResolutionCard } from "@/components/ResolutionCard";
import { EmptyState } from "@/components/EmptyState";
import { AddEditResolutionModal } from "@/components/AddEditResolutionModal";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

const Index = () => {
  const {
    resolutions,
    isLoaded,
    addResolution,
    updateResolution,
    deleteResolution,
    addCompletion,
  } = useResolutions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResolution, setEditingResolution] = useState<Resolution | null>(null);
  const [deletingResolution, setDeletingResolution] = useState<Resolution | null>(null);

  const handleAddClick = () => {
    setEditingResolution(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (resolution: Resolution) => {
    setEditingResolution(resolution);
    setIsModalOpen(true);
  };

  const handleSave = (data: ResolutionFormData) => {
    if (editingResolution) {
      updateResolution(editingResolution.id, data);
      toast.success("Resolution updated");
    } else {
      addResolution(data);
      toast.success("Resolution created");
    }
  };

  const handleComplete = (id: string) => {
    addCompletion(id);
    toast.success("Marked complete!", { duration: 2000 });
  };

  const handleDeleteConfirm = () => {
    if (deletingResolution) {
      deleteResolution(deletingResolution.id);
      toast.success("Resolution deleted");
      setDeletingResolution(null);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onAddClick={handleAddClick} hasResolutions={resolutions.length > 0} />

      <main className="max-w-lg mx-auto px-6 py-8">
        {resolutions.length === 0 ? (
          <EmptyState onAddClick={handleAddClick} />
        ) : (
          <div className="space-y-4">
            {resolutions.map((resolution) => (
              <ResolutionCard
                key={resolution.id}
                resolution={resolution}
                onComplete={() => handleComplete(resolution.id)}
                onEdit={() => handleEditClick(resolution)}
                onDelete={() => setDeletingResolution(resolution)}
              />
            ))}
          </div>
        )}
      </main>

      <AddEditResolutionModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        resolution={editingResolution}
        onSave={handleSave}
      />

      <DeleteConfirmDialog
        open={!!deletingResolution}
        onOpenChange={(open) => !open && setDeletingResolution(null)}
        onConfirm={handleDeleteConfirm}
        title={deletingResolution?.title || ""}
      />

      <Toaster position="bottom-center" />
    </div>
  );
};

export default Index;
