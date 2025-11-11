import type { Meta, StoryObj } from "@storybook/react";
import KanbanColumn from "./KanbanColumn";
import type {
  KanbanColumn as ColumnType,
  KanbanTask,
} from "./KanbanBoard.types";

const mockTasks: Record<string, KanbanTask> = {
  t1: {
    id: "t1",
    title: "Complete Assignment",
    description: "Finish the Kanban project",
    priority: "high",
    status: "todo",
    tags: ["work", "urgent"],
    createdAt: new Date(),
  },
  t2: {
    id: "t2",
    title: "Buy Groceries",
    description: "Milk, eggs, bread",
    priority: "medium",
    status: "todo",
    tags: ["personal"],
    createdAt: new Date(),
  },
};

const baseColumn: ColumnType = {
  id: "todo",
  title: "To Do",
  color: "#e4e4e7",
  taskIds: [],
  maxTasks: 5,
};

const meta: Meta<typeof KanbanColumn> = {
  title: "Kanban/KanbanColumn",
  component: KanbanColumn,
};

export default meta;

type Story = StoryObj<typeof KanbanColumn>;

// Common no-op functions
const noop = () => {};

export const Default: Story = {
  args: {
    column: { ...baseColumn, taskIds: ["t1", "t2"] },
    tasks: [mockTasks.t1, mockTasks.t2],
    handleDrop: noop,
    handleDragStart: noop,
    handleDragEnd: noop,
    handleDragOver: noop,
    onTaskCreate: noop,
    onEditTask: noop,
    onRequestDelete: noop,
    onKeyboardMove: noop,
    dragData: {
      taskId: null,
      fromColumnId: null,
    },
  },
};

export const Empty: Story = {
  args: {
    ...Default.args,
    column: { ...baseColumn, taskIds: [] },
    tasks: [],
  },
};

export const Full: Story = {
  args: {
    ...Default.args,
    column: {
      ...baseColumn,
      taskIds: ["t1", "t2", "t3", "t4", "t5"],
      maxTasks: 5,
    },
    tasks: [
      mockTasks.t1,
      mockTasks.t2,
      { ...mockTasks.t1, id: "t3", title: "Task 3" },
      { ...mockTasks.t1, id: "t4", title: "Task 4" },
      { ...mockTasks.t1, id: "t5", title: "Task 5" },
    ],
  },
};

export const DraggingInside: Story = {
  args: {
    ...Default.args,
    dragData: {
      taskId: "t1",
      fromColumnId: "todo",
    },
  },
};

export const DraggingFromAnotherColumn: Story = {
  args: {
    ...Default.args,
    dragData: {
      taskId: "x999",
      fromColumnId: "review",
    },
  },
};
