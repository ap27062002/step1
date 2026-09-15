import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const applications = await prisma.application.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(applications);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { jobTitle, company, location, url, source, salary, notes, status } =
    body;

  if (!jobTitle || !company) {
    return NextResponse.json(
      { error: "jobTitle and company are required" },
      { status: 400 },
    );
  }

  const application = await prisma.application.create({
    data: {
      jobTitle,
      company,
      location: location || null,
      url: url || null,
      source: source || "Manual",
      salary: salary || null,
      notes: notes || null,
      status: status || "SAVED",
    },
  });

  return NextResponse.json(application, { status: 201 });
}
