import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { decodeIdToken } from "@/utils/tokenDecode";

/**
 * API route to fetch the full token payload
 * Returns all fields from the ID token (not filtered)
 */
export async function GET(request: NextRequest) {
  try {
    // Get the decoded JWT token - this contains ALL data stored in the JWT by NextAuth
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized or no token available" },
        { status: 401 }
      );
    }

    // Debug: Log what we have in the JWT token
    console.log("[token-details] JWT token keys:", Object.keys(token));
    console.log("[token-details] Has idToken:", !!token.idToken);
    console.log("[token-details] Has fullTokenPayload:", !!token.fullTokenPayload);
    
    // Build the full payload - prioritize stored fullTokenPayload (from JWT callback)
    let fullPayload: Record<string, unknown> | null = null;
    
    // 1. First priority: Use stored fullTokenPayload (decoded from initial login)
    if (token.fullTokenPayload) {
      fullPayload = { ...token.fullTokenPayload } as Record<string, unknown>;
      console.log("[token-details] ✅ Using stored fullTokenPayload from JWT callback");
    }
    // 2. Fallback: Try decoding access_token (has roles)
    else if (token.accessToken) {
      fullPayload = decodeIdToken(token.accessToken as string);
      console.log("[token-details] Decoded accessToken");
    }
    // 3. Last fallback: Decode idToken
    else if (token.idToken) {
      fullPayload = decodeIdToken(token.idToken as string);
      console.log("[token-details] Decoded idToken directly");
    }
    
    if (!fullPayload) {
      console.error("[token-details] ❌ No token payload available");
      return NextResponse.json(
        { error: "No token payload available. Please log out and log back in." },
        { status: 401 }
      );
    }
    
    // 3. If still missing roles, try userinfo endpoint as last resort
    if (!fullPayload.realm_access && !fullPayload.resource_access && token.accessToken) {
      try {
        const userinfoUrl = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/userinfo`;
        const userinfoResponse = await fetch(userinfoUrl, {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        });
        
        if (userinfoResponse.ok) {
          const userinfo = await userinfoResponse.json();
          console.log("[token-details] Userinfo keys:", Object.keys(userinfo));
          
          // Merge userinfo data
          if (userinfo.realm_access) {
            fullPayload.realm_access = userinfo.realm_access;
          }
          if (userinfo.resource_access) {
            fullPayload.resource_access = userinfo.resource_access;
          }
          if (userinfo.groups) {
            fullPayload.groups = userinfo.groups;
          }
        }
      } catch (error) {
        console.error("[token-details] Error fetching userinfo:", error);
      }
    }

    // Debug: Log final payload structure
    console.log("[token-details] Final payload keys:", Object.keys(fullPayload));
    console.log("[token-details] Has realm_access:", !!fullPayload.realm_access);
    console.log("[token-details] Has resource_access:", !!fullPayload.resource_access);
    console.log("[token-details] Payload sample:", JSON.stringify(fullPayload).substring(0, 300));

    // Return the FULL token payload with ALL fields
    return NextResponse.json({ 
      tokenPayload: fullPayload 
    });
  } catch (error) {
    console.error("[token-details] Error fetching token details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
