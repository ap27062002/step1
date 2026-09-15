import { NextRequest, NextResponse } from "next/server";
import { webSearch } from "@/lib/googleSearch";
import { persona } from "@/lib/persona";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q") || persona.discoveryQueries[0];

  const result = await webSearch(q);
  return NextResponse.json(result);
}
