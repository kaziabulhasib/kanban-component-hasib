export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  status: string; // column id
  priority?: "low" | "medium" | "high" | "urgent";
  assignee?: string;
  tags?: string[];
  createdAt: Date;
  dueDate?: Date;
}

export interface KanbanCardProps {
  task: KanbanTask;
  columnId: string;
  handleDragStart: (
    e: React.DragEvent<HTMLElement>,
    id: string,
    columnId: string
  ) => void;

  handleDragEnd: () => void;

  isDragging?: boolean;

  onEdit?: (task: KanbanTask) => void;
  onDelete?: (taskId: string) => void;
}

// types for columns

export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  taskIds: string[];
  maxTasks?: number;
}

export interface KanbanColumnProps {
  column: KanbanColumn;
  tasks: KanbanTask[];

  onTaskMove: (
    taskId: string,
    fromColumnId: string,
    toColumnId: string,
    newIndex: number
  ) => void;

  onTaskCreate: (columnId: string, task: KanbanTask) => void;
  onTaskUpdate: (taskId: string, updates: Partial<KanbanTask>) => void;
  onTaskDelete: (taskId: string) => void;

  //   drag handlers
  handleDragStart: (
    e: React.DragEvent<HTMLElement>,
    taskId: string,
    columnId: string
  ) => void;

  handleDragEnd: () => void;
  handleDragOver: (e: React.DragEvent<HTMLElement>, columnId: string) => void;

  handleDrop: (e: React.DragEvent<HTMLElement>, columnId: string) => void;
}

// types for the Kanban board

export interface KanbanViewProps {
  columns: KanbanColumn[];
  tasks: Record<string, KanbanTask>;
  onTaskMove: (
    taskId: string,
    fromColumn: string,
    toColumn: string,
    newIndex: number
  ) => void;
  onTaskCreate: (columnId: string, task: KanbanTask) => void;
  onTaskUpdate: (taskId: string, updates: Partial<KanbanTask>) => void;
  onTaskDelete: (taskId: string) => void;
}
