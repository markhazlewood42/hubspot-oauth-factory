import { getAllRegisteredApps } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await getAllRegisteredApps();
    return NextResponse.json(result);
  }
  catch (error) {
    return NextResponse.json(
      { success: false, appRecords: null, error: `Failed to fetch apps: ${error}` },
      { status: 500 }
    );
  }
}
