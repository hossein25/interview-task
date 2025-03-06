import { BACKEND_BASE_URL } from "@/constants/base-url";
import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch(`${BACKEND_BASE_URL}/v1/mkt/markets/`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`API responded with status: ${response.status}`);
  }

  return NextResponse.json(await response.json());
}
