import { NextResponse } from "next/server"
import { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

export async function authenticate(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value

  if (!token) {
    return null
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-jwt-secret"
    ) as any
    
    return {
      user: {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
      }
    }
  } catch (error) {
    return null
  }
}

export async function withAuth(
  handler: (session: any, request: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any) => {
    const session = await authenticate(request)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    return handler(session, request, context)
  }
}

export function errorResponse(error: any, defaultMessage = "Internal server error") {
  console.error("API Error:", error)
  
  if (error.code === 'P2002') {
    return NextResponse.json(
      { error: "A record with this data already exists" },
      { status: 409 }
    )
  }
  
  if (error.code === 'P2025') {
    return NextResponse.json(
      { error: "Record not found" },
      { status: 404 }
    )
  }

  return NextResponse.json(
    { error: defaultMessage },
    { status: 500 }
  )
}
