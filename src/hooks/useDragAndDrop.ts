import { useState, useCallback } from "react";
import { FieldType, FormField, createNewField } from "@/components/form-builder";

// Constantes para auto-scroll durante drag
const AUTO_SCROLL_THRESHOLD = 100;
const AUTO_SCROLL_SPEED = 10;

export function useDragAndDrop(
  selectedFields: FormField[],
  setSelectedFields: (fields: FormField[]) => void
) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggedFieldType, setDraggedFieldType] = useState<FieldType | null>(
    null
  );

  // Auto-scroll quando arrastar perto das bordas
  const handleAutoScroll = useCallback((clientY: number) => {
    const windowHeight = window.innerHeight;

    if (clientY < AUTO_SCROLL_THRESHOLD) {
      window.scrollBy({ top: -AUTO_SCROLL_SPEED, behavior: "auto" });
    } else if (clientY > windowHeight - AUTO_SCROLL_THRESHOLD) {
      window.scrollBy({ top: AUTO_SCROLL_SPEED, behavior: "auto" });
    }
  }, []);

  // Handlers para reordenar campos existentes
  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      handleAutoScroll(e.clientY);

      if (draggedIndex === null || draggedIndex === index) {
        setDragOverIndex(null);
        return;
      }

      setDragOverIndex(index);

      // Reordenar campos em tempo real
      const newFields = [...selectedFields];
      const draggedField = newFields[draggedIndex];
      newFields.splice(draggedIndex, 1);
      newFields.splice(index, 0, draggedField);

      setSelectedFields(newFields);
      setDraggedIndex(index);
    },
    [draggedIndex, selectedFields, setSelectedFields, handleAutoScroll]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    setDraggedFieldType(null);
  }, []);

  // Handlers para arrastar tipos de campo da sidebar
  const handleFieldTypeDragStart = useCallback(
    (e: React.DragEvent, type: FieldType) => {
      setDraggedFieldType(type);
      e.dataTransfer.effectAllowed = "copy";
    },
    []
  );

  const handleFieldTypeDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();

      if (!draggedFieldType) return;

      handleAutoScroll(e.clientY);
      setDragOverIndex(index);
    },
    [draggedFieldType, handleAutoScroll]
  );

  const handleFieldTypeDrop = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      e.stopPropagation();

      if (draggedFieldType) {
        const newField = createNewField(draggedFieldType);
        const newFields = [...selectedFields];
        newFields.splice(index, 0, newField);

        setSelectedFields(newFields);
        setDraggedFieldType(null);
        setDragOverIndex(null);
      }
    },
    [draggedFieldType, selectedFields, setSelectedFields]
  );

  // Handlers para o canvas (drop no final)
  const handleCanvasDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleAutoScroll(e.clientY);
    },
    [handleAutoScroll]
  );

  const handleCanvasDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();

      if (draggedFieldType) {
        const newField = createNewField(draggedFieldType);
        setSelectedFields([...selectedFields, newField]);
        setDraggedFieldType(null);
        setDragOverIndex(null);
      }
    },
    [draggedFieldType, selectedFields, setSelectedFields]
  );

  return {
    draggedIndex,
    dragOverIndex,
    draggedFieldType,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleFieldTypeDragStart,
    handleFieldTypeDragOver,
    handleFieldTypeDrop,
    handleCanvasDragOver,
    handleCanvasDrop,
  };
}
