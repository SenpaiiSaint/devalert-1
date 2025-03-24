import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const metrics = await prisma.metricReading.findMany({
      orderBy: { timestamp: "desc" },
      take: 100,
    });
    return NextResponse.json(metrics, { status: 200 });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { metricName, value, timestamp } = await req.json();
    const metric = await prisma.metricReading.create({
      data: {
        metricName: String(metricName),
        value: Number(value),
        timestamp: timestamp ? new Date(timestamp) : undefined,
      },
    });
    return NextResponse.json(
      { message: "Metric reading ingested", metric },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error ingesting metric:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    // Retrieve the 'id' query parameter from the request URL
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing metric ID" },
        { status: 400 }
      );
    }

    await prisma.metricReading.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { message: `Metric ${id} deleted` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting metric:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

