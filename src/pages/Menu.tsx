import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, Drumstick, MapPin, UtensilsCrossed, ShoppingBag, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo, { breadcrumbLd, SITE } from "@/components/Seo";
import { cn } from "@/lib/utils";
import menuData from "@/lib/data/menu.json";
import { useEdit } from "@/contexts/EditContext";
import { MediaEdit } from "@/components/ui/media-edit";

type MenuItem = {
  category: string;
  name: string;
  name_zh: string;
  description: string;
  price: string;
  image: string;
};

const priceToValue = (price: string): string | undefined => {
  const m = price.match(/[\d.]+/);
  return m ? Number(m[0]).toFixed(2) : undefined;
};

type CategoryRowProps = {
  category: string;
  items: MenuItem[];
  isEditing: boolean;
  getDraftValue: (key: string, defaultValue: string) => string;
  updateDraft: (key: string, value: string) => void;
  imagePrefix: string;
};

const itemKey = (item: MenuItem) =>
  `${item.category}::${item.name}`.toLowerCase().replace(/[^a-z0-9]+/g, "_");

const ACRONYMS = new Set(["bbq", "nyc", "usa"]);

const titleCase = (s: string) =>
  s.replace(/\b[a-z][a-z']*/gi, (word) => {
    const lower = word.toLowerCase();
    if (ACRONYMS.has(lower)) return lower.toUpperCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  });

const Sparkle = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
    className={cn("animate-pulse [animation-duration:3s]", className)}
    style={style}
  >
    <path d="M12 0c.6 4.4 1.6 7 3.4 8.6C17.2 10.2 19.8 11.2 24 12c-4.4.6-7 1.6-8.6 3.4C13.8 17.2 12.8 19.8 12 24c-.6-4.4-1.6-7-3.4-8.6C6.8 13.8 4.2 12.8 0 12c4.4-.6 7-1.6 8.6-3.4C10.2 6.8 11.2 4.2 12 0z" />
  </svg>
);

const CategoryRow = ({ category, items, isEditing, getDraftValue, updateDraft, imagePrefix }: CategoryRowProps) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  const updateArrows = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const overflow = el.scrollWidth > el.clientWidth + 1;
    setHasOverflow(overflow);
    setCanPrev(el.scrollLeft > 1);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useLayoutEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, [items.length]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const gap = 24;
    const step = card ? card.getBoundingClientRect().width + gap : el.clientWidth;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <>
      <div className="flex items-end justify-between gap-4 mb-4 sm:mb-5 md:mb-6">
        <h2 className="text-xl sm:text-2xl md:text-[1.625rem] font-body font-bold uppercase tracking-tight text-foreground text-balance leading-tight">
          {stripCJK(category).toUpperCase()}
        </h2>
        {hasOverflow && (
          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              aria-label={`Previous ${stripCJK(category)} items`}
              onClick={() => scrollByCard(-1)}
              disabled={!canPrev}
              className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-border bg-card text-foreground transition-opacity hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label={`Next ${stripCJK(category)} items`}
              onClick={() => scrollByCard(1)}
              disabled={!canNext}
              className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-border bg-card text-foreground transition-opacity hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
      <div
        ref={scrollerRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {items.map((item) => {
          const en = stripCJK(item.name) || item.name;
          const key = itemKey(item);
          const imageKey = `menu_item_${key}_image`;
          const defaultImage = `${imagePrefix}menu-images/${item.image}`;
          const imageSrc = getDraftValue(imageKey, defaultImage);
          return (
            <div
              key={key}
              data-card
              className="bg-card rounded-2xl overflow-hidden border border-border/60 hover:shadow-md transition-shadow flex flex-col shrink-0 snap-start w-[78%] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4.5rem)/4)]"
            >
              <MediaEdit
                id={imageKey}
                isEditing={isEditing}
                value={imageSrc}
                onChange={(v) => updateDraft(imageKey, v)}
                className="h-48 overflow-hidden bg-cream block"
              >
                <img
                  src={imageSrc}
                  alt={titleCase(en)}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </MediaEdit>
              <div className="p-5 flex flex-col flex-1 border-t border-border">
                <h3 className="font-body text-[15px] sm:text-base font-bold leading-snug text-foreground">
                  {titleCase(en)}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

const NAV_OFFSET = 136;

const menuFaqItems = [
  {
    q: "Is the Chick Rocks menu halal?",
    a: "Yes. Chick Rocks serves halal chicken at both our Astoria and Flushing locations in Queens.",
  },
  {
    q: "Can I order Chick Rocks online?",
    a: "Yes. You can order online for pickup or delivery from our Astoria or Flushing location.",
  },
  {
    q: "What is on the Chick Rocks menu?",
    a: "Our menu includes halal fried chicken, wings, chicken sandwiches, rice bowls, spaghetti combos, snacks, desserts, drinks, and special offers.",
  },
];

const menuFaqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: menuFaqItems.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const CJK_GLOBAL = /[一-鿿　-〿＀-￯]/g;

const stripCJK = (s: string) => s.replace(CJK_GLOBAL, "").replace(/\s+/g, " ").trim();

const slugify = (s: string) =>
  stripCJK(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";

const Menu = () => {
  const base = import.meta.env.BASE_URL;
  const { isEditing, getDraftValue, updateDraft } = useEdit();
  const sections = useMemo(() => {
    const map = new Map<string, MenuItem[]>();
    (menuData as MenuItem[]).forEach((item) => {
      const bucket = map.get(item.category) ?? [];
      bucket.push(item);
      map.set(item.category, bucket);
    });
    const usedSlugs = new Set<string>();
    return Array.from(map.entries()).map(([category, items]) => {
      let slug = slugify(category);
      let i = 2;
      while (usedSlugs.has(slug)) slug = `${slugify(category)}-${i++}`;
      usedSlugs.add(slug);
      return { category, slug, items };
    });
  }, []);

  const menuLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Menu",
      name: "Chick Rocks Halal Menu",
      inLanguage: "en",
      hasMenuSection: sections.map((section) => ({
        "@type": "MenuSection",
        name: stripCJK(section.category),
        hasMenuItem: section.items.map((item) => {
          const en = stripCJK(item.name);
          const priceValue = priceToValue(item.price);
          return {
            "@type": "MenuItem",
            name: en || item.name,
            description: item.description || undefined,
            image: item.image ? `${SITE.URL}/menu-images/${item.image}` : undefined,
            suitableForDiet: "https://schema.org/HalalDiet",
            ...(priceValue
              ? {
                  offers: {
                    "@type": "Offer",
                    price: priceValue,
                    priceCurrency: "USD",
                  },
                }
              : {}),
          };
        }),
      })),
    }),
    [sections]
  );

  const menuCrumbsLd = useMemo(
    () =>
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Menu", path: "/menu" },
      ]),
    []
  );

  const [activeSlug, setActiveSlug] = useState(sections[0]?.slug ?? "");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const slug = hash.replace(/^#/, "");
    if (!sections.some((s) => s.slug === slug)) return;
    requestAnimationFrame(() => {
      const el = document.getElementById(slug);
      if (!el) return;
      const y = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSlug(slug);
    });
  }, [hash, sections]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSlug(visible[0].target.id);
      },
      { rootMargin: `-${NAV_OFFSET + 20}px 0px -60% 0px`, threshold: 0 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.slug);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    const el = tabRefs.current[activeSlug];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeSlug]);

  const onTabClick = (slug: string) => {
    const el = document.getElementById(slug);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const [openFaqItems, setOpenFaqItems] = useState<Set<number>>(new Set());
  const toggleFaqItem = (idx: number) => {
    setOpenFaqItems((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo
        title="Halal Fried Chicken Menu — Sandwiches, Wings & Rice Bowls | Chick Rocks"
        description="The full Chick Rocks halal menu — crispy fried chicken, signature sandwiches, wings, rice bowls, spaghetti combos, sides and drinks. Fresh, halal, made to order in Astoria & Flushing, NY."
        path="/menu"
        keywords="halal fried chicken menu, halal chicken sandwich astoria, halal wings queens, halal rice bowl nyc, chick rocks menu"
        image={`${SITE.URL}/Fried_Chicken_Nyc.png`}
        jsonLd={[menuLd, menuCrumbsLd, menuFaqLd]}
      />
      <Navbar />

      <section className="relative bg-primary text-primary-foreground overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08] pointer-events-none [background-image:radial-gradient(theme(colors.primary.foreground)_1px,transparent_1px)] [background-size:22px_22px]"
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.18)_100%)]"
        />
        <div className="relative container mx-auto px-4 py-9 sm:py-11 md:py-14 flex flex-col items-center text-center">
          <MediaEdit
            id="menu_page_hero_logo"
            isEditing={isEditing}
            value={getDraftValue("menu_page_hero_logo", `${base}logo.webp`)}
            onChange={(v) => updateDraft("menu_page_hero_logo", v)}
          >
            <img
              src={getDraftValue("menu_page_hero_logo", `${base}logo.webp`)}
              alt="Chick Rocks halal fried chicken logo"
              className="h-12 sm:h-14 md:h-16 w-auto brightness-0 invert"
            />
          </MediaEdit>

          <div className="mt-4 sm:mt-5 flex items-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.32em] opacity-80">
            <span aria-hidden className="h-px w-8 sm:w-10 bg-primary-foreground/60" />
            <span>Astoria · Flushing</span>
            <span aria-hidden className="h-px w-8 sm:w-10 bg-primary-foreground/60" />
          </div>

          <h1 className="mt-3 sm:mt-4 font-heading uppercase tracking-wide text-balance text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] leading-[1]">
            Halal Fried Chicken & Comfort Food Menu
          </h1>

          <div aria-hidden className="mt-4 sm:mt-5 flex items-center gap-2 opacity-70">
            <span className="h-px w-8 bg-primary-foreground" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
            <span className="h-px w-8 bg-primary-foreground" />
          </div>

          <p className="mt-3 sm:mt-4 text-[13px] sm:text-sm md:text-[15px] leading-relaxed opacity-90 max-w-5xl mx-auto text-pretty">
            Explore the Chick Rocks halal chicken menu with crispy fried chicken, chicken sandwiches, wings, rice bowls, spaghetti combos, desserts, drinks, and comfort food favorites at our Astoria and Flushing locations in Queens.
          </p>

          <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
            <a
              href="https://pos.chowbus.com/online-ordering/store/chick-rocks/11843"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-primary-foreground text-primary px-7 py-3 rounded-full font-bold uppercase tracking-wide shadow-lg shadow-black/10 hover:translate-y-[-2px] hover:shadow-xl transition-all duration-200 w-full sm:w-auto sm:min-w-[200px]"
            >
              Order Now · Flushing
            </a>
            <a
              href="https://pos.chowbus.com/online-ordering/store/chick-rocks-astoria/20957"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border-2 border-primary-foreground text-primary-foreground px-7 py-3 rounded-full font-bold uppercase tracking-wide hover:bg-primary-foreground hover:text-primary transition-colors duration-200 w-full sm:w-auto sm:min-w-[200px]"
            >
              Order Now · Astoria
            </a>
          </div>
        </div>
      </section>

      <div className="sticky top-[72px] z-40 bg-card/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-2 md:px-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-3">
            {sections.map((s) => (
              <button
                key={s.slug}
                ref={(el) => (tabRefs.current[s.slug] = el)}
                onClick={() => onTabClick(s.slug)}
                className={cn(
                  "shrink-0 px-4 py-2 text-sm font-semibold whitespace-nowrap rounded-full transition-colors",
                  activeSlug === s.slug
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:text-primary"
                )}
              >
                {titleCase(stripCJK(s.category))}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 pt-8 sm:pt-10 md:pt-12 pb-10 md:pb-12 space-y-10 sm:space-y-12 md:space-y-16">
        <div className="grid md:grid-cols-[2fr_1fr] gap-6 md:gap-10 items-center -mb-4 sm:-mb-6">
          <p className="text-sm sm:text-base md:text-[17px] leading-relaxed text-muted-foreground text-pretty">
            <span className="font-semibold text-foreground">Looking for a halal chicken menu in Queens?</span>{" "}
            Chick Rocks serves crispy halal fried chicken, wings, chicken sandwiches, burgers, rice bowls, Rocks spaghetti combos, snacks, desserts, and refreshing drinks. Order online from our Astoria or Flushing location for pickup, delivery, or a quick halal comfort food meal near you.
          </p>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {[
              { Icon: Drumstick, label: "100% Halal" },
              { Icon: MapPin, label: "Astoria · Flushing" },
              { Icon: UtensilsCrossed, label: "Made to Order" },
              { Icon: ShoppingBag, label: "Pickup · Delivery" },
            ].map(({ Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 bg-card border border-border rounded-xl px-3 py-2.5"
              >
                <Icon className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-primary shrink-0" strokeWidth={1.75} />
                <span className="text-[12px] sm:text-[13px] font-semibold text-foreground leading-tight">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
        {sections.map((section) => (
          <section key={section.slug} id={section.slug} className="scroll-mt-36">
            <CategoryRow
              category={section.category}
              items={section.items}
              isEditing={isEditing}
              getDraftValue={getDraftValue}
              updateDraft={updateDraft}
              imagePrefix={base}
            />
          </section>
        ))}
      </main>

      <section className="bg-background py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <p className="text-center text-sm sm:text-base leading-relaxed text-muted-foreground text-pretty">
            Chick Rocks serves a halal chicken menu in Queens with crispy fried chicken, wings, chicken sandwiches, rice bowls, spaghetti combos, desserts, drinks, pickup, and delivery. Visit or order from our Astoria and Flushing locations for bold halal comfort food made fresh for every craving.
          </p>

          <h2
            id="menu-faq-heading"
            className="mt-12 sm:mt-14 md:mt-16 text-3xl sm:text-4xl md:text-5xl font-heading uppercase tracking-wide text-foreground text-center text-balance"
          >
            Chick Rocks Menu FAQs
          </h2>

          <div className="mt-8 sm:mt-10 md:mt-12 divide-y divide-border border-y border-border">
            {menuFaqItems.map((item, i) => {
              const idx = i + 1;
              const isOpen = openFaqItems.has(idx);
              return (
                <article key={item.q}>
                  <button
                    type="button"
                    onClick={() => toggleFaqItem(idx)}
                    aria-expanded={isOpen}
                    aria-controls={`menu_faq_panel_${idx}`}
                    className="w-full flex items-start justify-between gap-4 sm:gap-6 py-4 sm:py-5 text-left hover:text-primary transition-colors"
                  >
                    <h3 className="text-base md:text-lg font-body font-normal text-foreground leading-snug text-pretty">
                      {item.q}
                    </h3>
                    <Plus
                      aria-hidden="true"
                      className={`shrink-0 w-5 h-5 mt-1 text-muted-foreground transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    />
                  </button>
                  <div
                    id={`menu_faq_panel_${idx}`}
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-sm sm:text-base leading-relaxed text-muted-foreground pb-4 sm:pb-5 pr-8 sm:pr-11 text-pretty">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <p className="text-center mt-8 sm:mt-10 text-sm sm:text-base text-muted-foreground">
            <a
              href="/faq"
              className="font-heading uppercase tracking-wider text-primary hover:underline underline-offset-4"
            >
              See all FAQs
            </a>
          </p>
        </div>
      </section>

      <section className="relative bg-cream text-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none [background-image:radial-gradient(theme(colors.primary.DEFAULT)_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-16 items-center">
            <div className="relative order-1">
              <div className="absolute -inset-2 md:-inset-4 rounded-[3rem] bg-primary/10 -rotate-3" aria-hidden />
              <MediaEdit
                id="menu_page_cta_image"
                isEditing={isEditing}
                value={getDraftValue("menu_page_cta_image", `${base}uploads/2026/05/Box-with-Hamburger-Chickrocks-USA-scaled-e1778163209437.jpg`)}
                onChange={(v) => updateDraft("menu_page_cta_image", v)}
                className="relative aspect-[4/3] max-w-xl mx-auto rounded-[2.5rem] overflow-hidden ring-2 ring-primary/20 shadow-2xl block"
              >
                <img
                  src={getDraftValue("menu_page_cta_image", `${base}uploads/2026/05/Box-with-Hamburger-Chickrocks-USA-scaled-e1778163209437.jpg`)}
                  alt="Chick Rocks halal fried chicken plate"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </MediaEdit>
              <Sparkle className="absolute -top-2 -left-2 md:-top-4 md:-left-6 w-10 md:w-14 text-primary rotate-12" style={{ animationDelay: "0s" }} />
              <Sparkle className="absolute top-1/3 -right-3 md:-right-6 w-7 md:w-10 text-accent -rotate-12" style={{ animationDelay: "0.7s" }} />
              <Sparkle className="absolute -bottom-3 left-10 md:left-16 w-9 md:w-12 text-primary rotate-45" style={{ animationDelay: "1.4s" }} />
              <Sparkle className="absolute bottom-1/4 -left-4 md:-left-8 w-6 md:w-8 text-accent/80" style={{ animationDelay: "2.1s" }} />
            </div>

            <div className="order-2 space-y-4 sm:space-y-5 md:space-y-6">
              <p className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-primary">
                Order Online
              </p>
              <h2 className="font-heading uppercase text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[0.95] tracking-wide text-foreground text-balance">
                Order From Our Halal Chicken Menu
              </h2>
              <p className="text-[13px] sm:text-sm md:text-[15px] leading-relaxed text-muted-foreground max-w-xl text-pretty">
                Craving halal food in Queens? Order Chick Rocks online for crispy fried chicken, chicken sandwiches, wings, rice bowls, spaghetti combos, drinks, and more from our Astoria or Flushing location.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                <a
                  href="https://pos.chowbus.com/online-ordering/store/chick-rocks/11843"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-primary text-primary-foreground px-7 py-3.5 rounded-full font-bold uppercase tracking-wide hover:translate-y-[-2px] hover:shadow-lg transition-all duration-200"
                >
                  Order Flushing Location
                </a>
                <a
                  href="https://pos.chowbus.com/online-ordering/store/chick-rocks-astoria/20957"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center border-2 border-primary text-primary px-7 py-3.5 rounded-full font-bold uppercase tracking-wide hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                >
                  Order Astoria Location
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Menu;
