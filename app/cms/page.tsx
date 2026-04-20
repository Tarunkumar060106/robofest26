"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_CMS_CONTENT,
  type BentoContent,
  type BentoMetric,
  type CmsContent,
  type FaqItem,
  type RuleItem,
  type SiteSettings,
} from "@/lib/cmsContent";

type EventField =
  | "number"
  | "title"
  | "tag"
  | "description"
  | "prize"
  | "fee"
  | "venue"
  | "team"
  | "color"
  | "backgroundImage";

const CMS_KEY_STORAGE = "robofest.cms.key";

const FIELDS: Array<{ key: EventField; label: string }> = [
  { key: "number", label: "No." },
  { key: "title", label: "Title" },
  { key: "tag", label: "Tag" },
  { key: "description", label: "Description" },
  { key: "prize", label: "Prize" },
  { key: "fee", label: "Entry Fee" },
  { key: "venue", label: "Venue" },
  { key: "team", label: "Team Size" },
  { key: "color", label: "Color" },
  { key: "backgroundImage", label: "Background Image" },
];

const BENTO_FIELDS: Array<{
  key: Exclude<keyof BentoContent, "eyebrow" | "heading">;
  label: string;
}> = [
  { key: "events", label: "Events" },
  { key: "states", label: "States" },
  { key: "footfall", label: "Footfall" },
  { key: "teams", label: "Teams" },
  { key: "prizePool", label: "Prize Pool" },
  { key: "sponsors", label: "Sponsors" },
  { key: "awards", label: "Awards" },
];

const sectionClass =
  "rounded-2xl border border-zinc-200/80 bg-white/95 p-5 shadow-sm backdrop-blur";
const labelClass = "flex flex-col gap-1.5 text-sm";
const inputClass =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm transition focus:border-zinc-900 focus:outline-none";
const textareaClass =
  "min-h-24 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm transition focus:border-zinc-900 focus:outline-none";

function getAuthHeaders(cmsKey: string) {
  return {
    "x-cms-key": cmsKey,
  };
}

export default function CmsPage() {
  const [content, setContent] = useState<CmsContent>(DEFAULT_CMS_CONTENT);
  const [status, setStatus] = useState("Enter access key to unlock CMS.");
  const [cmsKey, setCmsKey] = useState("");
  const [pendingKey, setPendingKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState("");

  const totalPrize = useMemo(() => {
    return content.events.reduce((sum, eventItem) => {
      const amount = Number(eventItem.prize.replace(/[^0-9]/g, ""));
      return Number.isFinite(amount) ? sum + amount : sum;
    }, 0);
  }, [content.events]);

  const fetchCmsContent = async (key: string) => {
    const response = await fetch("/api/cms", {
      cache: "no-store",
      headers: getAuthHeaders(key),
    });

    const payload = await response.json().catch(() => null);

    if (response.status === 401) {
      throw new Error("Invalid CMS access key.");
    }

    if (!response.ok) {
      throw new Error(payload?.error || "Could not load CMS content.");
    }

    if (payload?.content) {
      setContent(payload.content as CmsContent);
      setStatus(
        payload.source === "supabase"
          ? "Loaded content from Supabase."
          : "Loaded default content.",
      );
    }
  };

  const authenticate = async (keyInput: string, persist = true) => {
    const trimmed = keyInput.trim();
    if (!trimmed) {
      setAuthError("Access key is required.");
      return;
    }

    setIsAuthenticating(true);
    setAuthError("");
    setStatus("Authenticating CMS access...");

    try {
      await fetchCmsContent(trimmed);
      setCmsKey(trimmed);
      setIsAuthenticated(true);
      setStatus("Authenticated. CMS editor unlocked.");

      if (persist) {
        window.sessionStorage.setItem(CMS_KEY_STORAGE, trimmed);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to authenticate CMS.";
      setAuthError(message);
      setStatus(message);
      setIsAuthenticated(false);
      setCmsKey("");
      window.sessionStorage.removeItem(CMS_KEY_STORAGE);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signOut = () => {
    setIsAuthenticated(false);
    setCmsKey("");
    setPendingKey("");
    setAuthError("");
    setContent(DEFAULT_CMS_CONTENT);
    setStatus("Signed out. Enter access key to unlock CMS.");
    window.sessionStorage.removeItem(CMS_KEY_STORAGE);
  };

  useEffect(() => {
    const savedKey = window.sessionStorage.getItem(CMS_KEY_STORAGE);
    if (!savedKey) return;

    setPendingKey(savedKey);
    void authenticate(savedKey, false);
  }, []);

  const updateSiteSetting = <K extends keyof SiteSettings>(
    key: K,
    value: SiteSettings[K],
  ) => {
    setContent((prev) => ({
      ...prev,
      siteSettings: {
        ...prev.siteSettings,
        [key]: value,
      },
    }));
    setStatus("Unsaved changes. Click Save to publish to Supabase.");
  };

  const updateBentoField = (key: "eyebrow" | "heading", value: string) => {
    setContent((prev) => ({
      ...prev,
      bento: {
        ...prev.bento,
        [key]: value,
      },
    }));
    setStatus("Unsaved changes. Click Save to publish to Supabase.");
  };

  const updateBentoMetric = (
    key: Exclude<keyof BentoContent, "eyebrow" | "heading">,
    field: keyof BentoMetric,
    value: string,
  ) => {
    setContent((prev) => ({
      ...prev,
      bento: {
        ...prev.bento,
        [key]: {
          ...prev.bento[key],
          [field]: value,
        },
      },
    }));
    setStatus("Unsaved changes. Click Save to publish to Supabase.");
  };

  const handleFieldChange = (
    index: number,
    field: EventField,
    value: string,
  ) => {
    setContent((prev) => {
      const nextEvents = [...prev.events];
      nextEvents[index] = { ...nextEvents[index], [field]: value };
      return { ...prev, events: nextEvents };
    });
    setStatus("Unsaved changes. Click Save to publish to Supabase.");
  };

  const handleFaqChange = (index: number, key: keyof FaqItem, value: string) => {
    setContent((prev) => {
      const nextFaqs = [...prev.faqs];
      nextFaqs[index] = { ...nextFaqs[index], [key]: value };
      return { ...prev, faqs: nextFaqs };
    });
    setStatus("Unsaved changes. Click Save to publish to Supabase.");
  };

  const addFaq = () => {
    setContent((prev) => ({ ...prev, faqs: [...prev.faqs, { q: "", a: "" }] }));
    setStatus("Unsaved changes. Click Save to publish to Supabase.");
  };

  const removeFaq = (index: number) => {
    setContent((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
    setStatus("Unsaved changes. Click Save to publish to Supabase.");
  };

  const updateSponsorList = (key: "row1" | "row2", value: string) => {
    const items = value
      .split("\n")
      .map((v) => v.trim())
      .filter(Boolean);
    setContent((prev) => ({
      ...prev,
      sponsors: {
        ...prev.sponsors,
        [key]: items,
      },
    }));
    setStatus("Unsaved changes. Click Save to publish to Supabase.");
  };

  const updateSponsorField = (key: keyof CmsContent["sponsors"], value: string) => {
    setContent((prev) => ({
      ...prev,
      sponsors: {
        ...prev.sponsors,
        [key]: value,
      },
    }));
    setStatus("Unsaved changes. Click Save to publish to Supabase.");
  };

  const updateRulesField = (
    key: Exclude<
      keyof CmsContent["rules"],
      "generalRules" | "accommodationParagraphs" | "accommodationBullets"
    >,
    value: string,
  ) => {
    setContent((prev) => ({
      ...prev,
      rules: {
        ...prev.rules,
        [key]: value,
      },
    }));
    setStatus("Unsaved changes. Click Save to publish to Supabase.");
  };

  const updateRulesList = (
    key: "accommodationParagraphs" | "accommodationBullets",
    value: string,
  ) => {
    const items = value
      .split("\n")
      .map((v) => v.trim())
      .filter(Boolean);
    setContent((prev) => ({
      ...prev,
      rules: {
        ...prev.rules,
        [key]: items,
      },
    }));
    setStatus("Unsaved changes. Click Save to publish to Supabase.");
  };

  const updateGeneralRule = (
    index: number,
    key: keyof RuleItem,
    value: string,
  ) => {
    setContent((prev) => {
      const nextRules = [...prev.rules.generalRules];
      nextRules[index] = { ...nextRules[index], [key]: value };
      return {
        ...prev,
        rules: {
          ...prev.rules,
          generalRules: nextRules,
        },
      };
    });
    setStatus("Unsaved changes. Click Save to publish to Supabase.");
  };

  const addGeneralRule = () => {
    setContent((prev) => ({
      ...prev,
      rules: {
        ...prev.rules,
        generalRules: [...prev.rules.generalRules, { title: "", content: "" }],
      },
    }));
    setStatus("Unsaved changes. Click Save to publish to Supabase.");
  };

  const removeGeneralRule = (index: number) => {
    setContent((prev) => ({
      ...prev,
      rules: {
        ...prev.rules,
        generalRules: prev.rules.generalRules.filter((_, i) => i !== index),
      },
    }));
    setStatus("Unsaved changes. Click Save to publish to Supabase.");
  };

  const saveToSupabase = async () => {
    if (!cmsKey) {
      setStatus("Session is not authenticated. Re-enter CMS key.");
      setIsAuthenticated(false);
      return;
    }

    setStatus("Saving to Supabase...");
    try {
      const response = await fetch("/api/cms", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(cmsKey),
        },
        body: JSON.stringify({ content }),
      });

      if (response.status === 401) {
        setStatus("Session expired or key is invalid. Please authenticate again.");
        setIsAuthenticated(false);
        setCmsKey("");
        window.sessionStorage.removeItem(CMS_KEY_STORAGE);
        return;
      }

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.error || "Save failed. Check CMS and Supabase config.";
        setStatus(message);
        return;
      }

      setStatus("Saved to Supabase. Refresh homepage to verify updates.");
    } catch {
      setStatus("Save failed. Could not reach API.");
    }
  };

  const resetToDefaults = () => {
    setContent(DEFAULT_CMS_CONTENT);
    setStatus("Reset locally. Click Save to publish defaults to Supabase.");
  };

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(content, null, 2));
      setStatus("JSON copied to clipboard.");
    } catch {
      setStatus("Could not access clipboard. Copy manually from the preview box.");
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#f4f4f5_0%,#fafafa_42%,#ffffff_100%)] px-4 py-16">
        <div className="mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white/95 p-6 shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Robofest CMS
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
            Secure Access Required
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Enter the CMS access key to view and edit website content.
          </p>

          <form
            className="mt-6 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              void authenticate(pendingKey);
            }}
          >
            <label className={labelClass}>
              <span className="font-medium text-zinc-700">Access Key</span>
              <input
                type="password"
                value={pendingKey}
                onChange={(e) => setPendingKey(e.target.value)}
                className={inputClass}
                placeholder="Enter CMS key"
                autoComplete="off"
              />
            </label>
            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAuthenticating ? "Authenticating..." : "Unlock CMS"}
            </button>
          </form>

          {authError ? (
            <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {authError}
            </p>
          ) : (
            <p className="mt-3 text-xs text-zinc-500">{status}</p>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#f4f4f5_0%,#fafafa_42%,#ffffff_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Robofest CMS
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
              Content Control Panel
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Edit content blocks, review data, and publish updates in one place.
            </p>
          </div>
          <button
            onClick={signOut}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            Sign Out
          </button>
        </div>

        <div className="mt-5 rounded-xl border border-zinc-200 bg-white/90 px-4 py-3 text-sm shadow-sm">
          <p className="font-medium text-zinc-800">Status: {status}</p>
          <p className="mt-1 text-zinc-600">
            Total Prize Pool Preview: ₹{totalPrize.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="sticky top-4 z-20 mt-5 flex flex-wrap gap-3 rounded-xl border border-zinc-200 bg-white/95 p-3 shadow-sm backdrop-blur">
          <button
            onClick={saveToSupabase}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700"
          >
            Save to Supabase
          </button>
          <button
            onClick={resetToDefaults}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            Reset to Defaults
          </button>
          <button
            onClick={copyJson}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            Copy JSON
          </button>
        </div>

        <div className="mt-8 space-y-6">
          <section className={sectionClass}>
            <h2 className="mb-4 text-xl font-semibold text-zinc-900">Site Settings</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <label className={labelClass}>
                <span className="font-medium text-zinc-700">Event Date ISO</span>
                <input
                  value={content.siteSettings.eventDateIso}
                  onChange={(e) => updateSiteSetting("eventDateIso", e.target.value)}
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                <span className="font-medium text-zinc-700">Launch Ceremony</span>
                <select
                  value={content.siteSettings.launch ? "true" : "false"}
                  onChange={(e) => updateSiteSetting("launch", e.target.value === "true")}
                  className={inputClass}
                >
                  <option value="false">false (homepage)</option>
                  <option value="true">true (show ceremony)</option>
                </select>
              </label>
              <label className={labelClass}>
                <span className="font-medium text-zinc-700">Registration URL</span>
                <input
                  value={content.siteSettings.registrationUrl}
                  onChange={(e) => updateSiteSetting("registrationUrl", e.target.value)}
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                <span className="font-medium text-zinc-700">CTA Label</span>
                <input
                  value={content.siteSettings.ctaLabel}
                  onChange={(e) => updateSiteSetting("ctaLabel", e.target.value)}
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                <span className="font-medium text-zinc-700">Menu CTA Subtext</span>
                <input
                  value={content.siteSettings.menuRegisterSubtext}
                  onChange={(e) =>
                    updateSiteSetting("menuRegisterSubtext", e.target.value)
                  }
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                <span className="font-medium text-zinc-700">Hero Department</span>
                <input
                  value={content.siteSettings.heroDepartment}
                  onChange={(e) => updateSiteSetting("heroDepartment", e.target.value)}
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                <span className="font-medium text-zinc-700">Hero Title</span>
                <input
                  value={content.siteSettings.heroTitle}
                  onChange={(e) => updateSiteSetting("heroTitle", e.target.value)}
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                <span className="font-medium text-zinc-700">Hero Collab Prefix</span>
                <input
                  value={content.siteSettings.heroCollabPrefix}
                  onChange={(e) =>
                    updateSiteSetting("heroCollabPrefix", e.target.value)
                  }
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                <span className="font-medium text-zinc-700">Hero Collab Org</span>
                <input
                  value={content.siteSettings.heroCollabOrg}
                  onChange={(e) => updateSiteSetting("heroCollabOrg", e.target.value)}
                  className={inputClass}
                />
              </label>
              <label className={`${labelClass} md:col-span-2`}>
                <span className="font-medium text-zinc-700">Hero Animated Lines (1 per line)</span>
                <textarea
                  value={content.siteSettings.heroAnimatedLines.join("\n")}
                  onChange={(e) =>
                    updateSiteSetting(
                      "heroAnimatedLines",
                      e.target.value
                        .split("\n")
                        .map((v) => v.trim())
                        .filter(Boolean),
                    )
                  }
                  className={textareaClass}
                />
              </label>
              <label className={labelClass}>
                <span className="font-medium text-zinc-700">Sponsors Section State</span>
                <select
                  value={content.siteSettings.sponsorsState}
                  onChange={(e) =>
                    updateSiteSetting(
                      "sponsorsState",
                      e.target.value as SiteSettings["sponsorsState"],
                    )
                  }
                  className={inputClass}
                >
                  <option value="coming-soon">coming-soon</option>
                  <option value="live">live</option>
                </select>
              </label>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="mb-4 text-xl font-semibold text-zinc-900">Bento Grid Content</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <input
                value={content.bento.eyebrow}
                onChange={(e) => updateBentoField("eyebrow", e.target.value)}
                className={inputClass}
                placeholder="Eyebrow"
              />
              <input
                value={content.bento.heading}
                onChange={(e) => updateBentoField("heading", e.target.value)}
                className={inputClass}
                placeholder="Heading"
              />
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {BENTO_FIELDS.map((field) => (
                <div key={field.key} className="rounded-xl border border-zinc-200 p-3">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    {field.label}
                  </h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      value={content.bento[field.key].value}
                      onChange={(e) =>
                        updateBentoMetric(field.key, "value", e.target.value)
                      }
                      className={inputClass}
                      placeholder="Value"
                    />
                    <input
                      value={content.bento[field.key].subtext}
                      onChange={(e) =>
                        updateBentoMetric(field.key, "subtext", e.target.value)
                      }
                      className={inputClass}
                      placeholder="Subtext"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="mb-4 text-xl font-semibold text-zinc-900">FAQ Content</h2>
            <div className="space-y-3">
              {content.faqs.map((faq, index) => (
                <div key={index} className="rounded-xl border border-zinc-200 p-3">
                  <input
                    value={faq.q}
                    onChange={(e) => handleFaqChange(index, "q", e.target.value)}
                    className={`${inputClass} mb-2 w-full`}
                    placeholder="Question"
                  />
                  <textarea
                    value={faq.a}
                    onChange={(e) => handleFaqChange(index, "a", e.target.value)}
                    className={`${textareaClass} min-h-20 w-full`}
                    placeholder="Answer"
                  />
                  <button
                    onClick={() => removeFaq(index)}
                    className="mt-2 rounded-md border border-red-300 px-3 py-1 text-sm font-medium text-red-700 transition hover:bg-red-50"
                  >
                    Remove FAQ
                  </button>
                </div>
              ))}
              <button
                onClick={addFaq}
                className="rounded-md border border-zinc-300 px-3 py-1 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
              >
                Add FAQ
              </button>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="mb-4 text-xl font-semibold text-zinc-900">Sponsors Content</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <input
                value={content.sponsors.eyebrow}
                onChange={(e) => updateSponsorField("eyebrow", e.target.value)}
                className={inputClass}
                placeholder="Eyebrow"
              />
              <input
                value={content.sponsors.headingPrefix}
                onChange={(e) => updateSponsorField("headingPrefix", e.target.value)}
                className={inputClass}
                placeholder="Heading Prefix"
              />
              <input
                value={content.sponsors.headingEmphasis}
                onChange={(e) => updateSponsorField("headingEmphasis", e.target.value)}
                className={inputClass}
                placeholder="Heading Emphasis"
              />
              <input
                value={content.sponsors.ctaText}
                onChange={(e) => updateSponsorField("ctaText", e.target.value)}
                className={inputClass}
                placeholder="CTA Text"
              />
              <input
                value={content.sponsors.ctaUrl}
                onChange={(e) => updateSponsorField("ctaUrl", e.target.value)}
                className={`${inputClass} md:col-span-2`}
                placeholder="CTA URL"
              />
              <input
                value={content.sponsors.brochureText}
                onChange={(e) => updateSponsorField("brochureText", e.target.value)}
                className={inputClass}
                placeholder="Brochure Button Text"
              />
              <input
                value={content.sponsors.brochureUrl}
                onChange={(e) => updateSponsorField("brochureUrl", e.target.value)}
                className={inputClass}
                placeholder="Brochure URL"
              />
              <input
                value={content.sponsors.contactEmail}
                onChange={(e) => updateSponsorField("contactEmail", e.target.value)}
                className={`${inputClass} md:col-span-2`}
                placeholder="Contact Email"
              />
              <textarea
                value={content.sponsors.subtext}
                onChange={(e) => updateSponsorField("subtext", e.target.value)}
                className={`${textareaClass} md:col-span-2`}
                placeholder="Sponsors section subtext"
              />
              <textarea
                value={content.sponsors.row1.join("\n")}
                onChange={(e) => updateSponsorList("row1", e.target.value)}
                className={textareaClass}
                placeholder="Row 1 sponsors (one per line)"
              />
              <textarea
                value={content.sponsors.row2.join("\n")}
                onChange={(e) => updateSponsorList("row2", e.target.value)}
                className={textareaClass}
                placeholder="Row 2 sponsors (one per line)"
              />
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="mb-4 text-xl font-semibold text-zinc-900">Rules Page Content</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <input
                value={content.rules.pageTitle}
                onChange={(e) => updateRulesField("pageTitle", e.target.value)}
                className={inputClass}
                placeholder="Page Title"
              />
              <input
                value={content.rules.sectionTitle}
                onChange={(e) => updateRulesField("sectionTitle", e.target.value)}
                className={inputClass}
                placeholder="Section Title"
              />
              <label className={labelClass}>
                <span className="font-medium text-zinc-700">Event Rulebooks State</span>
                <select
                  value={content.rules.eventRulebooksState}
                  onChange={(e) =>
                    updateRulesField(
                      "eventRulebooksState",
                      e.target.value as CmsContent["rules"]["eventRulebooksState"],
                    )
                  }
                  className={inputClass}
                >
                  <option value="coming-soon">coming-soon</option>
                  <option value="live">live</option>
                </select>
              </label>
              <input
                value={content.rules.accommodationTitle}
                onChange={(e) =>
                  updateRulesField("accommodationTitle", e.target.value)
                }
                className={inputClass}
                placeholder="Accommodation Title"
              />
              <input
                value={content.rules.registerUrl}
                onChange={(e) => updateRulesField("registerUrl", e.target.value)}
                className={inputClass}
                placeholder="Rules Register URL"
              />
              <textarea
                value={content.rules.accommodationParagraphs.join("\n")}
                onChange={(e) =>
                  updateRulesList("accommodationParagraphs", e.target.value)
                }
                className={`${textareaClass} md:col-span-2`}
                placeholder="Accommodation paragraphs (one per line)"
              />
              <textarea
                value={content.rules.accommodationBullets.join("\n")}
                onChange={(e) =>
                  updateRulesList("accommodationBullets", e.target.value)
                }
                className={`${textareaClass} md:col-span-2`}
                placeholder="Accommodation bullets (one per line)"
              />
            </div>

            <div className="mt-4 space-y-3">
              <h3 className="text-lg font-semibold text-zinc-900">General Rule Cards</h3>
              {content.rules.generalRules.map((rule, index) => (
                <div key={index} className="rounded-xl border border-zinc-200 p-3">
                  <input
                    value={rule.title}
                    onChange={(e) =>
                      updateGeneralRule(index, "title", e.target.value)
                    }
                    className={`${inputClass} mb-2 w-full`}
                    placeholder="Rule title"
                  />
                  <textarea
                    value={rule.content}
                    onChange={(e) =>
                      updateGeneralRule(index, "content", e.target.value)
                    }
                    className={`${textareaClass} min-h-20 w-full`}
                    placeholder="Rule content"
                  />
                  <button
                    onClick={() => removeGeneralRule(index)}
                    className="mt-2 rounded-md border border-red-300 px-3 py-1 text-sm font-medium text-red-700 transition hover:bg-red-50"
                  >
                    Remove Rule
                  </button>
                </div>
              ))}
              <button
                onClick={addGeneralRule}
                className="rounded-md border border-zinc-300 px-3 py-1 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
              >
                Add Rule
              </button>
            </div>
          </section>

          {content.events.map((eventItem, index) => (
            <section
              key={`${eventItem.number}-${index}`}
              className={sectionClass}
            >
              <h2 className="mb-4 text-xl font-semibold text-zinc-900">
                Event {eventItem.number}: {eventItem.title}
              </h2>

              <div className="grid gap-3 md:grid-cols-2">
                {FIELDS.map((field) => (
                  <label key={field.key} className={labelClass}>
                    <span className="font-medium text-zinc-700">{field.label}</span>
                    {field.key === "description" ? (
                      <textarea
                        value={eventItem[field.key] ?? ""}
                        onChange={(e) =>
                          handleFieldChange(index, field.key, e.target.value)
                        }
                        className={textareaClass}
                      />
                    ) : (
                      <input
                        value={eventItem[field.key] ?? ""}
                        onChange={(e) =>
                          handleFieldChange(index, field.key, e.target.value)
                        }
                        className={inputClass}
                      />
                    )}
                  </label>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className={`mt-8 ${sectionClass}`}>
          <h2 className="text-lg font-semibold text-zinc-900">Current JSON Preview</h2>
          <textarea
            readOnly
            value={JSON.stringify(content, null, 2)}
            className="mt-3 min-h-65 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 font-mono text-xs text-zinc-800"
          />
        </section>
      </div>
    </main>
  );
}
