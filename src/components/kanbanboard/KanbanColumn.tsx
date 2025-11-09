import React from "react";
import KanbanCard from "./KanbanCard";
import type { KanbanColumnProps } from "./KanbanBoard.types";

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  tasks,
  handleDrop,
  handleDragStart,
  handleDragEnd,
  handleDragOver,
  onTaskCreate,
  onEditTask,
}) => {
  return (
    <section className='w-[300px] bg-neutral-50 rounded-lg flex flex-col border border-neutral-200'>
      {/* Header */}
      <header
        className='rounded-t-lg py-2 px-3 text-sm font-semibold text-neutral-900 sticky top-0 z-10'
        style={{ backgroundColor: column.color }}
        aria-label={`${column.title} column. ${tasks.length} tasks.`}>
        {column.title} ({tasks.length}
        {column.maxTasks ? `/${column.maxTasks}` : ""})
      </header>

      {/* Card list */}
      <div
        className='flex-1 overflow-y-auto p-3 flex flex-col gap-3'
        onDragOver={(e) => {
          e.preventDefault();
          handleDragOver(e, column.id);
        }}
        onDrop={(e) => handleDrop(e, column.id)}>
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <div key={task.id} data-index={index}>
              <KanbanCard
                key={task.id}
                task={task}
                columnId={column.id}
                handleDragStart={handleDragStart}
                handleDragEnd={handleDragEnd}
              />
            </div>
          ))
        ) : (
          <p className='text-neutral-400 text-sm italic'>No tasks</p>
        )}
      </div>

      {/* Add task button */}
      <button
        className='py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition rounded-b-lg'
        onClick={() => onTaskCreate?.(column.id)}>
        + Add Task
      </button>
    </section>
  );
};

export default React.memo(KanbanColumn);
