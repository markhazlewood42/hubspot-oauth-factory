/**
 * API route that tests new app registration. This will ultimately be handled from
 * the user interface.
 */
import { NextResponse } from "next/server";
import * as db from '@/lib/db';

// In Next.js App Router, API routes are defined by creating a route.ts file
// This file handles GET requests to /api/tests/registerApp endpoint
// The file path directly maps to the URL path
export async function GET() {

  db.storeHubSpotApp(1234, "TEST_CLIENT_ID", "TEST_CLIENT_SECRET");


  return NextResponse.json({success: true, message: `PLACEHOLDER: TESTING APP REGISTRATION.`}, { status: 200 });
}
