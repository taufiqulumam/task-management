"use client"

import { useState } from "react"
import { TaskModal } from "@/components/task-modal"

interface TaskCardProps {
  task: {
    id: string
    title: string
    description: string
    priority: "high" | "medium" | "low"
    assignee: string
    dueDate: string
    tags: string[]
  }
}

export function TaskCard({ task }: TaskCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const priorityColors = {
    high: "border-l-destructive",
    medium: "border-l-secondary",
    low: "border-l-accent",
  }

  const priorityBgColors = {
    high: "bg-destructive/10",
    medium: "bg-secondary/10",
    low: "bg-accent/10",
  }

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className={`p-4 rounded-lg bg-card border-l-4 ${priorityColors[task.priority]} cursor-pointer hover:shadow-md transition-shadow group`}
      >
        <div className="space-y-2">
          {/* Title */}
          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {task.title}
          </h4>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-xs px-2 py-1 rounded ${priorityBgColors[task.priority]} text-foreground`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer: Meta info */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-semibold text-primary">{task.assignee.charAt(0)}</span>
              </div>
              <span className="text-xs text-muted-foreground">{task.assignee}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(task.dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal task={task} open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  )
}
