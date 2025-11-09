/* eslint-disable @typescript-eslint/no-unused-vars */
import type { KanbanCardProps } from "./KanbanBoard.types";
import {
  getInitials,
  isOverdue,
  getPriorityColor,
  formatDate,
} from "../../utils/task.utils";
import clsx from "clsx";
const KanbanCard: React.FC<KanbanCardProps> = ({
  task,
  columnId,
  handleDragStart,
  handleDragEnd,
  isDragging,
  onEdit,
  onDelete,
  onRequestDelete,
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, task.id, columnId)}
      onDragEnd={handleDragEnd}
      role='button'
      tabIndex={0}
      aria-label={`${task.title}. Status: ${task.status}. Priority: ${
        task.priority ?? "none"
      }. Press space to grab.`}
      className={clsx(
        "bg-white border border-neutral-200 rounded-lg p-3 shadow-sm",
        "hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing",
        isDragging && "opacity-90 scale-[1.02]"
      )}
      onDoubleClick={() => onEdit?.(task)}>
      {/* Title + Priority */}
      <div className='flex items-start justify-between mb-2'>
        <h4 className='font-medium text-sm text-neutral-900 line-clamp-2'>
          {task.title}
        </h4>

        {/* {task.priority && (
          <span
            className={clsx(
              "text-xs px-2 py-0.5 rounded",
              getPriorityColor(task.priority)
            )}>
            {task.priority}
          </span>
        )} */}

        {/* priority & delete request */}
        <div className='flex items-center gap-2'>
          {task.priority && (
            <span
              className={clsx(
                "text-xs px-2 py-0.5 rounded",
                getPriorityColor(task.priority)
              )}>
              {task.priority}
            </span>
          )}
          <button
            className='text-xs text-red-600 hover:underline'
            onClick={(e) => {
              e.stopPropagation();
              onRequestDelete?.(task);
            }}
            aria-label={`Delete ${task.title}`}>
            Delete
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className='text-xs text-neutral-600 mb-2 line-clamp-2'>
          {task.description}
        </p>
      )}

      {/* Tags + Assignee */}
      <div className='flex items-center justify-between'>
        <div className='flex gap-1'>
          {task.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className='text-xs bg-neutral-100 px-2 py-0.5 rounded'>
              {tag}
            </span>
          ))}
        </div>

        {task.assignee && (
          <div className='w-6 h-6 bg-primary-500 rounded-full text-white text-xs flex items-center justify-center'>
            {getInitials(task.assignee)}
          </div>
        )}
      </div>

      {/* Due Date */}
      {task.dueDate && (
        <div
          className={clsx(
            "text-xs mt-2",
            isOverdue(task.dueDate) ? "text-red-600" : "text-neutral-500"
          )}>
          Due: {formatDate(task.dueDate)}
        </div>
      )}
    </div>
  );
};

export default KanbanCard;
