import type { Meta, StoryObj } from "@storybook/react";
import KanbanCard from "./KanbanCard";

const meta: Meta<typeof KanbanCard> = {
  title: "Kanban/KanbanCard",
  component: KanbanCard,
  parameters: {
    layout: "centered",
  },
};
export default meta;

type Story = StoryObj<typeof KanbanCard>;

const mockTask = {
  id: "1",
  title: "Complete assignment",
  description: "Finish Kanban component task for submission.",
  priority: "high",
  tags: ["frontend", "react"],
  status: "doing",
  dueDate: new Date().toISOString(),
  assignee: "Hasib Kazi",
};

const noop = () => {};

export const Default: Story = {
  args: {
    task: mockTask,
    columnId: "doing",
    handleDragStart: noop,
    handleDragEnd: noop,
    onEdit: noop,
    onRequestDelete: noop,
    onKeyboardMove: noop,
    isDragging: false,
    isSourceColumnDragging: false,
  },
};

export const Dragging: Story = {
  args: {
    ...Default.args,
    isDragging: true,
  },
};

export const SourceColumnDragging: Story = {
  args: {
    ...Default.args,
    isSourceColumnDragging: true,
  },
};
