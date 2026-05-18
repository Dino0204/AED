import { NextResponse } from "next/server";
import { clearSessionToken } from "@/lib/session";

export async function GET(req: Request) {
  await clearSessionToken();
  return NextResponse.redirect(new URL("/", req.url));
}
