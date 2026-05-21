import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { MapPin, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEdit } from "@/contexts/EditContext";
import { InlineEdit } from "@/components/ui/inline-edit";
import { MediaEdit } from "@/components/ui/media-edit";

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
  const base = import.meta.env.BASE_URL;

  const slides = useMemo(
    () => [
      getDraftValue("hero_slide_1_img", `${base}uploads/2026/05/Chicken-ChickRocks-.jpg`),
      getDraftValue("hero_slide_2_img", `${base}uploads/2026/05/Hamburger-Chickrocks.jpg`),
    ],
    [getDraftValue, base]
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
            const slideKey = slideIndex === 0 ? "hero_slide_1_img" : "hero_slide_2_img";
            const defaultSrc = slideIndex === 0 ? `${base}uploads/2026/05/Chicken-ChickRocks-.jpg` : `${base}uploads/2026/05/Hamburger-Chickrocks.jpg`;
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
                    <img
                      src={src}
                      alt="Chick Rocks featured promotion"
                      loading="lazy"
                      className="block w-full h-auto bg-cream"
                    />
                  </MediaEdit>
                ) : (
                  <img
                    src={src}
                    alt="Chick Rocks featured promotion"
                    loading="lazy"
                    className="block w-full h-auto bg-cream"
                  />
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

      <div className="container mx-auto px-4 mt-6 max-w-6xl text-center">
        <InlineEdit
          id="hero_intro_text"
          as="p"
          isEditing={isEditing}
          value={getDraftValue(
            "hero_intro_text",
            "Chick Rocks serves halal food in Queens with crispy fried chicken, wings, chicken sandwiches, rice bowls, spaghetti, drinks, and comfort food favorites. Visit our Astoria and Flushing locations for dine-in, pickup, delivery, catering, and bold halal chicken meals made for every craving."
          )}
          onChange={(v) => updateDraft("hero_intro_text", v)}
          className="text-foreground/80 text-sm sm:text-base leading-relaxed [text-wrap:balance]"
        />
      </div>

      <div className="container mx-auto px-4 mt-6 flex flex-row items-center justify-center gap-3 sm:gap-4">
        <a
          href="https://pos.chowbus.com/online-ordering/store/chick-rocks/11843"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 sm:flex-none items-center justify-center gap-2 bg-primary text-primary-foreground px-4 sm:px-10 py-3 sm:py-4 rounded-full font-bold hover:opacity-90 transition-opacity sm:min-w-[220px]"
        >
          <MapPin className="w-5 h-5" />
          <InlineEdit
            id="hero_cta_location_1"
            as="span"
            isEditing={isEditing}
            value={getDraftValue("hero_cta_location_1", "Flushing, NY")}
            onChange={(v) => updateDraft("hero_cta_location_1", v)}
          />
        </a>
        <a
          href="https://pos.chowbus.com/online-ordering/store/chick-rocks-astoria/20957"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 sm:flex-none items-center justify-center gap-2 bg-primary text-primary-foreground px-4 sm:px-10 py-3 sm:py-4 rounded-full font-bold hover:opacity-90 transition-opacity sm:min-w-[220px]"
        >
          <MapPin className="w-5 h-5" />
          <InlineEdit
            id="hero_cta_location_2"
            as="span"
            isEditing={isEditing}
            value={getDraftValue("hero_cta_location_2", "Astoria, NY")}
            onChange={(v) => updateDraft("hero_cta_location_2", v)}
          />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
