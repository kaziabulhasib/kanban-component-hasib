import KanbanBoard from "./components/kanbanboard/KanbanBoard";
import type {
  KanbanColumn as ColumnType,
  KanbanTask,
} from "./components/kanbanboard/KanbanBoard.types";

function App() {
  const columns: ColumnType[] = [
    {
      id: "todo",
      title: "To Do",
      color: "#e879f9",
      taskIds: ["t1"],
      maxTasks: 10,
    },
    {
      id: "progress",
      title: "In Progress",
      color: "#facc15",
      taskIds: ["t3", "t2"],
      maxTasks: 5,
    },
    {
      id: "review",
      title: "Review",
      color: "#86efac",
      taskIds: [],
      maxTasks: 3,
    },
    {
      id: "done",
      title: "Done",
      color: "#60a5fa",
      taskIds: ["t4"],
      maxTasks: 20,
    },
    {
      id: "abandoned",
      title: "Abandoned",
      color: "#FF7F7F",
      taskIds: ["t5"],
      maxTasks: 12,
    },
  ];

  const tasks: Record<string, KanbanTask> = {
    t1: {
      id: "t1",
      title: "Implement drag & drop",
      status: "todo",
      priority: "high",
      tags: ["frontend"],
      createdAt: new Date(),
    },
    t2: {
      id: "t2",
      title: "Design task modal",
      status: "todo",
      priority: "medium",
      tags: ["ui", "design"],
      createdAt: new Date(),
    },
    t3: {
      id: "t3",
      title: "API integration",
      status: "progress",
      priority: "urgent",
      tags: ["backend"],
      createdAt: new Date(),
    },
    t4: {
      id: "t4",
      title: "Setup project",
      status: "done",
      priority: "low",
      tags: ["setup"],
      createdAt: new Date(),
    },
    t5: {
      id: "t5",
      title: "abandoned task",
      status: "abandoned",
      priority: "low",
      tags: ["finised"],
      createdAt: new Date(),
    },
  };

  return (
    <KanbanBoard
      columns={columns}
      tasks={tasks}
      onTaskCreate={(colId, task) => console.log("Create", colId, task)}
      onTaskMove={(taskId, from, to, idx) =>
        console.log("Move", taskId, from, to, idx)
      }
      onTaskUpdate={(taskId, updates) => console.log("Update", taskId, updates)}
      onTaskDelete={(taskId) => console.log("Delete", taskId)}
    />
  );
}

export default App;
