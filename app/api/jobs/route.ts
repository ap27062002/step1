import { NextRequest, NextResponse } from "next/server";
import { searchJobs } from "@/lib/adzuna";
import { persona } from "@/lib/persona";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const what = searchParams.get("what") || persona.targetRoles[0];
  const where = searchParams.get("where") || undefined;
  const page = Number(searchParams.get("page") || 1);

  const result = await searchJobs({ what, where, page });
  return NextResponse.json(result);
}
