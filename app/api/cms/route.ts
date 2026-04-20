import { NextResponse } from "next/server";
import {
  DEFAULT_CMS_CONTENT,
  type BentoContent,
  type BentoMetric,
  type CmsContent,
} from "@/lib/cmsContent";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

type CmsContentPatch = {
  siteSettings?: Partial<CmsContent["siteSettings"]>;
  bento?: Partial<CmsContent["bento"]>;
  events?: CmsContent["events"];
  faqs?: CmsContent["faqs"];
  sponsors?: Partial<CmsContent["sponsors"]>;
  rules?: Partial<CmsContent["rules"]>;
};

function mergeBentoMetric(
  partial: Partial<BentoMetric> | undefined,
  defaults: BentoMetric,
): BentoMetric {
  return {
    ...defaults,
    ...(partial ?? {}),
  };
}

function mergeBentoContent(partial: CmsContentPatch["bento"]): BentoContent {
  const defaults = DEFAULT_CMS_CONTENT.bento;

  return {
    eyebrow: partial?.eyebrow ?? defaults.eyebrow,
    heading: partial?.heading ?? defaults.heading,
    events: mergeBentoMetric(partial?.events, defaults.events),
    states: mergeBentoMetric(partial?.states, defaults.states),
    footfall: mergeBentoMetric(partial?.footfall, defaults.footfall),
    teams: mergeBentoMetric(partial?.teams, defaults.teams),
    prizePool: mergeBentoMetric(partial?.prizePool, defaults.prizePool),
    sponsors: mergeBentoMetric(partial?.sponsors, defaults.sponsors),
    awards: mergeBentoMetric(partial?.awards, defaults.awards),
  };
}

function ensureAuthorized(req: Request): NextResponse | null {
  const configuredKey = process.env.CMS_ADMIN_KEY;
  if (!configuredKey) {
    return NextResponse.json(
      {
        error:
          "CMS auth is not configured. Set CMS_ADMIN_KEY in your server environment.",
      },
      { status: 500 },
    );
  }

  const providedKey = req.headers.get("x-cms-key");
  if (!providedKey || providedKey !== configuredKey) {
    return NextResponse.json({ error: "Unauthorized CMS request." }, { status: 401 });
  }

  return null;
}

function mergeCmsContent(partial: CmsContentPatch): CmsContent {
  return {
    siteSettings: {
      ...DEFAULT_CMS_CONTENT.siteSettings,
      ...(partial.siteSettings ?? {}),
    },
    bento: mergeBentoContent(partial.bento),
    events:
      Array.isArray(partial.events) && partial.events.length > 0
        ? partial.events
        : DEFAULT_CMS_CONTENT.events,
    faqs:
      Array.isArray(partial.faqs) && partial.faqs.length > 0
        ? partial.faqs
        : DEFAULT_CMS_CONTENT.faqs,
    sponsors: {
      ...DEFAULT_CMS_CONTENT.sponsors,
      ...(partial.sponsors ?? {}),
      row1:
        Array.isArray(partial.sponsors?.row1) && partial.sponsors.row1.length > 0
          ? partial.sponsors.row1
          : DEFAULT_CMS_CONTENT.sponsors.row1,
      row2:
        Array.isArray(partial.sponsors?.row2) && partial.sponsors.row2.length > 0
          ? partial.sponsors.row2
          : DEFAULT_CMS_CONTENT.sponsors.row2,
    },
    rules: {
      ...DEFAULT_CMS_CONTENT.rules,
      ...(partial.rules ?? {}),
      accommodationParagraphs:
        Array.isArray(partial.rules?.accommodationParagraphs) &&
        partial.rules.accommodationParagraphs.length > 0
          ? partial.rules.accommodationParagraphs
          : DEFAULT_CMS_CONTENT.rules.accommodationParagraphs,
      accommodationBullets:
        Array.isArray(partial.rules?.accommodationBullets) &&
        partial.rules.accommodationBullets.length > 0
          ? partial.rules.accommodationBullets
          : DEFAULT_CMS_CONTENT.rules.accommodationBullets,
      generalRules:
        Array.isArray(partial.rules?.generalRules) &&
        partial.rules.generalRules.length > 0
          ? partial.rules.generalRules
          : DEFAULT_CMS_CONTENT.rules.generalRules,
    },
  };
}

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("cms_content")
      .select("key, value")
      .in("key", ["site_settings", "bento", "events", "faqs", "sponsors", "rules"]);

    if (error || !data) {
      return NextResponse.json({ content: DEFAULT_CMS_CONTENT, source: "default" });
    }

    const partial: CmsContentPatch = {
      siteSettings: data.find((row) => row.key === "site_settings")
        ?.value as Partial<CmsContent["siteSettings"]> | undefined,
      bento: data.find((row) => row.key === "bento")?.value as
        | Partial<CmsContent["bento"]>
        | undefined,
      events: data.find((row) => row.key === "events")?.value as
        | CmsContent["events"]
        | undefined,
      faqs: data.find((row) => row.key === "faqs")?.value as
        | CmsContent["faqs"]
        | undefined,
      sponsors: data.find((row) => row.key === "sponsors")?.value as
        | Partial<CmsContent["sponsors"]>
        | undefined,
      rules: data.find((row) => row.key === "rules")?.value as
        | Partial<CmsContent["rules"]>
        | undefined,
    };

    return NextResponse.json({ content: mergeCmsContent(partial), source: "supabase" });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error while reading CMS content.";
    return NextResponse.json(
      { content: DEFAULT_CMS_CONTENT, source: "default", error: message },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  const authError = ensureAuthorized(req);
  if (authError) {
    return authError;
  }

  let body: { content?: CmsContentPatch };

  try {
    body = (await req.json()) as { content?: CmsContentPatch };
  } catch {
    return NextResponse.json(
      { error: "Failed to parse request body." },
      { status: 400 },
    );
  }

  try {
    if (!body?.content) {
      return NextResponse.json({ error: "Missing content payload." }, { status: 400 });
    }

    const merged = mergeCmsContent(body.content);
    const supabase = getSupabaseAdminClient();

    const rows = [
      { key: "site_settings", value: merged.siteSettings },
      { key: "bento", value: merged.bento },
      { key: "events", value: merged.events },
      { key: "faqs", value: merged.faqs },
      { key: "sponsors", value: merged.sponsors },
      { key: "rules", value: merged.rules },
    ].map((row) => ({ ...row, updated_at: new Date().toISOString() }));

    const { error } = await supabase
      .from("cms_content")
      .upsert(rows, { onConflict: "key" });

    if (error) {
      return NextResponse.json(
        { error: `Failed to save CMS content in Supabase: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error while saving CMS content.";
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
