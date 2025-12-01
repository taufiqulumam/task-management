"use client"

import { Search, Filter, Plus, Bell, User, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface HeaderProps {
  currentView: string
}

export function Header({ currentView }: HeaderProps) {
  const viewLabels = {
    board: "Board View",
    list: "List View",
    calendar: "Calendar View",
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-between h-16 px-6 gap-4">
        {/* Left: Title and Search */}
        <div className="flex-1 flex items-center gap-4">
          <h2 className="text-lg font-semibold text-foreground">
            {viewLabels[currentView as keyof typeof viewLabels] || "Tasks"}
          </h2>
          <div className="hidden md:flex flex-1 max-w-md items-center relative">
            <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search tasks..." className="pl-9 bg-muted/50 border-transparent" />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex gap-2 bg-transparent">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </Button>
          <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Task</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
