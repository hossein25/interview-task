import { BACKEND_BASE_URL } from "@/constants/base-url";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ marketId: string }> },
) {
  const { marketId } = await params;
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  const response = await fetch(
    `${BACKEND_BASE_URL}/v2/mth/actives/${marketId}/?type=${type}`,
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
