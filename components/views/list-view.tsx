"use client"

import { useState } from "react"
import { Filter, MoreVertical, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TaskModal } from "@/components/task-modal"

interface Task {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  assignee: string
  dueDate: string
  tags: string[]
  status: string
}

export function ListView() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const tasks: Task[] = [
    {
      id: "1",
      title: "Implement authentication",
      description: "Add OAuth and JWT",
      priority: "high",
      assignee: "Alex",
      dueDate: "2024-02-15",
      tags: ["backend", "security"],
      status: "To Do",
    },
    {
      id: "3",
      title: "Build user dashboard",
      description: "Create React components",
      priority: "medium",
      assignee: "Sam",
      dueDate: "2024-02-18",
      tags: ["frontend"],
      status: "In Progress",
    },
    {
      id: "5",
      title: "Code review - notifications",
      description: "Review notification system",
      priority: "medium",
      assignee: "Casey",
      dueDate: "2024-02-14",
      tags: ["review", "backend"],
      status: "In Review",
    },
  ]

  const priorityColors = {
    high: "text-destructive",
    medium: "text-secondary",
    low: "text-accent",
  }

  const statusColors = {
    "To Do": "bg-slate-100 text-slate-700",
    "In Progress": "bg-blue-100 text-blue-700",
    "In Review": "bg-purple-100 text-purple-700",
    Done: "bg-green-100 text-green-700",
  }

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
        <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          New Task
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Task Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Priority</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Assignee</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Due Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedTask(task)
                  setIsModalOpen(true)
                }}
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-foreground hover:text-primary">{task.title}</p>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusColors[task.status as keyof typeof statusColors]
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`font-semibold text-sm ${priorityColors[task.priority]}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">{task.assignee.charAt(0)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {new Date(task.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4">
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Task Modal */}
      {selectedTask && <TaskModal task={selectedTask} open={isModalOpen} onOpenChange={setIsModalOpen} />}
    </div>
  )
}
