"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { BoardView } from "@/components/views/board-view"
import { ListView } from "@/components/views/list-view"
import { CalendarView } from "@/components/views/calendar-view"

export default function Home() {
  const [view, setView] = useState<"board" | "list" | "calendar">("board")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeView={view} setView={setView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentView={view} />
        <main className="flex-1 overflow-auto">
          {view === "board" && <BoardView />}
          {view === "list" && <ListView />}
          {view === "calendar" && <CalendarView />}
        </main>
      </div>
    </div>
  )
}
