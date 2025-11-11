import type { Meta, StoryObj } from "@storybook/react";
import TaskModal from "./TaskModal";
import type { KanbanTask } from "./KanbanBoard.types";

const meta: Meta<typeof TaskModal> = {
  title: "Kanban/TaskModal",
  component: TaskModal,
};

export default meta;

type Story = StoryObj<typeof TaskModal>;

const mockTask: KanbanTask = {
  id: "t1",
  title: "Edit Feature",
  description: "Improve the drag and drop logic",
  priority: "high",
  status: "todo",
  tags: ["frontend", "react"],
  createdAt: new Date(),
  dueDate: new Date(),
};

export const CreateTask: Story = {
  args: {
    open: true,
    initialTask: null,
    onClose: () => {},
    onSave: () => {},
  },
};

export const EditTask: Story = {
  args: {
    open: true,
    initialTask: mockTask,
    onClose: () => {},
    onSave: () => {},
  },
};
