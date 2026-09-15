import { NextRequest, NextResponse } from "next/server";
import { findContacts } from "@/lib/hunter";

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain")?.trim();

  if (!domain) {
    return NextResponse.json({ error: "domain is required" }, { status: 400 });
  }

  const result = await findContacts(domain);
  return NextResponse.json(result);
}
