"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle2, LogOut, User, FolderKanban } from "lucide-react"

interface UserData {
  id: string
  email: string
  name: string | null
}

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
  })

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      fetchTaskStats()
    }
  }, [user])

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
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTaskStats = async () => {
    try {
      const response = await fetch("/api/tasks")
      const data = await response.json()

      if (response.ok && data.tasks) {
        // Filter tasks that are assigned to current user
        const myTasks = data.tasks.filter((t: any) => t.assignee?.id === user?.id)
        
        setStats({
          totalTasks: myTasks.length,
          completedTasks: myTasks.filter((t: any) => t.status === "DONE").length,
          inProgressTasks: myTasks.filter((t: any) => t.status === "IN_PROGRESS").length,
        })
      }
    } catch (error) {
      console.error("Failed to fetch task stats:", error)
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm bg-white/50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Task Management
            </h1>
          </div>

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
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome back, {user?.name?.split(" ")[0] || "User"}! 👋
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Ready to manage your tasks and boost productivity
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Link href="/tasks">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800 h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    My Tasks
                  </CardTitle>
                  <CardDescription>View and manage your tasks</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/projects">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderKanban className="w-5 h-5 text-indigo-600" />
                    Projects
                  </CardTitle>
                  <CardDescription>Organize tasks into projects</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600" />
                  Profile
                </CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Tasks</CardDescription>
                <CardTitle className="text-4xl">{stats.totalTasks}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  All your tasks
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Completed</CardDescription>
                <CardTitle className="text-4xl text-green-600">{stats.completedTasks}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Tasks finished
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>In Progress</CardDescription>
                <CardTitle className="text-4xl text-blue-600">{stats.inProgressTasks}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Currently working on
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
