import React from "react";
import type { KanbanViewProps } from "./KanbanBoard.types";

import TaskModal from "./TaskModal";
import ConfirmDelete from "../primitives/ConfirmDelete";
import KanbanColumnComponent from "./KanbanColumn";

import { useKanbanBoard } from "./useKanbanBoard";
import { useDragAndDrop } from "./useDragAndDrop";

const KanbanBoard: React.FC<KanbanViewProps> = ({
  columns,
  tasks,
  onTaskMove,
  onTaskUpdate,
  onTaskDelete,
}) => {
  const {
    columnState,
    taskState,
    isModalOpen,
    activeColumnId,
    draftTask,
    openCreate,
    openEdit,
    setIsModalOpen,
    confirmOpen,
    taskToDelete,
    requestDelete,
    confirmDelete,
    setConfirmOpen,
    handleKeyboardMove,
    setColumnState,
    setTaskState,
  } = useKanbanBoard(columns, tasks, {
    onTaskMove,
    onTaskUpdate,
    onTaskDelete,
  });

  const {
    dragData,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
  } = useDragAndDrop(columnState, setColumnState, setTaskState, onTaskMove);

  return (
    <div className='w-full h-screen bg-neutral-100 p-4 overflow-hidden flex flex-col'>
      <div
        className='
          flex gap-2 mb-3 sm:hidden
          overflow-x-auto whitespace-nowrap scrollbar-hide py-1
        '>
        {columnState.map((col, index) => (
          <button
            key={col.id}
            onClick={() => {
              const slider = document.getElementById("kanban-slider");
              if (!slider) return;
              const width = slider.clientWidth;
              slider.scrollTo({ left: width * index, behavior: "smooth" });
            }}
            className='
              px-4 py-2 text-sm rounded-lg
              bg-neutral-200 whitespace-nowrap shrink-0
            '>
            {col.title}
          </button>
        ))}
      </div>

      <div
        id='kanban-slider'
        className='
          flex gap-4 overflow-x-auto scroll-smooth
          max-sm:flex-nowrap max-sm:snap-x max-sm:snap-mandatory
          md:flex-nowrap md:snap-x md:snap-mandatory
          lg:flex-nowrap
          flex-1
          pb-4
        '
        style={{ scrollSnapType: "x mandatory" }}>
        {columnState.map((column) => {
          const tasksForColumn = column.taskIds
            .map((id) => taskState[id])
            .filter(Boolean);

          return (
            <div
              key={column.id}
              className='
                shrink-0 snap-start
                w-full md:w-1/2 lg:w-[320px]
              '>
              <KanbanColumnComponent
                column={column}
                tasks={tasksForColumn}
                handleDragStart={handleDragStart}
                handleDragEnd={handleDragEnd}
                handleDrop={handleDrop}
                handleDragOver={handleDragOver}
                onTaskCreate={openCreate}
                onTaskMove={onTaskMove}
                onTaskUpdate={onTaskUpdate}
                onRequestDelete={requestDelete}
                onTaskDelete={confirmDelete}
                onEditTask={openEdit}
                onKeyboardMove={handleKeyboardMove}
                dragData={dragData}
              />
            </div>
          );
        })}
      </div>

      <TaskModal
        open={isModalOpen}
        initialTask={draftTask}
        onClose={() => setIsModalOpen(false)}
        onSave={(updated) => {
          if (draftTask) {
            const id = draftTask.id;
            setTaskState((prev) => ({
              ...prev,
              [id]: {
                ...prev[id],
                ...updated,
              },
            }));
            setIsModalOpen(false);
            return;
          }

          if (!activeColumnId) return;

          const newTask = {
            id: crypto.randomUUID(),
            title: updated.title ?? "",
            description: updated.description,
            priority: updated.priority,
            tags: updated.tags ?? [],
            dueDate: updated.dueDate,
            status: activeColumnId,
            createdAt: new Date(),
          };

          setTaskState((prev) => ({ ...prev, [newTask.id]: newTask }));

          setColumnState((prev) =>
            prev.map((col) =>
              col.id === activeColumnId
                ? { ...col, taskIds: [...col.taskIds, newTask.id] }
                : col
            )
          );

          setIsModalOpen(false);
        }}
      />

      <ConfirmDelete
        open={confirmOpen}
        task={taskToDelete}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default KanbanBoard;
