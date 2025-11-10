import type { KanbanCardProps } from "./KanbanBoard.types";
import {
  getInitials,
  isOverdue,
  getPriorityColor,
  formatDate,
} from "../../utils/task.utils";
import clsx from "clsx";
import { useState } from "react";

const KanbanCard: React.FC<KanbanCardProps> = ({
  task,
  columnId,
  handleDragStart,
  handleDragEnd,
  isDragging,
  onEdit,
  onRequestDelete,
  onKeyboardMove,
}) => {
  const [isKeyboardGrabbed, setKeyboardGrabbed] = useState(false);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    // SPACE or ENTER toggles grab mode
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      setKeyboardGrabbed((prev) => !prev);
      return;
    }

    if (!isKeyboardGrabbed) return;

    // arrow-key movement inside grabbed mode
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      onKeyboardMove?.(task.id, columnId, e.key);
    }
  }

  return (
    <div
      draggable
      tabIndex={0}
      role='button'
      onKeyDown={handleKeyDown}
      onDragStart={(e) => handleDragStart(e, task.id, columnId)}
      onDragEnd={handleDragEnd}
      onDoubleClick={() => onEdit?.(task)}
      aria-label={`${task.title}. Press space to grab.`}
      className={clsx(
        "bg-white border border-neutral-200 rounded-xl p-4 relative shadow-sm",
        "transition-all duration-200 cursor-grab active:cursor-grabbing",
        "hover:shadow-md hover:-translate-y-[2px]",
        isDragging && "opacity-60 scale-[0.97] shadow-lg",
        isKeyboardGrabbed && "ring-2 ring-blue-500"
      )}>
      {/* DELETE BUTTON ON TOP-LEFT */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRequestDelete?.(task);
        }}
        aria-label={`Delete ${task.title}`}
        className='absolute top-2 left-2 w-5 h-5 flex items-center justify-center text-red-600 hover:text-red-700'>
        <span className='relative block w-3 h-3'>
          <span className='absolute inset-0 w-3 h-[2px] bg-current rotate-45 rounded'></span>
          <span className='absolute inset-0 w-3 h-[2px] bg-current -rotate-45 rounded'></span>
        </span>
      </button>

      {/* TITLE + PRIORITY */}
      <div className='flex items-start justify-between mb-3 mt-2'>
        <h4 className='font-medium text-[15px] text-neutral-900 leading-snug line-clamp-2'>
          {task.title}
        </h4>

        {task.priority && (
          <span
            className={clsx(
              "text-[11px] px-2 py-0.5 rounded-full font-medium capitalize",
              getPriorityColor(task.priority)
            )}>
            {task.priority}
          </span>
        )}
      </div>

      {/* Description */}
      {task.description && (
        <p className='text-xs text-neutral-600 mb-3 line-clamp-2 leading-relaxed'>
          {task.description}
        </p>
      )}

      {/* Tags + Assignee */}
      <div className='flex items-center justify-between mb-2'>
        <div className='flex flex-wrap gap-1'>
          {task.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className='text-[11px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full border border-neutral-200'>
              {tag}
            </span>
          ))}
        </div>

        {task.assignee && (
          <div className='w-7 h-7 bg-primary-500 rounded-full text-white text-xs flex items-center justify-center font-medium shadow'>
            {getInitials(task.assignee)}
          </div>
        )}
      </div>

      {/* Due Date */}
      {task.dueDate && (
        <div
          className={clsx(
            "text-[11px] mt-1 font-medium",
            isOverdue(task.dueDate) ? "text-red-600" : "text-neutral-500"
          )}>
          Due: {formatDate(task.dueDate)}
        </div>
      )}
    </div>
  );
};

export default KanbanCard;
