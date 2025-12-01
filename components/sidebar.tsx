"use client"

import { useState } from "react"
import { LayoutGrid, List, Calendar, Settings, Plus, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  activeView: "board" | "list" | "calendar"
  setView: (view: "board" | "list" | "calendar") => void
}

export function Sidebar({ activeView, setView }: SidebarProps) {
  const [projects, setProjects] = useState([
    { id: 1, name: "Web Platform", color: "bg-primary" },
    { id: 2, name: "Mobile App", color: "bg-secondary" },
    { id: 3, name: "Design System", color: "bg-accent" },
  ])

  const viewItems = [
    { id: "board", label: "Board", icon: LayoutGrid },
    { id: "list", label: "List", icon: List },
    { id: "calendar", label: "Calendar", icon: Calendar },
  ]

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-sm font-bold text-white">TM</span>
          </div>
          <h1 className="text-lg font-bold">TaskFlow</h1>
        </div>
        <p className="text-xs text-sidebar-foreground/60">Team Workspace</p>
      </div>

      {/* Views */}
      <nav className="p-4 space-y-2">
        <h3 className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider px-2 mb-3">Views</h3>
        {viewItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as any)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                activeView === item.id
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/20"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Projects */}
      <div className="px-4 py-6 border-t border-sidebar-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">Projects</h3>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-sidebar-accent/30">
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        <div className="space-y-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group flex items-center justify-between px-3 py-2 rounded-md hover:bg-sidebar-accent/20 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${project.color}`}></div>
                <span className="text-sm">{project.name}</span>
              </div>
              <MoreVertical className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border bg-sidebar">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent/20 bg-transparent"
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm">Settings</span>
        </Button>
      </div>
    </aside>
  )
}
