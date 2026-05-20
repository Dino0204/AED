import { NextResponse } from "next/server";

export function withCors(res: NextResponse, req: Request): NextResponse {
  const origin = req.headers.get("origin") ?? "";
  if (origin.startsWith("chrome-extension://")) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Access-Control-Allow-Credentials", "true");
    res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type,Authorization");
  }
  return res;
}

export function corsPreflightResponse(req: Request): NextResponse {
  const origin = req.headers.get("origin") ?? "";
  const res = new NextResponse(null, { status: 204 });
  if (origin.startsWith("chrome-extension://")) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Access-Control-Allow-Credentials", "true");
    res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type,Authorization");
  }
  return res;
}
