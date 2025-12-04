"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Loader2, Plus, CheckCircle2, User, LogOut, AlertCircle, Circle, Clock, 
  CheckCheck, Calendar, LayoutGrid, List, Filter, FolderKanban 
} from "lucide-react"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { DroppableColumn } from "@/components/droppable-column"
import { DraggableCard } from "@/components/draggable-card"

interface Task {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  dueDate: string | null
  createdAt: string
  project: {
    id: string
    name: string
    color: string | null
  } | null
  assignee: {
    id: string
    name: string | null
    email: string
  } | null
}

const STATUS_COLUMNS = [
  { key: "TODO", label: "To Do", icon: Circle },
  { key: "IN_PROGRESS", label: "In Progress", icon: Clock },
  { key: "IN_REVIEW", label: "In Review", icon: AlertCircle },
  { key: "DONE", label: "Done", icon: CheckCheck },
]

const STATUS_COLORS = {
  TODO: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100",
  IN_PROGRESS: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  IN_REVIEW: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
  DONE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
}

const PRIORITY_COLORS = {
  LOW: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  MEDIUM: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100",
  HIGH: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-100",
  URGENT: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100",
}

export default function TasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Form state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: "",
    assigneeId: "",
    projectId: "",
  })
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  useEffect(() => {
    checkAuth()
    fetchTasks()
    fetchUsers()
    fetchProjects()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [tasks, statusFilter, priorityFilter])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/session")
      const data = await response.json()

      if (data.authenticated && data.user) {
        setUser(data.user)
      } else {
        router.push("/login")
      }
    } catch (error) {
      router.push("/login")
    }
  }

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks")
      const data = await response.json()

      if (response.ok) {
        setTasks(data.tasks || [])
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      const data = await response.json()

      if (response.ok) {
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    }
  }

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      const data = await response.json()

      if (response.ok) {
        setProjects(data.projects || [])
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error)
    }
  }

  const applyFilters = () => {
    let filtered = [...tasks]

    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((task) => task.priority === priorityFilter)
    }

    setFilteredTasks(filtered)
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    setError("")

    try {
      const taskData: any = {
        title: formData.title,
        description: formData.description || undefined,
        status: formData.status,
        priority: formData.priority,
        projectId: formData.projectId,
        assigneeId: formData.assigneeId || undefined,
      }

      if (formData.dueDate) {
        taskData.dueDate = new Date(formData.dueDate).toISOString()
      }

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create task")
      }

      setFormData({
        title: "",
        description: "",
        status: "TODO",
        priority: "MEDIUM",
        dueDate: "",
        projectId: "",
        assigneeId: "",
      })
      setIsDialogOpen(false)
      fetchTasks()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsCreating(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = tasks.find((t) => t.id === active.id)
    if (task) {
      setActiveTask(task)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as string

    const task = tasks.find((t) => t.id === taskId)
    if (!task || task.status === newStatus) return

    // Optimistic update
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      )
    )

    // Update via API
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        // Revert on error
        fetchTasks()
      }
    } catch (error) {
      console.error("Failed to update task:", error)
      fetchTasks()
    }
  }

  const handleDragCancel = () => {
    setActiveTask(null)
  }

  const getTasksByStatus = (status: string) => {
    return filteredTasks.filter((task) => task.status === status)
  }

  const getStatusIcon = (status: string) => {
    const column = STATUS_COLUMNS.find((col) => col.key === status)
    return column ? column.icon : Circle
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm bg-white/50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Task Management
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <User className="w-4 h-4" />
              <span>{user?.name || user?.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">My Tasks</h2>
              <p className="text-slate-600 dark:text-slate-400">
                {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
                <TabsList>
                  <TabsTrigger value="kanban" className="gap-2">
                    <LayoutGrid className="w-4 h-4" />
                    <span className="hidden sm:inline">Kanban</span>
                  </TabsTrigger>
                  <TabsTrigger value="list" className="gap-2">
                    <List className="w-4 h-4" />
                    <span className="hidden sm:inline">List</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <Plus className="w-4 h-4" />
                    New Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>
                      Add a new task to your list
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleCreateTask}>
                    <div className="space-y-4 py-4">
                      {error && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="title">Task Title *</Label>
                        <Input
                          id="title"
                          placeholder="e.g., Design homepage mockup"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="What needs to be done?"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                          }
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="project">Project *</Label>
                        <Select
                          value={formData.projectId}
                          onValueChange={(value) =>
                            setFormData({ ...formData, projectId: value })
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select project" />
                          </SelectTrigger>
                          <SelectContent>
                            {projects.map((project) => (
                              <SelectItem key={project.id} value={project.id}>
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: project.color || "#3b82f6" }}
                                  />
                                  {project.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Select
                            value={formData.status}
                            onValueChange={(value) =>
                              setFormData({ ...formData, status: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TODO">To Do</SelectItem>
                              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                              <SelectItem value="IN_REVIEW">In Review</SelectItem>
                              <SelectItem value="DONE">Done</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="priority">Priority</Label>
                          <Select
                            value={formData.priority}
                            onValueChange={(value) =>
                              setFormData({ ...formData, priority: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="LOW">Low</SelectItem>
                              <SelectItem value="MEDIUM">Medium</SelectItem>
                              <SelectItem value="HIGH">High</SelectItem>
                              <SelectItem value="URGENT">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                          id="dueDate"
                          type="datetime-local"
                          value={formData.dueDate}
                          onChange={(e) =>
                            setFormData({ ...formData, dueDate: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="assignee">Assign To</Label>
                        <Select
                          value={formData.assigneeId || "unassigned"}
                          onValueChange={(value) =>
                            setFormData({ 
                              ...formData, 
                              assigneeId: value === "unassigned" ? "" : value 
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select assignee" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unassigned">Unassigned</SelectItem>
                            {users.map((u) => (
                              <SelectItem key={u.id} value={u.id}>
                                {u.name || u.email}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        disabled={isCreating}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isCreating}>
                        {isCreating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Create Task"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 mb-6">
            <Filter className="w-4 h-4 text-slate-500" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="TODO">To Do</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="IN_REVIEW">In Review</SelectItem>
                <SelectItem value="DONE">Done</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Kanban View */}
          {viewMode === "kanban" && (
            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {STATUS_COLUMNS.map((column) => {
                  const columnTasks = getTasksByStatus(column.key)
                  const Icon = column.icon

                  return (
                    <div key={column.key} className="flex flex-col">
                      <div className="mb-3 flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                          <h3 className="font-semibold text-sm">{column.label}</h3>
                        </div>
                        <Badge variant="secondary" className="font-semibold">
                          {columnTasks.length}
                        </Badge>
                      </div>

                      <DroppableColumn id={column.key} className="space-y-3">
                        {columnTasks.length === 0 ? (
                          <div className="text-center py-8 text-slate-400 dark:text-slate-600 text-sm">
                            No tasks
                          </div>
                        ) : (
                          columnTasks.map((task) => (
                            <DraggableCard key={task.id} id={task.id}>
                              <Link href={`/tasks/${task.id}`}>
                                <Card className="hover:shadow-lg transition-all border-2 hover:border-blue-300 dark:hover:border-blue-700">
                                  <CardContent className="p-4">
                                    <h4 className="font-semibold mb-2 line-clamp-2">
                                      {task.title}
                                    </h4>
                                    {task.description && (
                                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                                        {task.description}
                                      </p>
                                    )}
                                    <div className="flex items-center justify-between mb-2">
                                      <Badge
                                        variant="outline"
                                        className={
                                          PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS]
                                        }
                                      >
                                        {task.priority}
                                      </Badge>
                                      {task.project && (
                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                          <FolderKanban className="w-3 h-3" />
                                          <span className="truncate max-w-[100px]">
                                            {task.project.name}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    {task.dueDate && (
                                      <div className="flex items-center gap-1 text-xs text-slate-500">
                                        <Calendar className="w-3 h-3" />
                                        <span>
                                          {new Date(task.dueDate).toLocaleDateString()}
                                        </span>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              </Link>
                            </DraggableCard>
                          ))
                        )}
                      </DroppableColumn>
                    </div>
                  )
                })}
              </div>

              <DragOverlay>
                {activeTask ? (
                  <Card className="shadow-2xl rotate-3 opacity-90 border-2 border-blue-400">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2 line-clamp-2">
                        {activeTask.title}
                      </h4>
                      <Badge
                        variant="outline"
                        className={
                          PRIORITY_COLORS[activeTask.priority as keyof typeof PRIORITY_COLORS]
                        }
                      >
                        {activeTask.priority}
                      </Badge>
                    </CardContent>
                  </Card>
                ) : null}
              </DragOverlay>
            </DndContext>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent className="pt-6">
                    <CheckCircle2 className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No tasks found</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      Create a new task to get started
                    </p>
                    <Button
                      onClick={() => setIsDialogOpen(true)}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      New Task
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredTasks.map((task) => {
                  const Icon = getStatusIcon(task.status)
                  return (
                    <Link key={task.id} href={`/tasks/${task.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3 mb-2">
                              <h4 className="font-semibold text-lg flex-1">
                                {task.title}
                              </h4>
                              <div className="flex gap-2">
                                <Badge
                                  className={`${
                                    STATUS_COLORS[task.status as keyof typeof STATUS_COLORS]
                                  } gap-1`}
                                >
                                  <Icon className="w-4 h-4" />
                                  {task.status.replace("_", " ")}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={
                                    PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS]
                                  }
                                >
                                  {task.priority}
                                </Badge>
                              </div>
                            </div>
                            {task.description && (
                              <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                              {task.project && (
                                <div className="flex items-center gap-1">
                                  <FolderKanban className="w-4 h-4" />
                                  <span>{task.project.name}</span>
                                </div>
                              )}
                              {task.dueDate && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>
                                    Due {new Date(task.dueDate).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                              {task.assignee && (
                                <div className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  <span>{task.assignee.name || task.assignee.email}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  )
                })
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
