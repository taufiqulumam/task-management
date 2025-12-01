"use client"

import { useState } from "react"
import { X, Calendar, Tag, User, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TaskModalProps {
  task: {
    id: string
    title: string
    description: string
    priority: "high" | "medium" | "low"
    assignee: string
    dueDate: string
    tags: string[]
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskModal({ task, open, onOpenChange }: TaskModalProps) {
  const [formData, setFormData] = useState(task)

  if (!open) return null

  const priorityOptions = [
    { value: "low", label: "Low", color: "bg-accent/10 text-accent border-accent/20" },
    { value: "medium", label: "Medium", color: "bg-secondary/10 text-secondary border-secondary/20" },
    { value: "high", label: "High", color: "bg-destructive/10 text-destructive border-destructive/20" },
  ]

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={() => onOpenChange(false)} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card rounded-lg shadow-lg z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-card">
          <h2 className="text-lg font-semibold text-foreground">Task Details</h2>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-2">Task Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-muted/50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 rounded-lg bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
              rows={4}
            />
          </div>

          {/* Priority */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-3">Priority</label>
            <div className="flex gap-2">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      priority: option.value as any,
                    })
                  }
                  className={`px-3 py-2 rounded border transition-all ${
                    formData.priority === option.value
                      ? option.color
                      : "bg-muted/30 text-muted-foreground border-border"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid: Assignee & Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-foreground block mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Assignee
              </label>
              <Input
                value={formData.assignee}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                className="bg-muted/50"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground block mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Due Date
              </label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="bg-muted/50"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Tags
            </label>
            <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-muted/50 border border-border">
              {formData.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-medium">
                  {tag}
                </span>
              ))}
              <Input
                placeholder="Add tag..."
                className="flex-1 min-w-24 bg-transparent border-0 placeholder:text-muted-foreground focus:outline-none focus:ring-0 p-0 h-auto"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value) {
                    setFormData({
                      ...formData,
                      tags: [...formData.tags, e.currentTarget.value],
                    })
                    e.currentTarget.value = ""
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-between p-6 border-t border-border bg-card gap-2">
          <Button
            variant="outline"
            className="text-destructive hover:bg-destructive/10 border-destructive/30 bg-transparent"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={() => onOpenChange(false)}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
