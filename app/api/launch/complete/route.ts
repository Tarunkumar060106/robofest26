import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("cms_content")
      .select("value")
      .eq("key", "site_settings")
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: `Failed to read launch state: ${error.message}` },
        { status: 500 },
      );
    }

    const currentValue =
      data && typeof data.value === "object" && data.value !== null
        ? (data.value as Record<string, unknown>)
        : {};

    const nextValue = {
      ...currentValue,
      launch: false,
    };

    const { error: upsertError } = await supabase.from("cms_content").upsert(
      {
        key: "site_settings",
        value: nextValue,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" },
    );

    if (upsertError) {
      return NextResponse.json(
        { error: `Failed to update launch state: ${upsertError.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, launch: false });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown launch completion error.";

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
