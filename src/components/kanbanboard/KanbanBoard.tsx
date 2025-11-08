/* eslint-disable @typescript-eslint/no-unused-vars */
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
  }>({
    taskId: null,
    fromColumnId: null,
  });

  const [columnState, setColumnState] = useState(columns);
  const [taskState, setTaskState] = useState(tasks);

  // drag functions

  function handleDragStart(
    e: React.DragEvent,
    taskId: string,
    fromColumnId: string
  ) {
    // Store in React state
    setDragData({ taskId, fromColumnId });

    // Store in DataTransfer (required for HTML DnD)
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
    });
  }

  function handleDrop(
    e: React.DragEvent<HTMLDivElement>,
    targetColumnId: string
  ) {
    e.preventDefault();

    const data = JSON.parse(e.dataTransfer.getData("application/json"));

    const { taskId, fromColumnId } = data;

    if (!taskId || !fromColumnId) return;
    // same col check
    if (fromColumnId === targetColumnId) return;

    const updatedColumns = [...columnState];
    // find - source & target col.
    const sourceCol = updatedColumns.find((col) => col.id === fromColumnId);
    const targetCol = updatedColumns.find((col) => col.id === targetColumnId);

    if (!sourceCol || !targetCol) return;

    // remove task -s from
    sourceCol.taskIds = sourceCol.taskIds.filter((id) => id !== taskId);

    // add task - target
    targetCol.taskIds.push(taskId);

    // update task status
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
      targetCol.taskIds.length - 1
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
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={tasksForColumn}
              handleDragStart={handleDragStart}
              handleDragEnd={handleDragEnd}
              handleDrop={handleDrop}
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
