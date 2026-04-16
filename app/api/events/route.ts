import { NextResponse } from "next/server";
import { DEFAULT_EVENTS } from "@/lib/eventsData";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

const CMS_KEY = "events";

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("cms_content")
      .select("value")
      .eq("key", CMS_KEY)
      .single();

    if (error) {
      return NextResponse.json({ events: DEFAULT_EVENTS, source: "default" });
    }

    const value = data?.value;
    if (!Array.isArray(value) || value.length === 0) {
      return NextResponse.json({ events: DEFAULT_EVENTS, source: "default" });
    }

    return NextResponse.json({ events: value, source: "supabase" });
  } catch {
    return NextResponse.json({ events: DEFAULT_EVENTS, source: "default" });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const events = body?.events;

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { error: "Invalid payload. Expected non-empty events array." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from("cms_content").upsert(
      {
        key: CMS_KEY,
        value: events,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" },
    );

    if (error) {
      return NextResponse.json(
        { error: "Failed to save events in Supabase." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to parse request body." },
      { status: 400 },
    );
  }
}
