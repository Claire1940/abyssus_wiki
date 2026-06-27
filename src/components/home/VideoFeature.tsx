"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Play, Volume2 } from "lucide-react";

interface VideoFeatureProps {
  videoId: string;
  title: string;
}

type PlayState = "idle" | "auto" | "manual";

/**
 * VideoFeature
 *
 * 3-state autoplay:
 *  - idle:    static thumbnail + play overlay (cheap, no iframe until needed)
 *  - auto:    viewport detected (IntersectionObserver, threshold 0.5) ->
 *             muted + looped autoplay iframe (respects prefers-reduced-motion)
 *  - manual:  user clicked play -> unmuted autoplay iframe
 *
 * Once the user clicks, it stays in manual (sound on).
 */
export function VideoFeature({ videoId, title }: VideoFeatureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [playState, setPlayState] = useState<PlayState>("idle");

  const watchUrl = useMemo(
    () => `https://www.youtube.com/watch?v=${videoId}`,
    [videoId],
  );

  const thumbnailUrl = useMemo(
    () => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    [videoId],
  );

  const embedUrl = useMemo(() => {
    if (playState === "manual") {
      // sound on, single play
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&playsinline=1&rel=0`;
    }
    // auto: muted + looped
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&rel=0`;
  }, [videoId, playState]);

  // Auto-play when scrolled into view (skip if user prefers reduced motion)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return; // stay idle, wait for manual click

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setPlayState((prev) => (prev === "idle" ? "auto" : prev));
          }
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleManualPlay = () => setPlayState("manual");

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg bg-black"
        style={{ paddingBottom: "56.25%" }}
      >
        {playState === "idle" ? (
          // idle: thumbnail + play overlay (clickable)
          <button
            type="button"
            onClick={handleManualPlay}
            aria-label={`Play ${title}`}
            className="group absolute inset-0 h-full w-full"
          >
            <img
              src={thumbnailUrl}
              alt={title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/20" />
            <span
              className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full
                         bg-[hsl(var(--nav-theme))] text-white shadow-lg
                         transition-transform group-hover:scale-110"
            >
              <Play className="h-7 w-7 translate-x-0.5 fill-current" />
            </span>
            <span
              className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-md bg-black/60 px-2.5 py-1 text-xs text-white"
            >
              <Volume2 className="h-3.5 w-3.5" />
              Tap to unmute
            </span>
          </button>
        ) : (
          // auto / manual: live iframe
          <iframe
            key={playState}
            className="absolute top-0 left-0 h-full w-full"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        )}
      </div>

      <div className="flex justify-center">
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
        >
          Watch on YouTube
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
