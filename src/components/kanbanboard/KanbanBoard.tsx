import React, { useState, useEffect } from "react";

import type {
  KanbanTask,
  KanbanViewProps,
  KanbanColumn,
} from "./KanbanBoard.types";
import TaskModal from "./TaskModal";
import ConfirmDelete from "../primitives/ConfirmDelete";
import KanbanColumnComponent from "./KanbanColumn";

const KanbanBoard: React.FC<KanbanViewProps> = ({
  columns,
  tasks,
  onTaskMove,
  onTaskUpdate,
  onTaskDelete,
}) => {
  const STORAGE_TASKS = "kanban_tasks";
  const STORAGE_COLUMNS = "kanban_columns";

  const [columnState, setColumnState] = useState<KanbanColumn[]>(() => {
    const saved = localStorage.getItem(STORAGE_COLUMNS);
    return saved ? JSON.parse(saved) : columns;
  });

  const [taskState, setTaskState] = useState<Record<string, KanbanTask>>(() => {
    const saved = localStorage.getItem(STORAGE_TASKS);
    if (!saved) return tasks;

    const parsed = JSON.parse(saved);

    // rehydrate dates
    for (const id in parsed) {
      if (parsed[id].dueDate) parsed[id].dueDate = new Date(parsed[id].dueDate);
      parsed[id].createdAt = new Date(parsed[id].createdAt);
    }

    return parsed;
  });

  // drag tracking
  const [dragData, setDragData] = useState<{
    taskId: string | null;
    fromColumnId: string | null;
    hoverIndex: number | null;
    targetColumnId: string | null;
  }>({
    taskId: null,
    fromColumnId: null,
    hoverIndex: null,
    targetColumnId: null,
  });

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [draftTask, setDraftTask] = useState<KanbanTask | null>(null);

  // delete confirmation
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<KanbanTask | null>(null);

  //  persist to local storage persist

  useEffect(() => {
    localStorage.setItem(STORAGE_COLUMNS, JSON.stringify(columnState));
  }, [columnState]);

  useEffect(() => {
    localStorage.setItem(STORAGE_TASKS, JSON.stringify(taskState));
  }, [taskState]);

  // drag & drop 

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

  function handleDrop(e: React.DragEvent<HTMLElement>, targetColumnId: string) {
    e.preventDefault();

    const data = JSON.parse(e.dataTransfer.getData("application/json"));
    const { taskId, fromColumnId } = data;

    if (!taskId || !fromColumnId) return;

    const updatedColumns = [...columnState];
    const sourceCol = updatedColumns.find((col) => col.id === fromColumnId);
    const targetCol = updatedColumns.find((col) => col.id === targetColumnId);

    if (!sourceCol || !targetCol) return;

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

    setTaskState((prev) => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        status: targetColumnId,
      },
    }));

    setColumnState(updatedColumns);

    onTaskMove(
      taskId,
      fromColumnId,
      targetColumnId,
      dragData.hoverIndex ?? targetCol.taskIds.length - 1
    );
  }

  function handleDragOver(e: React.DragEvent<HTMLElement>, columnId: string) {
    e.preventDefault();

    const wrapper = (e.target as HTMLElement).closest("[data-index]");
    if (!wrapper) return;

    const hoverIndex = Number(wrapper.getAttribute("data-index"));

    setDragData((prev) => ({
      ...prev,
      hoverIndex,
      targetColumnId: columnId,
    }));
  }

  function handleOpenCreate(columnId: string) {
    setActiveColumnId(columnId);
    setDraftTask(null);
    setIsModalOpen(true);
  }

  function handleEditTask(task: KanbanTask) {
    setDraftTask(task);
    setActiveColumnId(task.status);
    setIsModalOpen(true);
  }

  
  // Delete handler
  

  function handleRequestDelete(task: KanbanTask) {
    setTaskToDelete(task);
    setConfirmOpen(true);
  }

  function handleConfirmDelete(taskId: string) {
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

  // keyboard move

  function handleKeyboardMove(taskId: string, columnId: string, key: string) {
    const colIndex = columnState.findIndex((c) => c.id === columnId);
    if (colIndex === -1) return;

    const column = columnState[colIndex];
    const taskIds = [...column.taskIds];
    const index = taskIds.indexOf(taskId);
    if (index === -1) return;

    if (key === "ArrowUp" && index > 0) {
      const temp = taskIds[index - 1];
      taskIds[index - 1] = taskIds[index];
      taskIds[index] = temp;
    }

    if (key === "ArrowDown" && index < taskIds.length - 1) {
      const temp = taskIds[index + 1];
      taskIds[index + 1] = taskIds[index];
      taskIds[index] = temp;
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

    // reorder same column
    setColumnState((prev) =>
      prev.map((col) => (col.id === columnId ? { ...col, taskIds } : col))
    );
  }

  

  return (
    <div className='w-full min-h-screen overflow-x-auto bg-neutral-100 p-4'>
      <div className='flex gap-4 w-max'>
        {columnState.map((column) => {
          const tasksForColumn: KanbanTask[] = column.taskIds
            .map((id) => taskState[id])
            .filter(Boolean);

          return (
            <KanbanColumnComponent
              key={column.id}
              column={column}
              tasks={tasksForColumn}
              handleDragStart={handleDragStart}
              handleDragEnd={handleDragEnd}
              handleDrop={handleDrop}
              handleDragOver={handleDragOver}
              onTaskCreate={handleOpenCreate}
              onTaskMove={onTaskMove}
              onTaskUpdate={onTaskUpdate}
              onRequestDelete={handleRequestDelete}
              onTaskDelete={handleConfirmDelete}
              onEditTask={handleEditTask}
              onKeyboardMove={handleKeyboardMove}
            />
          );
        })}
      </div>

      {/* Task Modal */}
      <TaskModal
        open={isModalOpen}
        initialTask={draftTask}
        onClose={() => setIsModalOpen(false)}
        onSave={(updated) => {
          if (draftTask) {
            const id = draftTask.id;

            setTaskState((prev) => ({
              ...prev,
              [id]: {
                ...prev[id],
                ...updated,
              },
            }));

            setIsModalOpen(false);
            setDraftTask(null);
            setActiveColumnId(null);
            return;
          }

          if (!activeColumnId) return;

          const newTask: KanbanTask = {
            id: crypto.randomUUID(),
            title: updated.title ?? "",
            description: updated.description,
            priority: updated.priority,
            tags: updated.tags ?? [],
            dueDate: updated.dueDate,
            status: activeColumnId,
            createdAt: new Date(),
          };

          setTaskState((prev) => ({ ...prev, [newTask.id]: newTask }));

          setColumnState((prev) =>
            prev.map((col) =>
              col.id === activeColumnId
                ? { ...col, taskIds: [...col.taskIds, newTask.id] }
                : col
            )
          );

          setIsModalOpen(false);
          setDraftTask(null);
          setActiveColumnId(null);
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDelete
        open={confirmOpen}
        task={taskToDelete}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default KanbanBoard;
