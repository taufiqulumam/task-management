"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
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
import { Loader2, Plus, ArrowLeft, CheckCircle2, Calendar, User, LogOut, AlertCircle, Circle, Clock, CheckCheck } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  dueDate: string | null
  createdAt: string
  assignee: {
    id: string
    name: string | null
    email: string
  } | null
}

interface ProjectDetail {
  id: string
  name: string
  description: string | null
  color: string | null
  createdAt: string
  tasks: Task[]
  owner: {
    id: string
    name: string | null
    email: string
  }
}

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

export default function ProjectDetailPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
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
  })

  useEffect(() => {
    checkAuth()
    fetchProject()
    fetchUsers()
  }, [projectId])

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

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`)
      const data = await response.json()

      if (response.ok) {
        setProject(data.project)
      } else {
        router.push("/projects")
      }
    } catch (error) {
      console.error("Failed to fetch project:", error)
      router.push("/projects")
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

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    setError("")

    try {
      // Prepare data with proper datetime format
      const taskData: any = {
        title: formData.title,
        description: formData.description || undefined,
        status: formData.status,
        priority: formData.priority,
        projectId: projectId,
        assigneeId: formData.assigneeId || undefined,
      }

      // Convert datetime-local to ISO 8601 format if provided
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

      // Reset form and close dialog
      setFormData({
        title: "",
        description: "",
        status: "TODO",
        priority: "MEDIUM",
        dueDate: "",
        assigneeId: "",
      })
      setIsDialogOpen(false)

      // Refresh project data
      fetchProject()
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "TODO":
        return <Circle className="w-4 h-4" />
      case "IN_PROGRESS":
        return <Clock className="w-4 h-4" />
      case "IN_REVIEW":
        return <AlertCircle className="w-4 h-4" />
      case "DONE":
        return <CheckCheck className="w-4 h-4" />
      case "CANCELLED":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Circle className="w-4 h-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading project...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return null
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
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link href="/projects">
            <Button variant="ghost" className="gap-2 mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Button>
          </Link>

          {/* Project Header */}
          <div className="mb-8">
            <div className="flex items-start gap-4 mb-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: project.color || "#3b82f6" }}
              >
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2">{project.name}</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  {project.description || "No description"}
                </p>
                <div className="flex items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Created {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{project.owner.name || project.owner.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-1">Tasks</h3>
              <p className="text-slate-600 dark:text-slate-400">
                {project.tasks.length} {project.tasks.length === 1 ? "task" : "tasks"}
              </p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Plus className="w-4 h-4" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>
                    Add a new task to {project.name}
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
                      <Label htmlFor="assignee">Assign To (Optional)</Label>
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

          {/* Tasks List */}
          {project.tasks.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent className="pt-6">
                <CheckCircle2 className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Create your first task to get started
                </p>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Task
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {project.tasks.map((task) => (
                <Card
                  key={task.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                >
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
                              {getStatusIcon(task.status)}
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
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
