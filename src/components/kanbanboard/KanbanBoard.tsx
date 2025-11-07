/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import KanbanColumn from "./KanbanColumn";

import type {
 
  KanbanTask,
  KanbanViewProps,
} from "./KanbanBoard.types";

const KanbanBoard: React.FC<KanbanViewProps> = ({
  columns,
  tasks,
  onTaskMove,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
}) => {
  return (
    <div className='w-full min-h-screen overflow-x-auto bg-neutral-100 p-4'>
      <div className='flex gap-4 w-max'>
        {columns.map((column) => {
         
          const tasksForColumn: KanbanTask[] = column.taskIds
            .map((id) => tasks[id])
            .filter(Boolean);

          return (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={tasksForColumn}
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
