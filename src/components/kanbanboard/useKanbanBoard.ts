import { useState, useEffect } from "react";
import type {
  KanbanTask,
  KanbanColumn,
  KanbanViewProps,
} from "./KanbanBoard.types";

export function useKanbanBoard(
  columns: KanbanColumn[],
  tasks: Record<string, KanbanTask>,
  {
    onTaskDelete,
  }: {
    onTaskMove: KanbanViewProps["onTaskMove"];
    onTaskUpdate: KanbanViewProps["onTaskUpdate"];
    onTaskDelete: KanbanViewProps["onTaskDelete"];
  }
) {
  const STORAGE_TASKS = "kanban_tasks";
  const STORAGE_COLUMNS = "kanban_columns";

  // Column + Task State with persistence
  const [columnState, setColumnState] = useState<KanbanColumn[]>(() => {
    const saved = localStorage.getItem(STORAGE_COLUMNS);
    return saved ? JSON.parse(saved) : columns;
  });

  const [taskState, setTaskState] = useState<Record<string, KanbanTask>>(() => {
    const saved = localStorage.getItem(STORAGE_TASKS);
    if (!saved) return tasks;

    const parsed = JSON.parse(saved);
    for (const id in parsed) {
      if (parsed[id].dueDate) parsed[id].dueDate = new Date(parsed[id].dueDate);
      parsed[id].createdAt = new Date(parsed[id].createdAt);
    }

    return parsed;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_COLUMNS, JSON.stringify(columnState));
  }, [columnState]);

  useEffect(() => {
    localStorage.setItem(STORAGE_TASKS, JSON.stringify(taskState));
  }, [taskState]);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [draftTask, setDraftTask] = useState<KanbanTask | null>(null);

  function openCreate(columnId: string) {
    setActiveColumnId(columnId);
    setDraftTask(null);
    setIsModalOpen(true);
  }

  function openEdit(task: KanbanTask) {
    setDraftTask(task);
    setActiveColumnId(task.status);
    setIsModalOpen(true);
  }

  // Delete flow
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<KanbanTask | null>(null);

  function requestDelete(task: KanbanTask) {
    setTaskToDelete(task);
    setConfirmOpen(true);
  }

  function confirmDelete(taskId: string) {
    setTaskState((prev) => {
      const next = { ...prev };
      delete next[taskId];
      return next;
    });

    setColumnState((prev) =>
      prev.map((col) =>
        col.taskIds.includes(taskId)
          ? { ...col, taskIds: col.taskIds.filter((id) => id !== taskId) }
          : col
      )
    );

    onTaskDelete(taskId);
    setConfirmOpen(false);
    setTaskToDelete(null);
  }

  // Keyboard movement logic stays the same
  function handleKeyboardMove(taskId: string, columnId: string, key: string) {
    const colIndex = columnState.findIndex((c) => c.id === columnId);
    if (colIndex === -1) return;

    const column = columnState[colIndex];
    const taskIds = [...column.taskIds];
    const index = taskIds.indexOf(taskId);
    if (index === -1) return;

    if (key === "ArrowUp" && index > 0) {
      const t = taskIds[index - 1];
      taskIds[index - 1] = taskIds[index];
      taskIds[index] = t;
    }

    if (key === "ArrowDown" && index < taskIds.length - 1) {
      const t = taskIds[index + 1];
      taskIds[index + 1] = taskIds[index];
      taskIds[index] = t;
    }

    if (key === "ArrowLeft" && colIndex > 0) {
      const prevCol = columnState[colIndex - 1];

      setColumnState((prev) =>
        prev.map((col) =>
          col.id === columnId
            ? { ...col, taskIds: col.taskIds.filter((id) => id !== taskId) }
            : col.id === prevCol.id
            ? { ...col, taskIds: [...col.taskIds, taskId] }
            : col
        )
      );

      setTaskState((prev) => ({
        ...prev,
        [taskId]: { ...prev[taskId], status: prevCol.id },
      }));
      return;
    }

    if (key === "ArrowRight" && colIndex < columnState.length - 1) {
      const nextCol = columnState[colIndex + 1];

      setColumnState((prev) =>
        prev.map((col) =>
          col.id === columnId
            ? { ...col, taskIds: col.taskIds.filter((id) => id !== taskId) }
            : col.id === nextCol.id
            ? { ...col, taskIds: [...col.taskIds, taskId] }
            : col
        )
      );

      setTaskState((prev) => ({
        ...prev,
        [taskId]: { ...prev[taskId], status: nextCol.id },
      }));
      return;
    }

    setColumnState((prev) =>
      prev.map((col) => (col.id === columnId ? { ...col, taskIds } : col))
    );
  }

  return {
    // state
    columnState,
    taskState,

    // modal
    isModalOpen,
    activeColumnId,
    draftTask,
    openCreate,
    openEdit,
    setIsModalOpen,

    // delete
    confirmOpen,
    taskToDelete,
    requestDelete,
    confirmDelete,
    setConfirmOpen,
    

    // keyboard
    handleKeyboardMove,

    // setters exposed if needed
    setColumnState,
    setTaskState,


  };
}
