import { useEffect, useState } from "react";
import KanbanBoard from "./KanbanBoard";
import type {
  KanbanViewProps,
  KanbanColumn,
  KanbanTask,
} from "./KanbanBoard.types";

const KanbanBoardWrapper: React.FC<KanbanViewProps> = ({
  columns,
  tasks,
  onTaskMove,
  onTaskUpdate,
  onTaskDelete,
  onTaskCreate,
}) => {
  const [cols, setCols] = useState<KanbanColumn[]>(columns);
  const [taskMap, setTaskMap] = useState<Record<string, KanbanTask>>(tasks);

  useEffect(() => setCols(columns), [columns]);
  useEffect(() => setTaskMap(tasks), [tasks]);

  return (
    <KanbanBoard
      columns={cols}
      tasks={taskMap}
      onTaskMove={onTaskMove}
      onTaskUpdate={onTaskUpdate}
      onTaskDelete={onTaskDelete}
      onTaskCreate={onTaskCreate}
    />
  );
};

export default KanbanBoardWrapper;
