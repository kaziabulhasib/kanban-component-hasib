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
  isDragging?: boolean;
  onEdit?: (task: KanbanTask) => void;
  onDelete?: (taskId: string) => void;
}
