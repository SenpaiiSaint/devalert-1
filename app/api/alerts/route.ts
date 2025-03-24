import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const rules = await prisma.alertRule.findMany();
    return NextResponse.json(rules, { status: 200 });
  } catch (error) {
    console.error("Error fetching alert rules:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { metricName, operator, threshold } = await req.json();
    const newRule = await prisma.alertRule.create({
      data: {
        metricName: String(metricName),
        operator: String(operator),
        threshold: Number(threshold),
      },
    });
    return NextResponse.json(
      { message: "Alert rule created", newRule },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating alert rule:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Missing alert rule ID" },
        { status: 400 }
      );
    }

    await prisma.alertRule.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json(
      { message: `Alert rule ${id} deleted` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting alert rule:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
