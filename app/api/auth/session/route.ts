import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json(
        { user: null, authenticated: false },
        { status: 200 }
      )
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-jwt-secret"
    ) as any

    return NextResponse.json(
      {
        user: {
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
        },
        authenticated: true
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { user: null, authenticated: false },
      { status: 200 }
    )
  }
}
