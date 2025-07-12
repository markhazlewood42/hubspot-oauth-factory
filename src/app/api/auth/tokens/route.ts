import * as hubspot from "@/lib/hubspot";

/**
 * API route that gets the latest access token for an app.
 */
import { NextResponse } from "next/server";

// In Next.js App Router, API routes are defined by creating a route.ts file
// This file handles GET requests to /api/auth/tokens endpoint
// The file path directly maps to the URL path
export async function GET(request: Request) {

  // Extract query parameters from the request URL
  const { searchParams } = new URL(request.url);
  const appId = searchParams.get("appId");
  const portalId = searchParams.get("portalId");

  if (!appId) {
    // NextResponse is a Next.js utility for API responses
    return NextResponse.json({ success: false, error: "You must provide a registered appId as a query param." }, { status: 400 })
  }
  if (!portalId) {
    return NextResponse.json({ success: false, error: "You must provide valid portalId as a query param." }, { status: 400 })
  }

  const tokenResult = await hubspot.getValidAccessToken(Number.parseInt(appId), Number.parseInt(portalId));
  if (!tokenResult.success) {
    return {success: false, message: tokenResult.error};
  }

  return NextResponse.json(
    {
      success: true,
      message: `GOT AN ACCESS TOKEN FOR ${appId} INSTALLED ON PORTAL ${portalId}: ${tokenResult.accessToken}`
    },
    { status: 200 }
  );
}
