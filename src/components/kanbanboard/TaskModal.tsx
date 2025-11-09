import React, { useState, useEffect } from "react";
import Modal from "../primitives/Modal";
import type { KanbanTask } from "./KanbanBoard.types";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;

  // create or edit
  initialTask: KanbanTask | null;

  onSave: (taskData: Partial<KanbanTask>) => void;
}

const priorities = ["low", "medium", "high", "urgent"] as const;

const TaskModal: React.FC<TaskModalProps> = ({
  open,
  onClose,
  initialTask,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<KanbanTask["priority"]>("medium");
  const [tags, setTags] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<string>("");

  // Load initial values when editing
  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || "");
      setPriority(initialTask.priority || "medium");
      setTags(initialTask.tags || []);
      setDueDate(
        initialTask.dueDate
          ? new Date(initialTask.dueDate).toISOString().slice(0, 10)
          : ""
      );
    } else {
      // Reset for fresh creation
      setTitle("");
      setDescription("");
      setPriority("medium");
      setTags([]);
      setDueDate("");
    }
  }, [initialTask]);

  function handleSubmit() {
    if (!title.trim()) return alert("Task title is required.");

    onSave({
      title,
      description,
      priority,
      tags,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    onClose();
  }

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className='text-xl font-semibold mb-4'>
        {initialTask ? "Edit Task" : "Create Task"}
      </h2>

      <div className='space-y-4'>
        {/* Title */}
        <div>
          <label className='block text-sm font-medium mb-1'>Title</label>
          <input
            type='text'
            className='w-full border rounded px-3 py-2 text-sm'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div>
          <label className='block text-sm font-medium mb-1'>Description</label>
          <textarea
            className='w-full border rounded px-3 py-2 text-sm h-20 resize-none'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Priority */}
        <div>
          <label className='block text-sm font-medium mb-1'>Priority</label>
          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as KanbanTask["priority"])
            }
            className='w-full border rounded px-3 py-2 text-sm'>
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className='block text-sm font-medium mb-1'>
            Tags (comma separated)
          </label>
          <input
            type='text'
            className='w-full border rounded px-3 py-2 text-sm'
            value={tags.join(", ")}
            onChange={(e) =>
              setTags(
                e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
              )
            }
          />
        </div>

        {/* Due Date */}
        <div>
          <label className='block text-sm font-medium mb-1'>Due Date</label>
          <input
            type='date'
            className='w-full border rounded px-3 py-2 text-sm'
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      <div className='flex justify-end gap-2 mt-6'>
        <button
          className='px-4 py-2 text-sm bg-neutral-200 rounded hover:bg-neutral-300'
          onClick={onClose}>
          Cancel
        </button>

        <button
          className='px-4 py-2 text-sm bg-primary-500 text-white rounded hover:bg-primary-600'
          onClick={handleSubmit}>
          {initialTask ? "Save Changes" : "Create Task"}
        </button>
      </div>
    </Modal>
  );
};

export default TaskModal;
