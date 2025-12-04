import { useDroppable } from "@dnd-kit/core"
import { ReactNode } from "react"

interface DroppableColumnProps {
  id: string
  children: ReactNode
  className?: string
}

export function DroppableColumn({ id, children, className }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-[200px] p-4 rounded-xl transition-all
        ${isOver 
          ? "bg-blue-50 dark:bg-blue-950/30 ring-2 ring-blue-400 dark:ring-blue-600 scale-[1.02]" 
          : "bg-slate-100/50 dark:bg-slate-800/30"
        }
        border-2 border-dashed
        ${isOver ? "border-blue-400 dark:border-blue-600" : "border-slate-200 dark:border-slate-700"}
        shadow-sm hover:shadow-md
        ${className}
      `}
    >
      {children}
    </div>
  )
}
