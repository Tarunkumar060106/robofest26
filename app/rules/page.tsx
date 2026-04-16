"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import { ArrowRight } from "lucide-react";
import { DEFAULT_CMS_CONTENT, type RulesContent } from "@/lib/cmsContent";

export default function RulesPage() {
  const [rules, setRules] = useState<RulesContent>(DEFAULT_CMS_CONTENT.rules);

  useEffect(() => {
    let isMounted = true;

    const loadRules = async () => {
      try {
        const response = await fetch("/api/cms", { cache: "no-store" });
        if (!response.ok) return;
        const payload = await response.json();
        if (isMounted && payload?.content?.rules) {
          setRules(payload.content.rules as RulesContent);
        }
      } catch {
        // Keep defaults when API is unavailable.
      }
    };

    loadRules();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 pb-16 pt-28 md:px-8">
        <h1 className="mb-10 text-center text-4xl font-bold md:text-6xl">
          {rules.pageTitle}
        </h1>

        <section className="mb-12 rounded-2xl border border-zinc-200 bg-zinc-900 p-6 text-white shadow-xl md:p-8">
          <h2 className="mb-5 text-center text-3xl font-bold text-sky-400">
            {rules.accommodationTitle}
          </h2>

          <div className="space-y-4 text-justify leading-relaxed text-zinc-100">
            {rules.accommodationParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <ul className="mt-6 list-inside list-disc space-y-3 text-zinc-100/95">
            {rules.accommodationBullets.map((bullet, index) => (
              <li key={index}>{bullet}</li>
            ))}
          </ul>

          <a
            href={rules.registerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Register Now
            <ArrowRight size={18} />
          </a>
        </section>

        <section className="mb-8">
          <h2 className="mb-5 text-center text-3xl font-bold text-zinc-900">
            {rules.sectionTitle}
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {rules.generalRules.map((rule, index) => (
              <article
                key={`${rule.title}-${index}`}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <h3 className="mb-2 text-xl font-semibold text-zinc-900">
                  {rule.title}
                </h3>
                <p className="leading-relaxed text-zinc-700">{rule.content}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
