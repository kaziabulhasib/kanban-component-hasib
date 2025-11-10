import React, { useState, useEffect } from "react";
import Modal from "../primitives/Modal";
import type { KanbanTask } from "./KanbanBoard.types";
import Button from "../primitives/Button";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
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
  const [tagsInput, setTagsInput] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || "");
      setPriority(initialTask.priority || "medium");
      setTagsInput((initialTask.tags || []).join(", "));
      setDueDate(
        initialTask.dueDate
          ? new Date(initialTask.dueDate).toISOString().slice(0, 10)
          : ""
      );
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setTagsInput("");
      setDueDate("");
    }
  }, [initialTask]);

  function todayStr() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  function handleSubmit() {
    if (!title.trim()) return alert("Task title is required.");

    if (dueDate && dueDate < todayStr()) {
      alert("Due date cannot be earlier than today.");
      return;
    }

    const parsedTags = tagsInput
      .split(/[, \n]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    onSave({
      title,
      description,
      priority,
      tags: parsedTags,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    onClose();
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className='space-y-6'>
        <h2 className='text-2xl font-semibold text-neutral-900'>
          {initialTask ? "Edit Task" : "New Task"}
        </h2>

        <div className='grid grid-cols-1 gap-5'>
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

          <div>
            <label className='block text-sm mb-1 font-medium text-neutral-700'>
              Tags{" "}
              <span className='text-[11px] font-light'>
                (separate with comma or space)
              </span>
            </label>
            <input
              type='text'
              className='w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>

          <div>
            <label className='block text-sm mb-1 font-medium text-neutral-700'>
              Due Date
            </label>
            <input
              type='date'
              min={todayStr()}
              className='w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className='flex justify-end gap-3 pt-4 border-t border-neutral-200'>
          <Button variant='secondary' onClick={onClose}>
            Cancel
          </Button>

          <Button variant='primary' onClick={handleSubmit}>
            {initialTask ? "Save Changes" : "Create Task"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TaskModal;
