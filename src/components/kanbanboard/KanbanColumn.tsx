import KanbanCard from "./KanbanCard";
import type { KanbanColumnProps } from "./KanbanBoard.types";
import React from "react";
import Button from "../primitives/Button";

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  tasks,
  handleDrop,
  handleDragStart,
  handleDragEnd,
  handleDragOver,
  onTaskCreate,
  onEditTask,
  onRequestDelete,
  onKeyboardMove,
}) => {
  return (
    <section
      className='
        bg-neutral-50 
        rounded-lg 
        flex flex-col 
        border border-neutral-200 
        shrink-0
      '>
      {/* Header */}
      <header
        className='rounded-t-lg py-2 px-3 text-sm font-semibold text-neutral-900 sticky top-0 z-10'
        style={{ backgroundColor: column.color }}>
        {column.title} ({tasks.length}
        {column.maxTasks ? `/${column.maxTasks}` : ""})
      </header>

      {/* Card List */}
      <div
        className='flex-1 overflow-y-auto p-2 sm:p-3 flex flex-col gap-2 sm:gap-3'
        onDragOver={(e) => {
          e.preventDefault();
          handleDragOver(e, column.id);
        }}
        onDrop={(e) => handleDrop(e, column.id)}>
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <div key={task.id} data-index={index}>
              <KanbanCard
                task={task}
                columnId={column.id}
                handleDragStart={handleDragStart}
                handleDragEnd={handleDragEnd}
                onEdit={onEditTask}
                onRequestDelete={onRequestDelete}
                onKeyboardMove={onKeyboardMove}
              />
            </div>
          ))
        ) : (
          <p className='text-neutral-400 text-sm italic'>No tasks</p>
        )}
      </div>

      {/* Add Task */}
      <Button
        variant='secondary'
        className='rounded-none sm:rounded-b-lg'
        onClick={() => onTaskCreate?.(column.id)}>
        + Add Task
      </Button>
    </section>
  );
};

export default React.memo(KanbanColumn);
