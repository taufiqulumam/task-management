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
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Loader2, ArrowLeft, CheckCircle2, User, LogOut, AlertCircle, Circle, Clock,
  CheckCheck, Calendar, FolderKanban, Edit, Trash2, MessageSquare, Send
} from "lucide-react"

interface Comment {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    name: string | null
    email: string
  }
}

interface TaskDetail {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  dueDate: string | null
  createdAt: string
  updatedAt: string
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
  createdBy?: {
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

export default function TaskDetailPage() {
  const router = useRouter()
  const params = useParams()
  const taskId = params.id as string

  const [task, setTask] = useState<TaskDetail | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState("")
  const [newComment, setNewComment] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    dueDate: "",
  })

  useEffect(() => {
    checkAuth()
    fetchTask()
    fetchComments()
  }, [taskId])

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

  const fetchTask = async () => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`)
      const data = await response.json()

      if (response.ok) {
        setTask(data.task)
        setEditFormData({
          title: data.task.title,
          description: data.task.description || "",
          status: data.task.status,
          priority: data.task.priority,
          dueDate: data.task.dueDate
            ? new Date(data.task.dueDate).toISOString().slice(0, 16)
            : "",
        })
      } else {
        router.push("/tasks")
      }
    } catch (error) {
      console.error("Failed to fetch task:", error)
      router.push("/tasks")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/comments`)
      const data = await response.json()

      if (response.ok) {
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error)
    }
  }

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setError("")

    try {
      const taskData: any = {
        title: editFormData.title,
        description: editFormData.description || undefined,
        status: editFormData.status,
        priority: editFormData.priority,
      }

      if (editFormData.dueDate) {
        taskData.dueDate = new Date(editFormData.dueDate).toISOString()
      }

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update task")
      }

      setIsEditDialogOpen(false)
      fetchTask()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmittingComment(true)

    try {
      const response = await fetch(`/api/tasks/${taskId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
      })

      if (!response.ok) {
        throw new Error("Failed to add comment")
      }

      setNewComment("")
      fetchComments()
    } catch (error) {
      console.error("Failed to add comment:", error)
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete comment")
      }

      fetchComments()
    } catch (error) {
      console.error("Failed to delete comment:", error)
    }
  }

  const handleDeleteTask = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete task")
      }

      router.push("/tasks")
    } catch (error) {
      console.error("Failed to delete task:", error)
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
      default:
        return <Circle className="w-4 h-4" />
    }
  }

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    return email[0].toUpperCase()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading task...</p>
        </div>
      </div>
    )
  }

  if (!task) {
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
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/tasks">
            <Button variant="ghost" className="gap-2 mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Tasks
            </Button>
          </Link>

          {/* Task Details Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <CardTitle className="text-3xl">{task.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
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
                      className={PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS]}
                    >
                      {task.priority}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Task</DialogTitle>
                        <DialogDescription>
                          Update task details
                        </DialogDescription>
                      </DialogHeader>

                      <form onSubmit={handleUpdateTask}>
                        <div className="space-y-4 py-4">
                          {error && (
                            <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>{error}</AlertDescription>
                            </Alert>
                          )}

                          <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                              id="title"
                              value={editFormData.title}
                              onChange={(e) =>
                                setEditFormData({ ...editFormData, title: e.target.value })
                              }
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              value={editFormData.description}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  description: e.target.value,
                                })
                              }
                              rows={3}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Status</Label>
                              <Select
                                value={editFormData.status}
                                onValueChange={(value) =>
                                  setEditFormData({ ...editFormData, status: value })
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
                              <Label>Priority</Label>
                              <Select
                                value={editFormData.priority}
                                onValueChange={(value) =>
                                  setEditFormData({ ...editFormData, priority: value })
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
                              value={editFormData.dueDate}
                              onChange={(e) =>
                                setEditFormData({ ...editFormData, dueDate: e.target.value })
                              }
                            />
                          </div>
                        </div>

                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                            disabled={isUpdating}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isUpdating}>
                            {isUpdating ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              "Update Task"
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDeleteTask}
                    className="text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {task.description && (
                <>
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                      {task.description}
                    </p>
                  </div>
                  <Separator className="my-6" />
                </>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Details</h3>
                  <div className="space-y-3">
                    {task.project && (
                      <div className="flex items-center gap-2 text-sm">
                        <FolderKanban className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-600 dark:text-slate-400">Project:</span>
                        <Link
                          href={`/projects/${task.project.id}`}
                          className="font-medium hover:underline"
                        >
                          {task.project.name}
                        </Link>
                      </div>
                    )}
                    {task.dueDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-600 dark:text-slate-400">Due:</span>
                        <span className="font-medium">
                          {new Date(task.dueDate).toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600 dark:text-slate-400">Created:</span>
                      <span className="font-medium">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">People</h3>
                  <div className="space-y-3">
                    {task.createdBy && (
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-600 dark:text-slate-400">Owner:</span>
                        <span className="font-medium">
                          {task.createdBy.name || task.createdBy.email}
                        </span>
                      </div>
                    )}
                    {task.assignee && (
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-600 dark:text-slate-400">Assignee:</span>
                        <span className="font-medium">
                          {task.assignee.name || task.assignee.email}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                <CardTitle>Comments ({comments.length})</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="mb-6">
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                      {getInitials(user?.name, user?.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                      className="mb-2"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!newComment.trim() || isSubmittingComment}
                      className="gap-2"
                    >
                      {isSubmittingComment ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Post Comment
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>

              <Separator className="my-6" />

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    No comments yet. Be the first to comment!
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-br from-slate-600 to-slate-700 text-white">
                          {getInitials(comment.author.name, comment.author.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <span className="font-semibold">
                                {comment.author.name || comment.author.email}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                                {new Date(comment.createdAt).toLocaleString()}
                              </span>
                            </div>
                            {comment.author.id === user?.id && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-slate-500 hover:text-red-600"
                                onClick={() => handleDeleteComment(comment.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
