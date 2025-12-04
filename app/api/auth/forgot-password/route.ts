import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import crypto from "crypto"

const schema = z.object({
  email: z.string().email("Invalid email address"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = schema.parse(body)

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (!user) {
      // Don't reveal if email exists or not (security best practice)
      return NextResponse.json({
        message: "If the email exists, a reset link has been sent",
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 3600000) // 1 hour from now

    // Delete any existing reset tokens for this user
    await prisma.passwordReset.deleteMany({
      where: { userId: user.id },
    })

    // Create new reset token
    await prisma.passwordReset.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiresAt,
      },
    })

    // In production, send email here
    // For demo purposes, return the reset link
    const resetLink = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password/${resetToken}`

    return NextResponse.json({
      message: "If the email exists, a reset link has been sent",
      // For demo/testing purposes only - remove in production
      resetLink,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
