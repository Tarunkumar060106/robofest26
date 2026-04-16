"use client";

import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Code2,
  Zap,
  BadgeIndianRupee,
  MapPinCheckInside,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import Link from "next/link";

export interface CardFlipProps {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  features?: string[];
  prize_pool?: string;
  entry_fee?: string;
  venue?: string;
  team_size?: string;
  icon?: React.ReactNode;
  pdfUrl?: string;
}

export default function CardFlip({
  children,
  title = "",
  description = "",
  prize_pool,
  entry_fee,
  venue,
  team_size,
  icon,
  pdfUrl,
}: CardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const extraInfo = [
    prize_pool && `Prize Pool: ${prize_pool}`,
    entry_fee && `Entry Fee: ${entry_fee}`,
    venue && `Venue: ${venue}`,
    team_size && `Team Size: ${team_size}`,
  ].filter(Boolean) as string[];

  return (
    <div
      className="group relative h-[360px] w-full max-w-[300px] [perspective:2000px]"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={150}
        inactiveZone={0.01}
        borderWidth={4}
        className="rounded-3xl"
      />
      <div
        className={cn(
          "relative h-full w-full",
          "[transform-style:preserve-3d]",
          "transition-all duration-700",
          isFlipped
            ? "[transform:rotateY(180deg)]"
            : "[transform:rotateY(0deg)]",
        )}
      >
        {/* Front of card */}

        <div
          className={cn(
            "absolute inset-0 h-full w-full",
            "[transform:rotateY(0deg)] [backface-visibility:hidden]",
            "overflow-hidden rounded-2xl",
            "bg-gradient-to-br from-white via-slate-50 to-slate-100",
            "dark:from-zinc-900 dark:via-zinc-900/95 dark:to-zinc-800",
            "border border-slate-200 dark:border-zinc-800/50",
            "shadow-lg dark:shadow-xl",
            "transition-all duration-700",
            "group-hover:shadow-xl dark:group-hover:shadow-2xl",
            "group-hover:border-primary/20 dark:group-hover:border-primary/30",
            isFlipped ? "opacity-0" : "opacity-100",
          )}
        >
          {/* Background gradient effect */}
          <div className="from-primary/5 dark:from-primary/10 absolute inset-0 bg-gradient-to-br via-transparent to-blue-500/5 dark:to-blue-500/10" />

          {/* Animated code blocks */}
          {/* Custom children (e.g., image or custom content) */}
          <div className="absolute inset-0 flex items-center justify-center pt-20">
            <div className="absolute inset-0 flex items-center justify-center pt-20">
              <div className="relative flex h-[100px] w-[200px] flex-col items-center justify-center gap-2">
                {/* Code blocks animation */}
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-3 w-full rounded-sm",
                      "from-primary/20 via-primary/30 to-primary/20 bg-gradient-to-r",
                      "animate-[slideIn_2s_ease-in-out_infinite]",
                      "opacity-0",
                    )}
                    style={{
                      width: `${60 + Math.random() * 40}%`,
                      animationDelay: `${i * 0.2}s`,
                      marginLeft: `${Math.random() * 20}%`,
                    }}
                  />
                ))}
                {/* Central rocket icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {children}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom content */}
          <div className="absolute right-0 bottom-0 left-0 p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1.5">
                <h3 className="text-lg leading-snug font-semibold tracking-tight text-zinc-900 transition-all duration-500 ease-out group-hover:translate-y-[-4px] dark:text-white">
                  {title}
                </h3>
              </div>
              <div className="group/icon relative">
                <div
                  className={cn(
                    "absolute inset-[-8px] rounded-lg transition-opacity duration-300",
                    "from-primary/20 via-primary/10 bg-gradient-to-br to-transparent",
                    "opacity-0 group-hover/icon:opacity-100",
                  )}
                />
                <Zap className="text-primary relative z-10 h-5 w-5 transition-all duration-300 group-hover/icon:scale-110 group-hover/icon:rotate-12" />
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className={cn(
            "absolute inset-0 h-full w-full",
            "[transform:rotateY(180deg)] [backface-visibility:hidden]",
            "rounded-2xl p-5",
            "bg-gradient-to-br from-white via-slate-50 to-slate-100",
            "dark:from-zinc-900 dark:via-zinc-900/95 dark:to-zinc-800",
            "border border-slate-200 dark:border-zinc-800",
            "shadow-lg dark:shadow-xl",
            "flex flex-col",
            "transition-all duration-700",
            "group-hover:shadow-xl dark:group-hover:shadow-2xl",
            "group-hover:border-primary/20 dark:group-hover:border-primary/30",
            !isFlipped ? "opacity-0" : "opacity-100",
          )}
        >
          {/* Background gradient */}
          <div className="from-primary/5 dark:from-primary/10 absolute inset-0 rounded-2xl bg-gradient-to-br via-transparent to-blue-500/5 dark:to-blue-500/10" />

          <div className="relative z-10 flex-1 space-y-5">
            <div className="space-y-2">
              <div className="mb-2 flex items-center gap-2">
                <div className="from-primary via-primary/90 to-primary/80 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br">
                  <Code2 className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg leading-snug font-semibold tracking-tight text-zinc-900 transition-all duration-500 ease-out group-hover:translate-y-[-2px] dark:text-white">
                  {title}
                </h3>
              </div>
              <p className="line-clamp-2 text-sm tracking-tight text-zinc-600 transition-all duration-500 ease-out group-hover:translate-y-[-2px] dark:text-zinc-400">
                {description}
              </p>
            </div>

            <div className="space-y-2.5">
              {extraInfo.map((info, idx) => {
                const icons = [
                  BadgeIndianRupee,
                  Code2,
                  MapPinCheckInside,
                  UsersRound,
                ];
                const IconComponent = icons[idx % icons.length];

                return (
                  <div
                    key={info}
                    className="flex items-center gap-3 text-sm text-zinc-700 transition-all duration-500 dark:text-zinc-300"
                    style={{
                      transform: isFlipped
                        ? "translateX(0)"
                        : "translateX(-10px)",
                      opacity: isFlipped ? 1 : 0,
                      transitionDelay: `${idx * 100 + 200}ms`,
                    }}
                  >
                    <div className="bg-primary/10 dark:bg-primary/20 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md">
                      <IconComponent className="text-primary h-3 w-3" />
                    </div>
                    <span className="font-medium">{info}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col relative z-10 mt-auto border-t border-slate-200 pt-4 space-y-2 dark:border-zinc-800">
            <Link href="https://registration.isdlabsrm.in/" passHref>
              <div
                className={cn(
                  "group/start relative",
                  "flex items-center justify-between",
                  "rounded-lg p-2.5",
                  "transition-all duration-300",
                  "bg-gradient-to-r from-slate-100 via-slate-100 to-slate-100",
                  "dark:from-zinc-800 dark:via-zinc-800 dark:to-zinc-800",
                  "hover:from-primary/10 hover:via-primary/5 hover:to-transparent",
                  "dark:hover:from-primary/20 dark:hover:via-primary/10 dark:hover:to-transparent",
                  "hover:scale-[1.02] hover:cursor-pointer",
                  "hover:border-primary/20 border border-transparent",
                )}
              >
                <span className="group-hover/start:text-primary text-sm font-semibold text-zinc-900 transition-colors duration-300 dark:text-white">
                  Register Now!
                </span>
                <div className="group/icon relative">
                  <div
                    className={cn(
                      "absolute inset-[-6px] rounded-lg transition-all duration-300",
                      "from-primary/20 via-primary/10 bg-gradient-to-br to-transparent",
                      "scale-90 opacity-0 group-hover/start:scale-100 group-hover/start:opacity-100",
                    )}
                  />
                  <ArrowRight className="text-primary relative z-10 h-4 w-4 transition-all duration-300 group-hover/start:translate-x-1 group-hover/start:scale-110" />
                </div>
              </div>
            </Link>
            {/* Info Button */}
            {pdfUrl && (
              <button
                onClick={() => window.open(pdfUrl, "_blank")}
                className={cn(
                  "group/info relative w-full",
                  "flex items-center justify-between",
                  "rounded-lg p-2.5",
                  "transition-all duration-300",
                  "bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50",
                  "dark:from-zinc-800 dark:via-zinc-800 dark:to-zinc-800",
                  "hover:from-blue-200/20 hover:via-blue-100/10 hover:to-transparent",
                  "dark:hover:from-blue-500/20 dark:hover:via-blue-500/10 dark:hover:to-transparent",
                  "hover:scale-[1.02] hover:cursor-pointer",
                  "hover:border-blue-300/30 border border-transparent",
                )}
              >
                <span className="group-hover/info:text-blue-500 text-sm font-semibold text-zinc-900 transition-colors duration-300 dark:text-white">
                  Info
                </span>
                <div className="group/icon relative">
                  <div
                    className={cn(
                      "absolute inset-[-6px] rounded-lg transition-all duration-300",
                      "from-blue-400/20 via-blue-400/10 bg-gradient-to-br to-transparent",
                      "scale-90 opacity-0 group-hover/info:scale-100 group-hover/info:opacity-100",
                    )}
                  />
                  <ArrowRight className="text-primary relative z-10 h-4 w-4 transition-all duration-300 group-hover/start:translate-x-1 group-hover/start:scale-110" />
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          0% {
            transform: translateX(-100px);
            opacity: 0;
          }
          50% {
            transform: translateX(0);
            opacity: 0.8;
          }
          100% {
            transform: translateX(100px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
