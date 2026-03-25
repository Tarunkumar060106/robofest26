import { cn } from "@/lib/utils";

type BubbleBackgroundProps = {
  className?: string;
  quantity?: number;
};

const getBubbleSpec = (index: number) => {
  const seed = index + 1;

  return {
    size: 26 + ((seed * 17) % 74),
    left: (seed * 13) % 100,
    duration: 10 + ((seed * 19) % 16),
    delay: ((seed * 7) % 15) * -0.9,
    drift: ((seed * 5) % 33) - 16,
    opacity: 0.14 + ((seed * 11) % 8) / 100,
  };
};

export default function BubbleBackground({
  className,
  quantity = 18,
}: BubbleBackgroundProps) {
  return (
    <div className={cn("bubble-background", className)} aria-hidden="true">
      {Array.from({ length: quantity }, (_, index) => {
        const bubble = getBubbleSpec(index);

        return (
          <span
            key={`bubble-${index}`}
            className="bubble-background__bubble"
            style={
              {
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                left: `${bubble.left}%`,
                opacity: bubble.opacity,
                animationDuration: `${bubble.duration}s`,
                animationDelay: `${bubble.delay}s`,
                "--bubble-drift": `${bubble.drift}px`,
              } as React.CSSProperties
            }
          />
        );
      })}
      <span className="bubble-background__glow" />
      <span className="bubble-background__grid" />
    </div>
  );
}
