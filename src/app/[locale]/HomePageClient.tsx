"use client";

import { Suspense, lazy, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CalendarClock,
  Check,
  ChevronDown,
  ExternalLink,
  Flame,
  Gem,
  Hammer,
  Network,
  Package,
  Skull,
  Sparkles,
  Star,
  Swords,
  Users,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// Module header icons (one per module, all distinct)
const MODULE_ICONS: Record<string, LucideIcon> = {
  abyssusReleaseDatePlatformsAndGamePass: CalendarClock,
  abyssusReviewScoresAndPlayerRatings: Star,
  abyssusBeginnerGuide: BookOpen,
  abyssusWeaponsTierListAndBestBuilds: Swords,
  abyssusBlessingsCharmsAndForgeMods: Gem,
  abyssusBossesEnemiesAndLevelProgression: Skull,
  abyssusCoOpCrossplayAndMatchmaking: Users,
  abyssusUpdatesPatchNotesAndDlc: Package,
};

// Module 5 inner card icons (distinct, mapped by JSON icon key)
const CARD_ICONS: Record<string, LucideIcon> = {
  Flame,
  Sparkles,
  Hammer,
  Network,
  Workflow,
};

// Tools Grid navigation targets (anchor <-> section 1:1)
const TOOL_SECTION_IDS = [
  "release-date-platforms-game-pass",
  "review-scores-player-ratings",
  "beginner-guide",
  "weapons-tier-list-best-builds",
  "blessings-charms-ancient-forge-mods",
  "bosses-enemies-level-progression",
  "co-op-crossplay-matchmaking",
  "updates-patch-notes-dlc",
];

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.abyssus.wiki";
  const mobileBannerAd = getPreferredMobileBannerSelection();

  // Accordion open state for module 6 (bosses/enemies FAQ)
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Abyssus Wiki",
        description:
          "Complete Abyssus Wiki covering builds, weapons, mods, blessings, charms, bosses, co-op, achievements, and release info for the brinepunk co-op roguelite FPS on Steam, PS5, and Xbox.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Abyssus - Brinepunk Co-op Roguelite FPS",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Abyssus Wiki",
        alternateName: "Abyssus",
        url: siteUrl,
        description:
          "Complete Abyssus Wiki resource hub for builds, weapons, mods, blessings, charms, bosses, co-op, and achievements guides",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Abyssus Wiki - Brinepunk Co-op Roguelite FPS",
        },
        sameAs: [
          "https://www.thearcadecrew.com/",
          "https://store.steampowered.com/app/1721110/Abyssus/",
          "https://discord.gg/bvw5RPVPjp",
          "https://x.com/PlayAbyssus",
          "https://www.youtube.com/@TheArcadeCrew",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Abyssus",
        gamePlatform: ["PC", "Steam", "PlayStation 5", "Xbox Series X|S"],
        applicationCategory: "Game",
        genre: ["FPS", "Roguelite", "Co-op", "Action"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 4,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://store.steampowered.com/app/1721110/Abyssus/",
        },
      },
      {
        "@type": "VideoObject",
        name: "Abyssus | Launch Trailer",
        description:
          "Official Abyssus launch trailer from The Arcade Crew, showcasing the brinepunk co-op roguelite FPS gameplay.",
        uploadDate: "2025-08-12",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/_YeAjcv3GOg",
        url: "https://www.youtube.com/watch?v=_YeAjcv3GOg",
      },
    ],
  };

  // tier badge style (nav-theme based, no hardcoded colors)
  const tierBadgeClass = (tier: string) => {
    if (tier === "S") {
      return "bg-[hsl(var(--nav-theme))] text-white border-transparent";
    }
    if (tier === "A") {
      return "bg-[hsl(var(--nav-theme)/0.25)] text-[hsl(var(--nav-theme-light))] border-[hsl(var(--nav-theme)/0.4)]";
    }
    return "bg-[hsl(var(--nav-theme)/0.1)] text-[hsl(var(--nav-theme-light))] border-[hsl(var(--nav-theme)/0.3)]";
  };

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Ad slot 1: sticky top banner */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("beginner-guide")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://store.steampowered.com/app/1721110/Abyssus/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="_YeAjcv3GOg"
              title="Abyssus | Launch Trailer"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 4 Navigation Cards (module nav, scrolls to sections) */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = TOOL_SECTION_IDS[index];
              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* Ad slot 2: native banner after first screen */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* Ad slot 3: mobile square / desktop banner */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Abyssus Release Date, Platforms, Price, and Game Pass (info-cards) */}
      <section id="release-date-platforms-game-pass" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4 text-[hsl(var(--nav-theme-light))]">
              {(() => {
                const Icon = MODULE_ICONS.abyssusReleaseDatePlatformsAndGamePass;
                return <Icon className="w-5 h-5" />;
              })()}
              <span className="text-xs md:text-sm font-semibold uppercase tracking-wider">
                {t.modules.abyssusReleaseDatePlatformsAndGamePass.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.abyssusReleaseDatePlatformsAndGamePass.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-3 md:mb-4">
              {t.modules.abyssusReleaseDatePlatformsAndGamePass.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.abyssusReleaseDatePlatformsAndGamePass.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {t.modules.abyssusReleaseDatePlatformsAndGamePass.items.map(
              (item: any, index: number) => (
                <div
                  key={index}
                  className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col"
                >
                  <span className="text-xs md:text-sm font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))] mb-2">
                    {item.label}
                  </span>
                  <span className="text-lg md:text-xl font-bold mb-3">
                    {item.value}
                  </span>
                  {Array.isArray(item.platforms) && item.platforms.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {item.platforms.map((p: string, i: number) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2 py-0.5 rounded-md bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mb-3 flex-grow">
                    {item.details}
                  </p>
                  <p className="text-xs md:text-sm font-medium border-t border-border pt-3">
                    {item.price}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Ad slot 4: between modules */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Abyssus Review Scores and Player Ratings (rating-cards) */}
      <section id="review-scores-player-ratings" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4 text-[hsl(var(--nav-theme-light))]">
              {(() => {
                const Icon = MODULE_ICONS.abyssusReviewScoresAndPlayerRatings;
                return <Icon className="w-5 h-5" />;
              })()}
              <span className="text-xs md:text-sm font-semibold uppercase tracking-wider">
                {t.modules.abyssusReviewScoresAndPlayerRatings.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.abyssusReviewScoresAndPlayerRatings.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-3 md:mb-4">
              {t.modules.abyssusReviewScoresAndPlayerRatings.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.abyssusReviewScoresAndPlayerRatings.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {t.modules.abyssusReviewScoresAndPlayerRatings.items.map(
              (item: any, index: number) => (
                <div
                  key={index}
                  className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                    <span className="font-bold text-base md:text-lg">
                      {item.source}
                    </span>
                  </div>
                  <span className="text-xl md:text-2xl font-bold text-[hsl(var(--nav-theme-light))] mb-2">
                    {item.score}
                  </span>
                  <span className="text-xs text-muted-foreground mb-3">
                    {item.sample}
                  </span>
                  <p className="text-sm text-muted-foreground mb-3 flex-grow">
                    {item.details}
                  </p>
                  <p className="text-xs md:text-sm font-medium border-t border-border pt-3">
                    <span className="text-[hsl(var(--nav-theme-light))]">Best for: </span>
                    {item.bestFor}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 3: Abyssus Beginner Guide (step-by-step) */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4 text-[hsl(var(--nav-theme-light))]">
              {(() => {
                const Icon = MODULE_ICONS.abyssusBeginnerGuide;
                return <Icon className="w-5 h-5" />;
              })()}
              <span className="text-xs md:text-sm font-semibold uppercase tracking-wider">
                {t.modules.abyssusBeginnerGuide.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.abyssusBeginnerGuide.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-3 md:mb-4">
              {t.modules.abyssusBeginnerGuide.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.abyssusBeginnerGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.abyssusBeginnerGuide.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {step.step}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground mb-2 md:mb-3">
                      {step.description}
                    </p>
                    {step.beginnerTip && (
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.2)]">
                        <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          <span className="font-semibold text-[hsl(var(--nav-theme-light))]">Tip: </span>
                          {step.beginnerTip}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Ad slot 5: between modules */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 4: Abyssus Weapons Tier List and Best Builds (tier-grid) */}
      <section id="weapons-tier-list-best-builds" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4 text-[hsl(var(--nav-theme-light))]">
              {(() => {
                const Icon = MODULE_ICONS.abyssusWeaponsTierListAndBestBuilds;
                return <Icon className="w-5 h-5" />;
              })()}
              <span className="text-xs md:text-sm font-semibold uppercase tracking-wider">
                {t.modules.abyssusWeaponsTierListAndBestBuilds.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.abyssusWeaponsTierListAndBestBuilds.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-3 md:mb-4">
              {t.modules.abyssusWeaponsTierListAndBestBuilds.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.abyssusWeaponsTierListAndBestBuilds.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-6 md:space-y-8">
            {t.modules.abyssusWeaponsTierListAndBestBuilds.tiers.map(
              (tierRow: any, tIndex: number) => (
                <div key={tIndex}>
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border font-bold text-base ${tierBadgeClass(
                        tierRow.tier,
                      )}`}
                    >
                      {tierRow.tier}
                    </span>
                    <h3 className="text-lg md:text-xl font-bold">
                      {tierRow.tierLabel}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tierRow.weapons.map((w: any, wIndex: number) => (
                      <div
                        key={wIndex}
                        className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Swords className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                          <h4 className="font-bold text-base md:text-lg">
                            {w.name}
                          </h4>
                        </div>
                        <p className="text-xs md:text-sm font-medium text-[hsl(var(--nav-theme-light))] mb-2">
                          {w.role}
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          {w.bestBuild}
                        </p>
                        <p className="text-xs text-muted-foreground border-t border-border pt-2">
                          {w.whyUseIt}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 5: Abyssus Blessings, Charms and Ancient Forge Mods (card-list) */}
      <section id="blessings-charms-ancient-forge-mods" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4 text-[hsl(var(--nav-theme-light))]">
              {(() => {
                const Icon = MODULE_ICONS.abyssusBlessingsCharmsAndForgeMods;
                return <Icon className="w-5 h-5" />;
              })()}
              <span className="text-xs md:text-sm font-semibold uppercase tracking-wider">
                {t.modules.abyssusBlessingsCharmsAndForgeMods.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.abyssusBlessingsCharmsAndForgeMods.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-3 md:mb-4">
              {t.modules.abyssusBlessingsCharmsAndForgeMods.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.abyssusBlessingsCharmsAndForgeMods.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.abyssusBlessingsCharmsAndForgeMods.items.map(
              (item: any, index: number) => {
                const Icon = CARD_ICONS[item.icon] ?? Sparkles;
                return (
                  <div
                    key={index}
                    className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center">
                        <Icon className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold">{item.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.3)] text-xs font-medium">
                        {item.type}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.25)] text-xs">
                        {item.value}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 flex-grow">
                      {item.description}
                    </p>
                    <p className="text-xs md:text-sm font-medium border-t border-border pt-3 mb-3">
                      <span className="text-[hsl(var(--nav-theme-light))]">Best for: </span>
                      {item.bestFor}
                    </p>
                    {Array.isArray(item.examples) && item.examples.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {item.examples.map((ex: string, i: number) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/5 border border-border text-xs text-muted-foreground"
                          >
                            {ex}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* Ad slot 6: between modules */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 6: Abyssus Bosses, Enemies and Level Progression (accordion) */}
      <section id="bosses-enemies-level-progression" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4 text-[hsl(var(--nav-theme-light))]">
              {(() => {
                const Icon = MODULE_ICONS.abyssusBossesEnemiesAndLevelProgression;
                return <Icon className="w-5 h-5" />;
              })()}
              <span className="text-xs md:text-sm font-semibold uppercase tracking-wider">
                {t.modules.abyssusBossesEnemiesAndLevelProgression.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.abyssusBossesEnemiesAndLevelProgression.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-3 md:mb-4">
              {t.modules.abyssusBossesEnemiesAndLevelProgression.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.abyssusBossesEnemiesAndLevelProgression.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3 max-w-3xl mx-auto">
            {t.modules.abyssusBossesEnemiesAndLevelProgression.items.map(
              (item: any, index: number) => {
                const isOpen = openAccordion === index;
                return (
                  <div
                    key={index}
                    className="bg-white/5 border border-border rounded-xl overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenAccordion(isOpen ? null : index)}
                      className="w-full flex items-center justify-between gap-4 p-4 md:p-5 text-left hover:bg-white/5 transition-colors"
                    >
                      <span className="font-semibold text-base md:text-lg">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 flex-shrink-0 text-[hsl(var(--nav-theme-light))] transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 md:px-5 pb-4 md:pb-5">
                        <p className="text-sm md:text-base text-muted-foreground mb-3">
                          {item.answer}
                        </p>
                        {Array.isArray(item.highlights) && item.highlights.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {item.highlights.map((h: string, i: number) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs"
                              >
                                <Check className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
                                {h}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* Ad slot 7: between modules */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 7: Abyssus Co-Op, Crossplay and Matchmaking (comparison-table) */}
      <section id="co-op-crossplay-matchmaking" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4 text-[hsl(var(--nav-theme-light))]">
              {(() => {
                const Icon = MODULE_ICONS.abyssusCoOpCrossplayAndMatchmaking;
                return <Icon className="w-5 h-5" />;
              })()}
              <span className="text-xs md:text-sm font-semibold uppercase tracking-wider">
                {t.modules.abyssusCoOpCrossplayAndMatchmaking.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.abyssusCoOpCrossplayAndMatchmaking.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-3 md:mb-4">
              {t.modules.abyssusCoOpCrossplayAndMatchmaking.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.abyssusCoOpCrossplayAndMatchmaking.intro}
            </p>
          </div>

          <div className="scroll-reveal">
            {/* Desktop table */}
            <div className="hidden md:block overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-[hsl(var(--nav-theme)/0.1)]">
                  <tr>
                    <th className="text-left p-4 font-semibold">{t.modules.abyssusCoOpCrossplayAndMatchmaking.headers.feature}</th>
                    <th className="text-left p-4 font-semibold">{t.modules.abyssusCoOpCrossplayAndMatchmaking.headers.steam_pc}</th>
                    <th className="text-left p-4 font-semibold">{t.modules.abyssusCoOpCrossplayAndMatchmaking.headers.playstation_5}</th>
                    <th className="text-left p-4 font-semibold">{t.modules.abyssusCoOpCrossplayAndMatchmaking.headers.xbox_series_xs}</th>
                    <th className="text-left p-4 font-semibold">{t.modules.abyssusCoOpCrossplayAndMatchmaking.headers.notes}</th>
                  </tr>
                </thead>
                <tbody>
                  {t.modules.abyssusCoOpCrossplayAndMatchmaking.rows.map(
                    (row: any, index: number) => (
                      <tr key={index} className="border-t border-border align-top">
                        <td className="p-4 font-medium text-[hsl(var(--nav-theme-light))]">
                          {row.feature}
                        </td>
                        <td className="p-4 text-muted-foreground">{row.steam_pc}</td>
                        <td className="p-4 text-muted-foreground">{row.playstation_5}</td>
                        <td className="p-4 text-muted-foreground">{row.xbox_series_xs}</td>
                        <td className="p-4 text-muted-foreground">{row.notes}</td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile stacked cards */}
            <div className="md:hidden space-y-3">
              {t.modules.abyssusCoOpCrossplayAndMatchmaking.rows.map(
                (row: any, index: number) => (
                  <div
                    key={index}
                    className="p-4 bg-white/5 border border-border rounded-xl"
                  >
                    <h3 className="font-bold text-base mb-3 text-[hsl(var(--nav-theme-light))]">
                      {row.feature}
                    </h3>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="font-medium mb-0.5">{t.modules.abyssusCoOpCrossplayAndMatchmaking.headers.steam_pc}</dt>
                        <dd className="text-muted-foreground">{row.steam_pc}</dd>
                      </div>
                      <div>
                        <dt className="font-medium mb-0.5">{t.modules.abyssusCoOpCrossplayAndMatchmaking.headers.playstation_5}</dt>
                        <dd className="text-muted-foreground">{row.playstation_5}</dd>
                      </div>
                      <div>
                        <dt className="font-medium mb-0.5">{t.modules.abyssusCoOpCrossplayAndMatchmaking.headers.xbox_series_xs}</dt>
                        <dd className="text-muted-foreground">{row.xbox_series_xs}</dd>
                      </div>
                      <div className="pt-2 mt-2 border-t border-border">
                        <dt className="font-medium mb-0.5">{t.modules.abyssusCoOpCrossplayAndMatchmaking.headers.notes}</dt>
                        <dd className="text-muted-foreground">{row.notes}</dd>
                      </div>
                    </dl>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Ad slot 8: between modules */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 8: Abyssus Updates, Patch Notes and DLC (timeline) */}
      <section id="updates-patch-notes-dlc" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4 text-[hsl(var(--nav-theme-light))]">
              {(() => {
                const Icon = MODULE_ICONS.abyssusUpdatesPatchNotesAndDlc;
                return <Icon className="w-5 h-5" />;
              })()}
              <span className="text-xs md:text-sm font-semibold uppercase tracking-wider">
                {t.modules.abyssusUpdatesPatchNotesAndDlc.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.abyssusUpdatesPatchNotesAndDlc.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-3 md:mb-4">
              {t.modules.abyssusUpdatesPatchNotesAndDlc.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.abyssusUpdatesPatchNotesAndDlc.intro}
            </p>
          </div>

          <div className="scroll-reveal relative max-w-3xl mx-auto">
            {/* vertical line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-[hsl(var(--nav-theme)/0.3)]" />
            <div className="space-y-5">
              {t.modules.abyssusUpdatesPatchNotesAndDlc.items.map(
                (event: any, index: number) => (
                  <div key={index} className="relative pl-8">
                    <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-[hsl(var(--nav-theme))] ring-4 ring-background flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    </div>
                    <div className="p-4 md:p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 text-xs md:text-sm font-semibold text-[hsl(var(--nav-theme-light))]">
                          <Calendar className="w-3.5 h-3.5" />
                          {event.date}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.3)] text-xs font-medium">
                          {event.label}
                        </span>
                      </div>
                      <h3 className="text-base md:text-lg font-bold mb-1.5">
                        {event.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile banner ad */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
        />
      )}

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.gg/bvw5RPVPjp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/PlayAbyssus"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://steamcommunity.com/app/1721110"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    Steam Community <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://store.steampowered.com/app/1721110/Abyssus/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
