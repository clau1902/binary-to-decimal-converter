import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { searches } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allSearches = await db
      .select()
      .from(searches)
      .orderBy(desc(searches.createdAt))
      .limit(50);

    return NextResponse.json(allSearches);
  } catch (error) {
    console.error("Error fetching searches:", error);
    return NextResponse.json(
      { error: "Failed to fetch searches" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { inputType, inputValue, decimalResult } = body;

    if (!inputType || !inputValue || !decimalResult) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newSearch = await db
      .insert(searches)
      .values({
        inputType,
        inputValue,
        decimalResult: String(decimalResult),
      })
      .returning();

    return NextResponse.json(newSearch[0], { status: 201 });
  } catch (error) {
    console.error("Error saving search:", error);
    return NextResponse.json(
      { error: "Failed to save search" },
      { status: 500 }
    );
  }
}

