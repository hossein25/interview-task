import { BACKEND_BASE_URL } from "@/constants/base-url";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const marketId = searchParams.get("marketId");
  const response = await fetch(
    `${BACKEND_BASE_URL}/v1/mth/matches/${marketId}/`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`API responded with status: ${response.status}`);
  }

  return NextResponse.json(await response.json());
}
