"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_CMS_CONTENT,
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

export default function CmsPage() {
  const [content, setContent] = useState<CmsContent>(DEFAULT_CMS_CONTENT);
  const [status, setStatus] = useState("Loading events from Supabase...");

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      try {
        const response = await fetch("/api/cms", { cache: "no-store" });
        if (!response.ok) {
          if (isMounted) {
            setStatus("Using defaults. Could not load from Supabase.");
          }
          return;
        }

        const payload = await response.json();
        if (isMounted && payload?.content) {
          setContent(payload.content as CmsContent);
          setStatus(payload.source === "supabase" ? "Loaded from Supabase." : "Loaded defaults.");
        }
      } catch {
        if (isMounted) {
          setStatus("Using defaults. Could not connect to Supabase.");
        }
      }
    };

    loadContent();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalPrize = useMemo(() => {
    return content.events.reduce((sum, eventItem) => {
      const amount = Number(eventItem.prize.replace(/[^0-9]/g, ""));
      return Number.isFinite(amount) ? sum + amount : sum;
    }, 0);
  }, [content.events]);

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
    key: Exclude<keyof CmsContent["rules"], "generalRules" | "accommodationParagraphs" | "accommodationBullets">,
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
        generalRules: [
          ...prev.rules.generalRules,
          { title: "", content: "" },
        ],
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
    setStatus("Saving to Supabase...");
    try {
      const response = await fetch("/api/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.error || "Save failed. Check Supabase env vars and table setup.";
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

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Robofest CMS Portal</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Edit site settings, events, FAQs, and sponsors. Save once to publish for everyone.
      </p>

      <div className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm">
        <p className="font-medium">Status: {status}</p>
        <p className="mt-1 text-zinc-600">
          Total Prize Pool Preview: ₹{totalPrize.toLocaleString("en-IN")}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={saveToSupabase}
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
        >
          Save to Supabase
        </button>
        <button
          onClick={resetToDefaults}
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium"
        >
          Reset to Defaults
        </button>
        <button
          onClick={copyJson}
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium"
        >
          Copy JSON
        </button>
      </div>

      <div className="mt-8 space-y-6">
        <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Site Settings</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-zinc-700">Event Date ISO</span>
              <input
                value={content.siteSettings.eventDateIso}
                onChange={(e) => updateSiteSetting("eventDateIso", e.target.value)}
                className="rounded-md border border-zinc-300 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-zinc-700">Registration URL</span>
              <input
                value={content.siteSettings.registrationUrl}
                onChange={(e) => updateSiteSetting("registrationUrl", e.target.value)}
                className="rounded-md border border-zinc-300 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-zinc-700">CTA Label</span>
              <input
                value={content.siteSettings.ctaLabel}
                onChange={(e) => updateSiteSetting("ctaLabel", e.target.value)}
                className="rounded-md border border-zinc-300 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-zinc-700">Menu CTA Subtext</span>
              <input
                value={content.siteSettings.menuRegisterSubtext}
                onChange={(e) =>
                  updateSiteSetting("menuRegisterSubtext", e.target.value)
                }
                className="rounded-md border border-zinc-300 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-zinc-700">Hero Department</span>
              <input
                value={content.siteSettings.heroDepartment}
                onChange={(e) => updateSiteSetting("heroDepartment", e.target.value)}
                className="rounded-md border border-zinc-300 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-zinc-700">Hero Title</span>
              <input
                value={content.siteSettings.heroTitle}
                onChange={(e) => updateSiteSetting("heroTitle", e.target.value)}
                className="rounded-md border border-zinc-300 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-zinc-700">Hero Collab Prefix</span>
              <input
                value={content.siteSettings.heroCollabPrefix}
                onChange={(e) =>
                  updateSiteSetting("heroCollabPrefix", e.target.value)
                }
                className="rounded-md border border-zinc-300 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-zinc-700">Hero Collab Org</span>
              <input
                value={content.siteSettings.heroCollabOrg}
                onChange={(e) => updateSiteSetting("heroCollabOrg", e.target.value)}
                className="rounded-md border border-zinc-300 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm md:col-span-2">
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
                className="min-h-24 rounded-md border border-zinc-300 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-zinc-700">Sponsors Section State</span>
              <select
                value={content.siteSettings.sponsorsState}
                onChange={(e) =>
                  updateSiteSetting(
                    "sponsorsState",
                    e.target.value as SiteSettings["sponsorsState"],
                  )
                }
                className="rounded-md border border-zinc-300 px-3 py-2"
              >
                <option value="coming-soon">coming-soon</option>
                <option value="live">live</option>
              </select>
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">FAQ Content</h2>
          <div className="space-y-3">
            {content.faqs.map((faq, index) => (
              <div key={index} className="rounded-lg border border-zinc-200 p-3">
                <input
                  value={faq.q}
                  onChange={(e) => handleFaqChange(index, "q", e.target.value)}
                  className="mb-2 w-full rounded-md border border-zinc-300 px-3 py-2"
                  placeholder="Question"
                />
                <textarea
                  value={faq.a}
                  onChange={(e) => handleFaqChange(index, "a", e.target.value)}
                  className="min-h-20 w-full rounded-md border border-zinc-300 px-3 py-2"
                  placeholder="Answer"
                />
                <button
                  onClick={() => removeFaq(index)}
                  className="mt-2 rounded-md border border-red-300 px-3 py-1 text-sm text-red-700"
                >
                  Remove FAQ
                </button>
              </div>
            ))}
            <button
              onClick={addFaq}
              className="rounded-md border border-zinc-300 px-3 py-1 text-sm"
            >
              Add FAQ
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Sponsors Content</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={content.sponsors.eyebrow}
              onChange={(e) => updateSponsorField("eyebrow", e.target.value)}
              className="rounded-md border border-zinc-300 px-3 py-2"
              placeholder="Eyebrow"
            />
            <input
              value={content.sponsors.headingPrefix}
              onChange={(e) => updateSponsorField("headingPrefix", e.target.value)}
              className="rounded-md border border-zinc-300 px-3 py-2"
              placeholder="Heading Prefix"
            />
            <input
              value={content.sponsors.headingEmphasis}
              onChange={(e) => updateSponsorField("headingEmphasis", e.target.value)}
              className="rounded-md border border-zinc-300 px-3 py-2"
              placeholder="Heading Emphasis"
            />
            <input
              value={content.sponsors.ctaText}
              onChange={(e) => updateSponsorField("ctaText", e.target.value)}
              className="rounded-md border border-zinc-300 px-3 py-2"
              placeholder="CTA Text"
            />
            <input
              value={content.sponsors.ctaUrl}
              onChange={(e) => updateSponsorField("ctaUrl", e.target.value)}
              className="rounded-md border border-zinc-300 px-3 py-2 md:col-span-2"
              placeholder="CTA URL"
            />
            <textarea
              value={content.sponsors.subtext}
              onChange={(e) => updateSponsorField("subtext", e.target.value)}
              className="min-h-24 rounded-md border border-zinc-300 px-3 py-2 md:col-span-2"
              placeholder="Sponsors section subtext"
            />
            <textarea
              value={content.sponsors.row1.join("\n")}
              onChange={(e) => updateSponsorList("row1", e.target.value)}
              className="min-h-24 rounded-md border border-zinc-300 px-3 py-2"
              placeholder="Row 1 sponsors (one per line)"
            />
            <textarea
              value={content.sponsors.row2.join("\n")}
              onChange={(e) => updateSponsorList("row2", e.target.value)}
              className="min-h-24 rounded-md border border-zinc-300 px-3 py-2"
              placeholder="Row 2 sponsors (one per line)"
            />
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Rules Page Content</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={content.rules.pageTitle}
              onChange={(e) => updateRulesField("pageTitle", e.target.value)}
              className="rounded-md border border-zinc-300 px-3 py-2"
              placeholder="Page Title"
            />
            <input
              value={content.rules.sectionTitle}
              onChange={(e) => updateRulesField("sectionTitle", e.target.value)}
              className="rounded-md border border-zinc-300 px-3 py-2"
              placeholder="Section Title"
            />
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-zinc-700">Event Rulebooks State</span>
              <select
                value={content.rules.eventRulebooksState}
                onChange={(e) =>
                  updateRulesField(
                    "eventRulebooksState",
                    e.target.value as CmsContent["rules"]["eventRulebooksState"],
                  )
                }
                className="rounded-md border border-zinc-300 px-3 py-2"
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
              className="rounded-md border border-zinc-300 px-3 py-2"
              placeholder="Accommodation Title"
            />
            <input
              value={content.rules.registerUrl}
              onChange={(e) => updateRulesField("registerUrl", e.target.value)}
              className="rounded-md border border-zinc-300 px-3 py-2"
              placeholder="Rules Register URL"
            />
            <textarea
              value={content.rules.accommodationParagraphs.join("\n")}
              onChange={(e) =>
                updateRulesList("accommodationParagraphs", e.target.value)
              }
              className="min-h-24 rounded-md border border-zinc-300 px-3 py-2 md:col-span-2"
              placeholder="Accommodation paragraphs (one per line)"
            />
            <textarea
              value={content.rules.accommodationBullets.join("\n")}
              onChange={(e) =>
                updateRulesList("accommodationBullets", e.target.value)
              }
              className="min-h-24 rounded-md border border-zinc-300 px-3 py-2 md:col-span-2"
              placeholder="Accommodation bullets (one per line)"
            />
          </div>

          <div className="mt-4 space-y-3">
            <h3 className="text-lg font-semibold">General Rule Cards</h3>
            {content.rules.generalRules.map((rule, index) => (
              <div key={index} className="rounded-lg border border-zinc-200 p-3">
                <input
                  value={rule.title}
                  onChange={(e) =>
                    updateGeneralRule(index, "title", e.target.value)
                  }
                  className="mb-2 w-full rounded-md border border-zinc-300 px-3 py-2"
                  placeholder="Rule title"
                />
                <textarea
                  value={rule.content}
                  onChange={(e) =>
                    updateGeneralRule(index, "content", e.target.value)
                  }
                  className="min-h-20 w-full rounded-md border border-zinc-300 px-3 py-2"
                  placeholder="Rule content"
                />
                <button
                  onClick={() => removeGeneralRule(index)}
                  className="mt-2 rounded-md border border-red-300 px-3 py-1 text-sm text-red-700"
                >
                  Remove Rule
                </button>
              </div>
            ))}
            <button
              onClick={addGeneralRule}
              className="rounded-md border border-zinc-300 px-3 py-1 text-sm"
            >
              Add Rule
            </button>
          </div>
        </section>

        {content.events.map((eventItem, index) => (
          <section
            key={`${eventItem.number}-${index}`}
            className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <h2 className="mb-4 text-xl font-semibold">
              Event {eventItem.number}: {eventItem.title}
            </h2>

            <div className="grid gap-3 md:grid-cols-2">
              {FIELDS.map((field) => (
                <label key={field.key} className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-zinc-700">{field.label}</span>
                  {field.key === "description" ? (
                    <textarea
                      value={eventItem[field.key] ?? ""}
                      onChange={(e) =>
                        handleFieldChange(index, field.key, e.target.value)
                      }
                      className="min-h-24 rounded-md border border-zinc-300 px-3 py-2"
                    />
                  ) : (
                    <input
                      value={eventItem[field.key] ?? ""}
                      onChange={(e) =>
                        handleFieldChange(index, field.key, e.target.value)
                      }
                      className="rounded-md border border-zinc-300 px-3 py-2"
                    />
                  )}
                </label>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Current JSON Preview</h2>
        <textarea
          readOnly
          value={JSON.stringify(content, null, 2)}
          className="mt-3 min-h-65 w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 font-mono text-xs"
        />
      </section>
    </main>
  );
}
