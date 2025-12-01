"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TaskCard } from "@/components/task-card"

interface Task {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  assignee: string
  dueDate: string
  tags: string[]
}

interface Column {
  id: string
  title: string
  color: string
  tasks: Task[]
}

export function BoardView() {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "todo",
      title: "To Do",
      color: "bg-slate-100",
      tasks: [
        {
          id: "1",
          title: "Implement authentication",
          description: "Add OAuth and JWT",
          priority: "high",
          assignee: "Alex",
          dueDate: "2024-02-15",
          tags: ["backend", "security"],
        },
        {
          id: "2",
          title: "Design database schema",
          description: "Plan PostgreSQL schema",
          priority: "high",
          assignee: "Jordan",
          dueDate: "2024-02-10",
          tags: ["database"],
        },
      ],
    },
    {
      id: "inprogress",
      title: "In Progress",
      color: "bg-blue-100",
      tasks: [
        {
          id: "3",
          title: "Build user dashboard",
          description: "Create React components",
          priority: "medium",
          assignee: "Sam",
          dueDate: "2024-02-18",
          tags: ["frontend"],
        },
        {
          id: "4",
          title: "API endpoint development",
          description: "REST API for tasks",
          priority: "high",
          assignee: "Morgan",
          dueDate: "2024-02-12",
          tags: ["backend", "api"],
        },
      ],
    },
    {
      id: "review",
      title: "In Review",
      color: "bg-purple-100",
      tasks: [
        {
          id: "5",
          title: "Code review - notifications",
          description: "Review notification system",
          priority: "medium",
          assignee: "Casey",
          dueDate: "2024-02-14",
          tags: ["review", "backend"],
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      color: "bg-green-100",
      tasks: [
        {
          id: "6",
          title: "Setup project repo",
          description: "Git repository configured",
          priority: "low",
          assignee: "Riley",
          dueDate: "2024-02-05",
          tags: ["setup"],
        },
        {
          id: "7",
          title: "Configure CI/CD",
          description: "GitHub Actions workflow",
          priority: "medium",
          assignee: "Alex",
          dueDate: "2024-02-08",
          tags: ["devops"],
        },
      ],
    },
  ])

  const handleAddTask = (columnId: string) => {
    console.log("Add task to column:", columnId)
  }

  return (
    <div className="p-6 h-full overflow-x-auto">
      <div className="flex gap-6 min-w-max">
        {columns.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-80">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                <h3 className="font-semibold text-foreground">{column.title}</h3>
                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                  {column.tasks.length}
                </span>
              </div>
            </div>

            {/* Tasks Container */}
            <div className="space-y-3 min-h-96">
              {column.tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}

              {/* Add Task Button */}
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground mt-4 bg-transparent"
                onClick={() => handleAddTask(column.id)}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Add task</span>
              </Button>
            </div>
          </div>
        ))}

        {/* Add Column */}
        <div className="flex-shrink-0 w-80">
          <Button
            variant="outline"
            className="w-full h-40 flex items-center justify-center gap-2 border-dashed text-muted-foreground hover:text-foreground bg-transparent"
          >
            <Plus className="w-5 h-5" />
            <span>Add Column</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
