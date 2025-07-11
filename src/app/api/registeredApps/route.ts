import * as db from "@/lib/db";
import { registerNewApp } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await db.getAllRegisteredApps();
    return NextResponse.json(result);
  }
  catch (error) {
    return NextResponse.json(
      { success: false, appRecords: null, error: `Failed to fetch apps: ${error}` },
      { status: 500 }
    );
  }
}

// Expected param format:
// {
//   appId,
//   clientId,
//   clientSecret,
//   scopes,
//   redirectUrl
// }
export async function PUT(request: Request) {
  try {
    const appData = await request.json();

    const result = await registerNewApp(appData.appId, appData.clientId, appData.clientSecret, appData.scopes, appData.redirectUrl);
    return NextResponse.json({ success: true, appRecord: result.appRecord });
  }
  catch (error) {
    return NextResponse.json(
      { success: false, appRecord: null, error: `Failed to store app: ${error}` },
      { status: 500 }
    );
  }
}
