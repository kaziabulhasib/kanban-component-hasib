import KanbanCard from "./components/kanbanboard/KanbanCard";

function App() {
  const testTask1 = {
    id: "task-1",
    title: "Implement drag & drop",
    description: "Add drag and drop functionality to the Kanban board.",
    status: "todo",
    priority: "high",
    assignee: "John Doe",
    tags: ["frontend", "feature", "urgent"],
    createdAt: new Date(),
    dueDate: new Date(Date.now() + 86400000),
  };
  const testTask2 = {
    id: "task-2",
    title: "new style",
    description: "Add drag and drop functionality to the Kanban board.",
    status: "todo",
    priority: "high",
    assignee: "John Doe",
    tags: ["frontend", "feature", "urgent"],
    createdAt: new Date(),
    dueDate: new Date(Date.now() + 86400000),
  };
  return (
    <div>
      <h1 className='text-primary-600 text-5xl'>hello world</h1>
      <div className='flex'>
        <KanbanCard
          task={testTask1}
          isDragging={false}
          onEdit={(task) => console.log("Edit:", task)}
          onDelete={(id) => console.log("Delete:", id)}
        />
        <KanbanCard
          task={testTask2}
          isDragging={false}
          onEdit={(task) => console.log("Edit:", task)}
          onDelete={(id) => console.log("Delete:", id)}
        />
      </div>
    </div>
  );
}

export default App;
