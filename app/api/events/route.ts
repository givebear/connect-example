import { NextResponse } from "next/server";
import { store } from "@/lib/store";

/** Polled by the dashboard to show webhook events as they arrive. */
export function GET() {
  return NextResponse.json({
    configured: store.getSecret() != null,
    events: store.recent(),
  });
}
