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
      <div className='space-y-6'>
        <h2 className='text-2xl font-semibold text-neutral-900'>
          {initialTask ? "New Task" : "Edit Task"}
        </h2>

        <div className='grid grid-cols-1 gap-5'>
          {/* Title */}
          <div>
            <label className='block text-sm mb-1 font-medium text-neutral-700'>
              Title *
            </label>
            <input
              type='text'
              className='w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className='block text-sm mb-1 font-medium text-neutral-700'>
              Description
            </label>
            <textarea
              className='w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Priority */}
          <div className='grid grid-cols-1 gap-2'>
            <label className='block text-sm font-medium text-neutral-700'>
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className='w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500'>
              {priorities.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className='block text-sm mb-1 font-medium text-neutral-700'>
              Tags{" "}
              <span className='text-[11px] font-light '>
                {" "}
                (separate with commas)
              </span>
            </label>
            <input
              type='text'
              className='w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              value={tags.join(", ")}
              onChange={(e) =>
                setTags(
                  e.target.value
                    .split(/[, ]+/)
                    .map((t) => t.trim())
                    .filter(Boolean)
                )
              }
            />
          </div>

          {/* Due Date */}
          <div>
            <label className='block text-sm mb-1 font-medium text-neutral-700'>
              Due Date
            </label>
            <input
              type='date'
              className='w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        {/* Footer buttons */}
        <div className='flex justify-end gap-3 pt-4 border-t border-neutral-200'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-sm rounded-lg bg-neutral-200 hover:bg-neutral-300 transition'>
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className='px-4 py-2 text-sm rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition'>
            {initialTask ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TaskModal;
