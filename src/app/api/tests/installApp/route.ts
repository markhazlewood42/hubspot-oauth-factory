/**
 * API route that tests app installation. Basically a wrapper around the install URL
 * for a given app ID.
 */
import { NextResponse } from "next/server";
import * as db from "@/lib/db";

// In Next.js App Router, API routes are defined by creating a route.ts file
// This file handles GET requests to /api/tests/installApp endpoint
// The file path directly maps to the URL path
export async function GET(request: Request) {

  // Get app ID from query params
  const { searchParams } = new URL(request.url);
  const appId = searchParams.get("appId");

  if (appId) {
    try {
      // Get registered app data from db
      const { success, appRecord, error } = await db.getRegisteredApp(Number.parseInt(appId));
      if (success && appRecord) {
        return NextResponse.json({success: true, message: `TESTING APP INSTALLATION. INSTALL URL: ${appRecord.install_url}`}, { status: 200 });
      }
      else if (error) {
        return NextResponse.json({success: true, message: `ERROR GETTING APP INSTALLATION: ${error}`}, { status: 400 });
      }
    }
    catch (error) {
      console.error("Error getting app install info:", error);
      return NextResponse.json({ success: false, error }, { status: 400});
    }
  }
  else {
    return NextResponse.json({success: false, message: 'NO APP ID PROVIDED'}, {status: 400});
  }
}
