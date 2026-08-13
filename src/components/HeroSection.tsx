import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, ChevronLeft, ChevronRight, Pause, Play, ShoppingBag } from "lucide-react";
import { useEdit } from "@/contexts/EditContext";
import { useOrderModal } from "@/contexts/OrderModalContext";
import { InlineEdit } from "@/components/ui/inline-edit";
import { MediaEdit } from "@/components/ui/media-edit";
import { STORES, STORE_CITIES_SENTENCE } from "@/lib/stores";

const COPIES = 5;

const MOBILE_MAX = 639;
const SLIDE_W_VW_MOBILE = 92;
const SLIDE_W_VW_DESKTOP = 70;
const GAP_PX_MOBILE = 8;
const GAP_PX_DESKTOP = 16;
const DURATION_MS = 700;
const AUTOPLAY_MS = 5000;

const HeroSection = () => {
  const { isEditing, getDraftValue, updateDraft } = useEdit();
  const { open: openOrderModal } = useOrderModal();
  const base = import.meta.env.BASE_URL;

  const slideDefaults = useMemo(
    () => [
      `${base}hero-images/chick-rocks-2026-08-banner-1.avif`,
      `${base}hero-images/chick-rocks-2026-08-banner-2.avif`,
      `${base}hero-images/chick-rocks-2026-08-banner-3.avif`,
      `${base}hero-images/chick-rocks-2026-08-banner-4.avif`,
    ],
    [base]
  );

  const slideLinks = ["/about", "/menu", "/menu", "/menu"];

  const slideAlts = [
    "Grand opening of Chick Rocks Jackson Heights at 83-12 37th Ave, Jackson Heights, NY 11372",
    "Mix fried chicken, 3 pieces for $5",
    "Mix fried chicken family combo, 10 pieces for $24.99 with three medium sides",
    "Rocks Slider 2 for $7, combo 1 for $8.99 and combo 2 for $11.99",
  ];

  const slides = useMemo(
    () => slideDefaults.map((def, i) => getDraftValue(`hero_slide_${i + 1}_img`, def)),
    [getDraftValue, slideDefaults]
  );

  const rendered = useMemo(
    () => Array.from({ length: slides.length * COPIES }, (_, i) => slides[i % slides.length]),
    [slides]
  );
  const MIDDLE = slides.length * Math.floor(COPIES / 2);
  const HIGH_THRESHOLD = slides.length * (COPIES - 1);
  const LOW_THRESHOLD = slides.length;
  const WRAP = slides.length * (COPIES - 2);

  const [vIndex, setVIndex] = useState(MIDDLE);
  const [playing, setPlaying] = useState(true);
  const [animate, setAnimate] = useState(true);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= MOBILE_MAX
  );

  const trackRef = useRef<HTMLDivElement>(null);
  const vIndexRef = useRef(vIndex);
  const lockedRef = useRef(false);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    vIndexRef.current = vIndex;
  }, [vIndex]);

  const slideW = isMobile ? SLIDE_W_VW_MOBILE : SLIDE_W_VW_DESKTOP;
  const gapPx = isMobile ? GAP_PX_MOBILE : GAP_PX_DESKTOP;

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const stopAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  };

  const clearFinishTimer = () => {
    if (finishTimerRef.current) {
      clearTimeout(finishTimerRef.current);
      finishTimerRef.current = null;
    }
  };

  const finishTransition = (completed: number) => {
    finishTimerRef.current = null;
    if (completed >= HIGH_THRESHOLD) {
      setAnimate(false);
      setVIndex(completed - WRAP);
      return;
    }
    if (completed < LOW_THRESHOLD) {
      setAnimate(false);
      setVIndex(completed + WRAP);
      return;
    }
    lockedRef.current = false;
  };

  const advance = (next: number) => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    setAnimate(true);
    setVIndex(next);
    clearFinishTimer();
    finishTimerRef.current = setTimeout(() => finishTransition(next), DURATION_MS + 60);
  };

  const startAutoplay = () => {
    stopAutoplay();
    if (!playing) return;
    if (typeof document !== "undefined" && document.hidden) return;
    autoplayRef.current = setInterval(() => {
      if (lockedRef.current) return;
      advance(vIndexRef.current + 1);
    }, AUTOPLAY_MS);
  };

  useLayoutEffect(() => {
    if (animate || !trackRef.current) return;
    void trackRef.current.getBoundingClientRect();
    let done = false;
    const release = () => {
      if (done) return;
      done = true;
      setAnimate(true);
      lockedRef.current = false;
    };
    const rafId = requestAnimationFrame(release);
    const toId = setTimeout(release, 80);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(toId);
    };
  }, [animate, vIndex]);

  useLayoutEffect(() => {
    if (vIndex < 0 || vIndex > rendered.length - 1) {
      clearFinishTimer();
      lockedRef.current = false;
      setAnimate(false);
      setVIndex(MIDDLE);
    }
  }, [vIndex, rendered.length, MIDDLE]);

  useEffect(() => {
    startAutoplay();
    const onVis = () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stopAutoplay();
      clearFinishTimer();
      document.removeEventListener("visibilitychange", onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const nav = (dir: 1 | -1) => {
    advance(vIndexRef.current + dir);
    startAutoplay();
  };

  const jumpToDot = (i: number) => {
    const target = MIDDLE + i;
    if (target === vIndexRef.current) return;
    advance(target);
    startAutoplay();
  };

  const activeDot = ((vIndex % slides.length) + slides.length) % slides.length;

  const slideTransitionClass = animate ? "transition-[transform,opacity] duration-700 ease-out" : "";

  return (
    <section className="bg-cream pb-4 pt-4">
      <div className="relative w-full overflow-hidden">
        <div
          ref={trackRef}
          className={`flex ${animate ? "transition-transform duration-700 ease-out" : ""}`}
          style={{
            gap: `${gapPx}px`,
            transform: `translateX(calc(${50 - slideW / 2 - vIndex * slideW}vw - ${vIndex * gapPx}px))`,
            willChange: "transform",
          }}
        >
          {rendered.map((src, i) => {
            const isCenter = i === vIndex;
            const slideIndex = i % slides.length;
            const slideKey = `hero_slide_${slideIndex + 1}_img`;
            const defaultSrc = slideDefaults[slideIndex];
            const slideLink = slideLinks[slideIndex];
            const img = (
              <img
                src={src}
                alt={slideAlts[slideIndex]}
                loading="lazy"
                className="block w-full h-auto bg-cream"
              />
            );
            return (
              <div
                key={i}
                className={`shrink-0 overflow-hidden rounded-2xl sm:rounded-[2.5rem] ${slideTransitionClass} ${
                  isCenter ? "scale-100 opacity-100" : "scale-[0.88] opacity-70"
                }`}
                style={{ width: `${slideW}vw` }}
              >
                {isCenter && isEditing ? (
                  <MediaEdit
                    id={slideKey}
                    isEditing={isEditing}
                    value={getDraftValue(slideKey, defaultSrc)}
                    onChange={(v) => updateDraft(slideKey, v)}
                  >
                    {img}
                  </MediaEdit>
                ) : isCenter ? (
                  <Link to={slideLink} className="block">
                    {img}
                  </Link>
                ) : (
                  img
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={() => nav(-1)}
          aria-label="Previous slide"
          className="absolute left-2 sm:left-[calc(15vw-20px)] top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-foreground flex items-center justify-center shadow-md transition-colors z-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => nav(1)}
          aria-label="Next slide"
          className="absolute right-2 sm:right-[calc(15vw-20px)] top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-foreground flex items-center justify-center shadow-md transition-colors z-10"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-center gap-3">
        <button
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause slideshow" : "Play slideshow"}
          className="w-6 h-6 rounded-full bg-foreground/10 hover:bg-foreground/20 text-foreground flex items-center justify-center transition-colors"
        >
          {playing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        </button>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => jumpToDot(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === activeDot ? "bg-primary" : "bg-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="hidden sm:block container mx-auto px-4 mt-6 max-w-6xl text-center">
        <InlineEdit
          id="hero_intro_text"
          as="p"
          isEditing={isEditing}
          value={getDraftValue(
            "hero_intro_text",
            `Chick Rocks serves halal food in Queens with crispy fried chicken, wings, chicken sandwiches, rice bowls, spaghetti, drinks, and comfort food favorites. Visit our ${STORE_CITIES_SENTENCE} locations for dine-in, pickup, delivery, catering, and bold halal chicken meals made for every craving.`
          )}
          onChange={(v) => updateDraft("hero_intro_text", v)}
          className="text-foreground/80 text-sm sm:text-base leading-relaxed [text-wrap:balance]"
        />
      </div>

      {/* Exactly one thing here looks clickable. The store names sit underneath as a
          plain caption — they keep the neighborhoods on the page for search and tell
          you a choice is coming, without competing with the CTA. Picking the store
          happens in the modal, which already has addresses, phones and hours. */}
      <div className="container mx-auto px-4 mt-4 sm:mt-6 flex flex-col items-center gap-2.5 sm:gap-3">
        <button
          type="button"
          onClick={openOrderModal}
          className="flex w-full sm:w-auto items-center justify-center gap-2.5 bg-primary text-primary-foreground px-8 sm:px-14 py-3.5 sm:py-4 rounded-full font-bold uppercase tracking-wide text-base sm:text-lg shadow-lg shadow-primary/25 hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200 sm:min-w-[280px]"
        >
          <ShoppingBag className="w-5 h-5" aria-hidden="true" />
          <InlineEdit
            id="hero_cta_order"
            as="span"
            isEditing={isEditing}
            value={getDraftValue("hero_cta_order", "Order Now")}
            onChange={(v) => updateDraft("hero_cta_order", v)}
          />
        </button>
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs sm:text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 shrink-0 text-primary" aria-hidden="true" />
          {STORES.map((store, i) => (
            <Fragment key={store.id}>
              {i > 0 && (
                <span aria-hidden="true" className="opacity-40">
                  ·
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 font-semibold text-foreground/75">
                {store.name}
                {store.isNew && (
                  <span className="rounded-full bg-accent/15 text-accent text-[9px] font-bold uppercase tracking-[0.12em] px-1.5 py-0.5">
                    New
                  </span>
                )}
              </span>
            </Fragment>
          ))}
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
