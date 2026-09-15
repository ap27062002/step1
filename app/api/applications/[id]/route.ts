import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { $Enums } from "@/app/generated/prisma/client";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const { status, notes, appliedDate } = body;

  const data: {
    status?: $Enums.ApplicationStatus;
    notes?: string | null;
    appliedDate?: Date | null;
  } = {};
  if (status !== undefined) data.status = status;
  if (notes !== undefined) data.notes = notes;
  if (appliedDate !== undefined) {
    data.appliedDate = appliedDate ? new Date(appliedDate) : null;
  }

  try {
    const application = await prisma.application.update({
      where: { id },
      data,
    });
    return NextResponse.json(application);
  } catch {
    return NextResponse.json(
      { error: "Application not found" },
      { status: 404 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await prisma.application.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Application not found" },
      { status: 404 },
    );
  }
}
