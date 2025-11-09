import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { decodeIdToken } from "@/utils/tokenDecode";

/**
 * API route to fetch the full token payload
 * Returns all fields from the ID token (not filtered)
 */
export async function GET(request: NextRequest) {
  try {
    // Get the JWT token from the request
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    
    if (!token || !token.idToken) {
      return NextResponse.json(
        { error: "Unauthorized or no token available" },
        { status: 401 }
      );
    }

    // Decode the full idToken to get all fields
    const fullPayload = decodeIdToken(token.idToken as string);
    
    if (!fullPayload) {
      return NextResponse.json(
        { error: "Invalid token format" },
        { status: 400 }
      );
    }

    // Return the FULL token payload with ALL fields (no filtering)
    return NextResponse.json({ 
      tokenPayload: fullPayload 
    });
  } catch (error) {
    console.error("Error fetching token details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
