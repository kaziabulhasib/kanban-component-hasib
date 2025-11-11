import type { Meta, StoryObj } from "@storybook/react";
import KanbanBoard from "./KanbanBoard";
import type { KanbanColumn, KanbanTask } from "./KanbanBoard.types";

const noop = () => {};

const columns: KanbanColumn[] = [
  {
    id: "todo",
    title: "To Do",
    color: "#e57373",
    taskIds: ["t1", "t2"],
    maxTasks: 5,
  },
  {
    id: "inprogress",
    title: "In Progress",
    color: "#fbc02d",
    taskIds: [],
    maxTasks: 5,
  },
  {
    id: "review",
    title: "Review",
    color: "#81c784",
    taskIds: [],
    maxTasks: 5,
  },
  {
    id: "done",
    title: "Done",
    color: "#64b5f6",
    taskIds: [],
    maxTasks: 5,
  },
];

const tasks: Record<string, KanbanTask> = {
  t1: {
    id: "t1",
    title: "Complete Assignment",
    description: "Finish the Kanban project",
    priority: "high",
    status: "todo",
    tags: ["urgent", "work"],
    createdAt: new Date(),
  },
  t2: {
    id: "t2",
    title: "Buy groceries",
    description: "Milk, eggs, bread",
    priority: "medium",
    status: "todo",
    tags: ["personal"],
    createdAt: new Date(),
  },
};

const meta: Meta<typeof KanbanBoard> = {
  title: "Kanban/KanbanBoard",
  component: KanbanBoard,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof KanbanBoard>;

export const Default: Story = {
  args: {
    columns,
    tasks,
    onTaskMove: noop,
    onTaskUpdate: noop,
    onTaskDelete: noop,
  },
};
