import { useState } from "react";
import { FormField, createNewField } from "@/components/form-builder";
import { FieldType } from "@/types/field-types";

const AUTO_SCROLL_THRESHOLD = 100;
const AUTO_SCROLL_SPEED = 10;

export function useDragAndDrop(
  selectedFields: FormField[],
  setSelectedFields: (fields: FormField[]) => void
) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggedFieldType, setDraggedFieldType] = useState<FieldType | null>(null);

  const handleAutoScroll = (clientY: number) => {
    const windowHeight = window.innerHeight;
    if (clientY < AUTO_SCROLL_THRESHOLD) {
      window.scrollBy({ top: -AUTO_SCROLL_SPEED, behavior: "auto" });
    } else if (clientY > windowHeight - AUTO_SCROLL_THRESHOLD) {
      window.scrollBy({ top: AUTO_SCROLL_SPEED, behavior: "auto" });
    }
  };

  const handleDragStart = (index: number) => setDraggedIndex(index);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    handleAutoScroll(e.clientY);

    if (draggedIndex === null || draggedIndex === index) {
      setDragOverIndex(null);
      return;
    }

    setDragOverIndex(index);
    const newFields = [...selectedFields];
    const draggedField = newFields[draggedIndex];
    newFields.splice(draggedIndex, 1);
    newFields.splice(index, 0, draggedField);
    setSelectedFields(newFields);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    setDraggedFieldType(null);
  };

  const handleFieldTypeDragStart = (e: React.DragEvent, type: FieldType) => {
    setDraggedFieldType(type);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleFieldTypeDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (!draggedFieldType) return;
    handleAutoScroll(e.clientY);
    setDragOverIndex(index);
  };

  const handleFieldTypeDrop = (e: React.DragEvent, index: number) => {
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
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    handleAutoScroll(e.clientY);
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedFieldType) {
      const newField = createNewField(draggedFieldType);
      setSelectedFields([...selectedFields, newField]);
      setDraggedFieldType(null);
      setDragOverIndex(null);
    }
  };

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
