import { NextRequest, NextResponse } from "next/server"
import { authenticate, errorResponse } from "@/lib/api-middleware"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await authenticate(request)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Check if comment exists and user is the author
    const comment = await prisma.comment.findUnique({
      where: { id },
      select: { authorId: true }
    })

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    if (comment.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.comment.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Comment deleted successfully" })
  } catch (error) {
    return errorResponse(error)
  }
}
