"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { DEFAULT_CMS_CONTENT, type TopNotification } from "@/lib/cmsContent";

const CSS_VAR = "--top-notification-offset";
const DISMISS_STORAGE_KEY = "robofest.topNotification.dismissed";
const CMS_KEY_STORAGE = "robofest.cms.key";

function setCssOffset(px: number) {
  const value = `${Math.max(0, Math.round(px))}px`;
  document.documentElement.style.setProperty(CSS_VAR, value);
}

export default function TopNotificationBar() {
  const [notification, setNotification] = useState<TopNotification>(
    DEFAULT_CMS_CONTENT.topNotification,
  );
  const [dismissedSignature, setDismissedSignature] = useState(() => {
    if (typeof window === "undefined") return "";
    try {
      return window.sessionStorage.getItem(DISMISS_STORAGE_KEY) ?? "";
    } catch {
      return "";
    }
  });
  const ref = useRef<HTMLDivElement | null>(null);

  const signature = useMemo(() => {
    const message = notification.message.trim();
    const linkUrl = notification.linkUrl.trim();
    const linkLabel = notification.linkLabel.trim();
    return [message, linkUrl, linkLabel].join("|");
  }, [notification.message, notification.linkLabel, notification.linkUrl]);

  const isDismissed = useMemo(() => {
    return Boolean(signature && dismissedSignature === signature);
  }, [dismissedSignature, signature]);

  const isVisible = useMemo(() => {
    return Boolean(
      !isDismissed && notification.enabled && notification.message.trim(),
    );
  }, [isDismissed, notification.enabled, notification.message]);

  useEffect(() => {
    let isMounted = true;

    const loadNotification = async () => {
      try {
        const response = await fetch("/api/cms", { cache: "no-store" });
        if (!response.ok) return;
        const payload = await response.json().catch(() => null);
        const next = payload?.content?.topNotification;
        if (!isMounted || !next) return;

        setNotification((prev) => ({
          ...prev,
          ...next,
        }));

        if (next?.enabled === false) {
          try {
            window.sessionStorage.removeItem(DISMISS_STORAGE_KEY);
          } catch {
            // Ignore storage access errors.
          }
          setDismissedSignature("");
        }
      } catch {
        // Keep defaults when API is unavailable.
      }
    };

    loadNotification();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isVisible) {
      setCssOffset(0);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const update = () => setCssOffset(el.offsetHeight);
    update();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }

    const observer = new ResizeObserver(() => update());
    observer.observe(el);
    return () => observer.disconnect();
  }, [
    isVisible,
    notification.message,
    notification.linkLabel,
    notification.linkUrl,
  ]);

  if (!isVisible) {
    return null;
  }

  const linkUrl = notification.linkUrl.trim();
  const linkLabel = notification.linkLabel.trim();
  const hasLink = Boolean(linkUrl && linkLabel);

  const dismiss = () => {
    setNotification((prev) => ({ ...prev, enabled: false }));

    if (!signature) {
      return;
    }

    // Hide immediately for this session.
    setDismissedSignature(signature);
    try {
      window.sessionStorage.setItem(DISMISS_STORAGE_KEY, signature);
    } catch {
      // Ignore storage access errors.
    }

    // Also disable the bar globally in CMS if an admin session is present.
    // This avoids exposing an unauthenticated public-write endpoint.
    try {
      const cmsKey = window.sessionStorage.getItem(CMS_KEY_STORAGE) ?? "";
      if (!cmsKey.trim()) {
        return;
      }

      void (async () => {
        const readResponse = await fetch("/api/cms", {
          cache: "no-store",
          headers: { "x-cms-key": cmsKey },
        });

        const readPayload = await readResponse.json().catch(() => null);
        const current = readPayload?.content;
        if (!readResponse.ok || !current) {
          return;
        }

        await fetch("/api/cms", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-cms-key": cmsKey,
          },
          body: JSON.stringify({
            content: {
              ...current,
              topNotification: {
                ...(current.topNotification ?? {}),
                enabled: false,
              },
            },
          }),
        });
      })();
    } catch {
      // Ignore storage/fetch errors.
    }
  };

  return (
    <div
      ref={ref}
      className="sticky top-0 z-50 w-full border-b border-blue-700/50 bg-blue-600"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-3 text-xs text-white md:px-8 md:py-3 md:text-sm">
        <div />

        <div className="flex min-w-0 items-center justify-center gap-2">
          <span className="min-w-0 text-center font-medium leading-snug tracking-wide text-white">
            {notification.message}
          </span>
          {hasLink ? (
            <Link
              href={linkUrl}
              className="shrink-0 whitespace-nowrap rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white/20"
            >
              {linkLabel}
            </Link>
          ) : null}
        </div>

        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss notification"
            className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/15 p-1.5 text-base font-semibold leading-none text-white transition hover:bg-white/20"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
