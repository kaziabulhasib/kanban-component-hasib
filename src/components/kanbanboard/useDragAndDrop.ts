import { useState } from "react";
import type { KanbanColumn, KanbanTask } from "./KanbanBoard.types";

export function useDragAndDrop(
  columnState: KanbanColumn[],
  setColumnState: React.Dispatch<React.SetStateAction<KanbanColumn[]>>,
  setTaskState: React.Dispatch<
    React.SetStateAction<Record<string, KanbanTask>>
  >,
  onTaskMove: (
    taskId: string,
    fromColumnId: string,
    toColumnId: string,
    index: number
  ) => void
) {
  const [dragData, setDragData] = useState({
    taskId: null as string | null,
    fromColumnId: null as string | null,
    hoverIndex: null as number | null,
    targetColumnId: null as string | null,
  });

  function handleDragStart(
    e: React.DragEvent<HTMLElement>,
    taskId: string,
    fromColumnId: string
  ) {
    setDragData({
      taskId,
      fromColumnId,
      hoverIndex: null,
      targetColumnId: null,
    });

    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ taskId, fromColumnId })
    );
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragEnd() {
    setDragData({
      taskId: null,
      fromColumnId: null,
      hoverIndex: null,
      targetColumnId: null,
    });
  }

  function handleDragOver(e: React.DragEvent<HTMLElement>, columnId: string) {
    e.preventDefault();

    // ✅ Prevent drag-over on full column
    const col = columnState.find((c) => c.id === columnId);
    if (col?.maxTasks && col.taskIds.length >= col.maxTasks) {
      return;
    }

    const wrapper = (e.target as HTMLElement).closest("[data-index]");
    if (!wrapper) return;

    const hoverIndex = Number(wrapper.getAttribute("data-index"));

    setDragData((prev) => ({ ...prev, hoverIndex, targetColumnId: columnId }));
  }

  function handleDrop(e: React.DragEvent<HTMLElement>, targetColumnId: string) {
    e.preventDefault();

    const data = JSON.parse(e.dataTransfer.getData("application/json"));
    const { taskId, fromColumnId } = data;

    if (!taskId || !fromColumnId) return;

    const updatedColumns = [...columnState];
    const sourceCol = updatedColumns.find((col) => col.id === fromColumnId);
    const targetCol = updatedColumns.find((col) => col.id === targetColumnId);

    if (!sourceCol || !targetCol) return;

    // ✅ Prevent drop into full column
    if (targetCol.maxTasks && targetCol.taskIds.length >= targetCol.maxTasks) {
      alert("Cannot move task. Target column is full.");
      return;
    }

    const isSameColumn = fromColumnId === targetColumnId;

    if (isSameColumn) {
      sourceCol.taskIds = sourceCol.taskIds.filter((id) => id !== taskId);
      sourceCol.taskIds.splice(dragData.hoverIndex!, 0, taskId);

      setColumnState(updatedColumns);
      onTaskMove(taskId, fromColumnId, targetColumnId, dragData.hoverIndex!);
      return;
    }

    sourceCol.taskIds = sourceCol.taskIds.filter((id) => id !== taskId);

    targetCol.taskIds.splice(
      dragData.hoverIndex ?? targetCol.taskIds.length,
      0,
      taskId
    );

    setTaskState((prev: any) => ({
      ...prev,
      [taskId]: { ...prev[taskId], status: targetColumnId },
    }));

    setColumnState(updatedColumns);

    onTaskMove(
      taskId,
      fromColumnId,
      targetColumnId,
      dragData.hoverIndex ?? targetCol.taskIds.length - 1
    );
  }

  return {
    dragData,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
  };
}
