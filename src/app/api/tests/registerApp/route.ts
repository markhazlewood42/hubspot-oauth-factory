/**
 * API route that tests new app registration. This will ultimately be handled from
 * the user interface.
 */
import { registerNewApp } from '@/lib/utils';
import { NextResponse } from "next/server";

// In Next.js App Router, API routes are defined by creating a route.ts file
// This file handles GET requests to /api/tests/registerApp endpoint
// The file path directly maps to the URL path
export async function GET() {

  try {
    const result = await registerNewApp(1234, "TEST_CLIENT_ID", "TEST_CLIENT_SECRET", "crm.objects.contacts.read, crm.objects.contacts.write", "TEST_REDIRECT_URL");
    return NextResponse.json({success: true, message: `TESTING APP REGISTRATION. RESULT: ${result}`}, { status: 200 });
  }
  catch (error) {
    console.error("Error storing app info:", error);
    return NextResponse.json({ success: false, error }, { status: 400});
  }
}
