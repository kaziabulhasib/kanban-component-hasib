import Modal from "./Modal";
import type { KanbanTask } from "../kanbanboard/KanbanBoard.types";

interface ConfirmDeleteProps {
  open: boolean;
  task: KanbanTask | null;
  onClose: () => void;
  onConfirm: (taskId: string) => void;
}

const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({ open, task, onClose, onConfirm }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Delete this task?</h2>

        {task && (
          <div className="text-sm space-y-2">
            <div><span className="font-medium">Title:</span> {task.title}</div>
            {task.description && (
              <div className="text-neutral-600 line-clamp-3">{task.description}</div>
            )}
            <div className="flex gap-2 text-neutral-600">
              {task.priority && <span>Priority: {task.priority}</span>}
              {task.dueDate && <span>• Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
            </div>
            {task.tags?.length ? (
              <div className="flex flex-wrap gap-1">
                {task.tags.slice(0, 5).map(t => (
                  <span key={t} className="px-2 py-0.5 text-xs bg-neutral-100 rounded">{t}</span>
                ))}
              </div>
            ) : null}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-3">
          <button className="px-3 py-1.5 rounded bg-neutral-200 hover:bg-neutral-300 text-sm" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
            onClick={() => task && onConfirm(task.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDelete;
