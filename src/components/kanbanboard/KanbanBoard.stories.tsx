import type { Meta, StoryObj } from "@storybook/react";
import KanbanBoardWrapper from "./KanbanBoardWrapper";
import type { KanbanColumn, KanbanTask } from "./KanbanBoard.types";

const baseColumns: KanbanColumn[] = [
  { id: "todo", title: "To Do", color: "#d4d4d8", taskIds: ["t1", "t2"] },
  { id: "progress", title: "In Progress", color: "#93c5fd", taskIds: ["t3"] },
  { id: "review", title: "Review", color: "#fcd34d", taskIds: [] },
  { id: "done", title: "Done", color: "#86efac", taskIds: ["t4"] },
];

const baseTasks: Record<string, KanbanTask> = {
  t1: {
    id: "t1",
    title: "Finish Storybook",
    description: "Add stories",
    status: "todo",
    priority: "high",
    tags: ["frontend"],
    createdAt: new Date(),
  },
  t2: {
    id: "t2",
    title: "Write README",
    status: "todo",
    priority: "medium",
    tags: ["docs"],
    createdAt: new Date(),
  },
  t3: {
    id: "t3",
    title: "Fix drag",
    status: "progress",
    priority: "urgent",
    tags: ["bug"],
    createdAt: new Date(),
  },
  t4: {
    id: "t4",
    title: "Refactor components",
    status: "done",
    priority: "low",
    tags: ["cleanup"],
    createdAt: new Date(),
  },
};

const noop = () => {};

const meta: Meta<typeof KanbanBoardWrapper> = {
  title: "Kanban/KanbanBoard",
  component: KanbanBoardWrapper,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof KanbanBoardWrapper>;

export const Default: Story = {
  args: {
    columns: baseColumns,
    tasks: baseTasks,
    onTaskMove: noop,
    onTaskUpdate: noop,
    onTaskDelete: noop,
    onTaskCreate: noop,
  },
};

export const Empty: Story = {
  args: {
    columns: baseColumns.map((c) => ({ ...c, taskIds: [] })),
    tasks: {},
    onTaskMove: noop,
    onTaskUpdate: noop,
    onTaskDelete: noop,
    onTaskCreate: noop,
  },
};

const manyTasks: Record<string, KanbanTask> = {};
const manyCols: KanbanColumn[] = JSON.parse(JSON.stringify(baseColumns));

for (let i = 1; i <= 30; i++) {
  const id = `m${i}`;
  manyTasks[id] = {
    id,
    title: `Task ${i}`,
    status: "todo",
    priority: "medium",
    tags: ["load-test"],
    createdAt: new Date(),
  };
  manyCols[0].taskIds.push(id);
}

export const LargeDataset: Story = {
  args: {
    columns: manyCols,
    tasks: manyTasks,
    onTaskMove: noop,
    onTaskUpdate: noop,
    onTaskDelete: noop,
    onTaskCreate: noop,
  },
};

export const MobileView: Story = {
  parameters: { viewport: { defaultViewport: "iphone12" } },
  args: Default.args,
};

export const Interactive: Story = {
  args: Default.args,
  parameters: { controls: { expanded: true } },
};
