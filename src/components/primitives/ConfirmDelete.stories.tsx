import type { Meta, StoryObj } from "@storybook/react";
import ConfirmDelete from "./ConfirmDelete";
import type { KanbanTask } from "../kanbanboard/KanbanBoard.types";

const meta: Meta<typeof ConfirmDelete> = {
  title: "Kanban/ConfirmDelete",
  component: ConfirmDelete,
};

export default meta;

type Story = StoryObj<typeof ConfirmDelete>;

const mockTask: KanbanTask = {
  id: "t1",
  title: "Remove Old File",
  description: "Delete unnecessary assets",
  priority: "medium",
  status: "review",
  tags: ["cleanup"],
  createdAt: new Date(),
  dueDate: new Date(),
};

export const Default: Story = {
  args: {
    open: true,
    task: mockTask,
    onClose: () => {},
    onConfirm: () => {},
  },
};
