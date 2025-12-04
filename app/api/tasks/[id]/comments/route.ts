import { NextRequest, NextResponse } from "next/server"
import { authenticate, errorResponse } from "@/lib/api-middleware"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await authenticate(request)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const comments = await prisma.comment.findMany({
      where: {
        taskId: id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json({ comments })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await authenticate(request)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = commentSchema.parse(body)

    const comment = await prisma.comment.create({
      data: {
        content: validatedData.content,
        taskId: id,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        }
      }
    })

    return NextResponse.json({ comment }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }
    return errorResponse(error)
  }
}
