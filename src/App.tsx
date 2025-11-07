import type {
  KanbanColumn as ColumnType,
  KanbanTask,
} from "./components/kanbanboard/KanbanBoard.types";
import KanbanColumn from "./components/kanbanboard/KanbanColumn";

function App() {
  const todoColumn: ColumnType = {
    id: "todo",
    title: "To Do",
    color: "#e879f9",
    taskIds: ["task-1", "task-2"],
    maxTasks: 10,
  };

  const sampleTasks: Record<string, KanbanTask> = {
    "task-1": {
      id: "task-1",
      title: "Implement drag & drop",
      status: "todo",
      priority: "high",
      tags: ["frontend"],
      createdAt: new Date(),
    },
    "task-2": {
      id: "task-2",
      title: "Design task modal",
      status: "todo",
      priority: "medium",
      tags: ["ui", "design"],
      createdAt: new Date(),
    },
  };

  const tasksForTodo = todoColumn.taskIds
    .map((id) => sampleTasks[id])
    .filter(Boolean);

  return (
    <div className='p-6 bg-neutral-100 min-h-screen flex'>
      <KanbanColumn
        column={todoColumn}
        tasks={tasksForTodo}
        onTaskCreate={(colId) => console.log("Create task in:", colId)}
      />
    </div>
  );
}

export default App;
