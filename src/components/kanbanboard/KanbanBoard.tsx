import React, { useState } from "react";
import KanbanColumn from "./KanbanColumn";

import type { KanbanTask, KanbanViewProps } from "./KanbanBoard.types";

const KanbanBoard: React.FC<KanbanViewProps> = ({
  columns,
  tasks,
  onTaskMove,
  onTaskCreate,
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
              onTaskCreate={(colId) =>
                onTaskCreate(colId, {
                  id: crypto.randomUUID(),
                  title: "New Task",
                  status: colId,
                  createdAt: new Date(),
                })
              }
              // to do :------------------------------> drag-and-drop
              onTaskMove={onTaskMove}
              // edit task (modal later)
              onTaskUpdate={onTaskUpdate}
              // delete task
              onTaskDelete={onTaskDelete}
            />
          );
        })}
      </div>
    </div>
  );
};

export default KanbanBoard;
