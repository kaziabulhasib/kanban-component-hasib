# Kanban Board – Assignment Submission

A fully interactive, accessible, and responsive Kanban Board built with React,Tailwind Css, Typescript. Includes drag-and-drop, keyboard navigation, task CRUD, column limits, and LocalStorage persistence.

## ✅ Features

### ✅ Task Management

- Create tasks
- Edit tasks
- Delete tasks with confirmation
- Priority, tags, due date, assignee initials
- Auto Date rehydration after LocalStorage load

### ✅ Drag & Drop

- Drag within column
- Drag between columns
- Smooth hover index tracking
- Ghost fade effect
- Prevent dropping into full columns

### ✅ Keyboard Navigation

- Press **Space** to "grab"
- **ArrowUp / ArrowDown** reorder inside column
- **ArrowLeft / ArrowRight** move column-to-column
- Focus ring when card is grabbed

### ✅ Column Limits

- Shows count like **2/10**
- Blocks adding tasks when max reached
- Disables "+ Add Task"
- Blocks drag-and-drop into full columns

### ✅ Responsive Layout

- Mobile: 1 column full-width
- Tablet: 2 columns
- Desktop: horizontal layout with scroll
- Cards adapt to smaller viewports

### ✅ State Persistence (LocalStorage)

- Saves tasks & columns automatically
- Loads state on refresh
- Restores dates (rehydration)

### ✅ Clean Architecture (Refactored)

```
src/
  components/
    kanbanboard/
      KanbanBoard.tsx
      KanbanBoard.types.ts
      KanbanCard.tsx
      KanbanColumn.tsx
      TaskModal.tsx
      useDragAndDrop.ts
      useKanbanBoard.ts
    primitives/
      Button.tsx
      ConfirmDelete.tsx
      Modal.tsx
  styles/
    globals.css
  utils/
    App.tsx
    main.tsx
```

### ✅ Tech Stack

- React
- TypeScript
- Tailwind CSS
- LocalStorage
- Custom hooks

## 🚀 Local Setup

**Clone the repository:**

```bash
git clone https://github.com/kaziabulhasib/kanban-component-hasib
cd kanban-component-hasib
```

**Install dependencies:**

```bash
npm install
```

**Run development server:**

```bash
npm run dev
```

**Or using pnpm:**

```bash
pnpm install
pnpm run dev
```

## ✅ Completed Requirements

| Requirement | Status |
| ----------- | ------ |
| Drag & Drop | ✅     |
| Column Limits | ✅ |
| Add / Edit / Delete Tasks | ✅ |
| Prevent drag into full column | ✅ |
| Delete confirmation | ✅ |
| Responsive design | ✅ |
| State persistence | ✅ |
| Custom hooks refactor | ✅ |
| Accessibility (ARIA) | ✅ |
| TypeScript strict mode | ✅ |
| Keyboard Navigation | ✅ |
| Clean UI | ✅ |

## 📧 Contact

**Name**: kazi Abul Hasib <Br>
**Email**: hasibkazi420@gmail.com
