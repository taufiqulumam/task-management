"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 1, 1))

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i)

  const tasks = [
    { date: 5, title: "Design review", priority: "high" },
    { date: 10, title: "Deploy to staging", priority: "medium" },
    { date: 15, title: "Authentication setup", priority: "high" },
    { date: 18, title: "Dashboard build", priority: "medium" },
  ]

  const getTasksForDay = (day: number) => {
    return tasks.filter((task) => task.date === day)
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {/* Weekdays */}
          <div className="grid grid-cols-7 bg-muted/50 border-b border-border">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="px-4 py-3 text-center text-sm font-semibold text-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7">
            {emptyDays.map((_, i) => (
              <div key={`empty-${i}`} className="min-h-24 bg-muted/20 border border-border" />
            ))}
            {days.map((day) => {
              const dayTasks = getTasksForDay(day)
              return (
                <div key={day} className="min-h-24 p-2 border border-border hover:bg-muted/50 transition-colors">
                  <p className="text-sm font-semibold text-foreground mb-1">{day}</p>
                  <div className="space-y-1">
                    {dayTasks.map((task, idx) => (
                      <div
                        key={idx}
                        className={`text-xs px-2 py-1 rounded truncate ${
                          task.priority === "high"
                            ? "bg-destructive/20 text-destructive"
                            : "bg-secondary/20 text-secondary"
                        }`}
                      >
                        {task.title}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
