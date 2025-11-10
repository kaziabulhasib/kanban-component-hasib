import React, { useState } from "react";
import KanbanColumn from "./KanbanColumn";

import type { KanbanTask, KanbanViewProps } from "./KanbanBoard.types";
import TaskModal from "./TaskModal";
import ConfirmDelete from "../primitives/ConfirmDelete";

const KanbanBoard: React.FC<KanbanViewProps> = ({
  columns,
  tasks,
  onTaskMove,

  onTaskUpdate,
  onTaskDelete,
}) => {
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

  const [columnState, setColumnState] = useState(columns);
  const [taskState, setTaskState] = useState(tasks);

  // state for modal

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [draftTask, setDraftTask] = useState<KanbanTask | null>(null);

  // state for delete confirmation

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<KanbanTask | null>(null);

  // drag & drop functions

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
    // Reset drag state
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
      // remove
      sourceCol.taskIds = sourceCol.taskIds.filter((id) => id !== taskId);

      // insert at hoverIndex
      sourceCol.taskIds.splice(dragData.hoverIndex!, 0, taskId);

      setColumnState(updatedColumns);

      onTaskMove(taskId, fromColumnId, targetColumnId, dragData.hoverIndex!);

      return;
    }

    // CROSS-COLUMN MOVE
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

  // modal functions

  function handleOpenCreate(columnId: string) {
    setActiveColumnId(columnId);
    setDraftTask(null); // ✅ important: keep this null for CREATE mode
    setIsModalOpen(true);
  }

  // handle edit task

  function handleEditTask(task: KanbanTask) {
    setDraftTask(task);
    setActiveColumnId(task.status);
    setIsModalOpen(true);
  }

  // delete confirmation
  function handleRequestDelete(task: KanbanTask) {
    setTaskToDelete(task);
    setConfirmOpen(true);
  }

  // delete task

  function handleConfirmDelete(taskId: string) {
    // remove from tasks map
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

  return (
    <div className='w-full min-h-screen overflow-x-auto bg-neutral-100 p-4'>
      <div className='flex gap-4 w-max'>
        {columnState.map((column) => {
          const tasksForColumn: KanbanTask[] = column.taskIds
            .map((id) => taskState[id])
            .filter(Boolean);

          return (
            <KanbanColumn
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
            />
          );
        })}
      </div>
      {/* modal component */}
      <TaskModal
        open={isModalOpen}
        initialTask={draftTask}
        onClose={() => setIsModalOpen(false)}
        onSave={(updated) => {
          // EDIT: if we have a draftTask, update it in place
          if (draftTask) {
            const id = draftTask.id;

            // update the task map
            setTaskState((prev) => ({
              ...prev,
              [id]: {
                ...prev[id],
                ...updated, // title, description, priority, tags, dueDate
              },
            }));

            // (no column change here because your modal doesn't edit status)
            setIsModalOpen(false);
            setDraftTask(null);
            setActiveColumnId(null);
            return;
          }

          // CREATE: if no draftTask, create a new one in the active column
          if (!activeColumnId) return;

          const newTask: KanbanTask = {
            id: crypto.randomUUID(),
            title: updated.title ?? "",
            description: updated.description,
            priority: updated.priority,
            tags: updated.tags ?? [],
            dueDate: updated.dueDate, // this is already a Date from the modal
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

      {/* delete confirmation component  */}

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
