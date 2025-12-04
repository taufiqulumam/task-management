import { NextRequest, NextResponse } from "next/server"
import { authenticate, errorResponse } from "@/lib/api-middleware"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await authenticate(request)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
      orderBy: {
        name: "asc"
      }
    })

    return NextResponse.json({ users })
  } catch (error) {
    return errorResponse(error)
  }
}
