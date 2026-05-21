import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo, { breadcrumbLd, SITE } from "@/components/Seo";
import { useEdit } from "@/contexts/EditContext";
import { InlineEdit } from "@/components/ui/inline-edit";
import { MediaEdit } from "@/components/ui/media-edit";
import { cn } from "@/lib/utils";

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

const aboutLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Chick Rocks — Halal Fried Chicken in Astoria & Flushing",
  url: `${SITE.URL}/about`,
  about: {
    "@type": "Restaurant",
    name: SITE.NAME,
    servesCuisine: ["Halal", "Fried Chicken", "Chinese American"],
  },
};

const aboutCrumbsLd = breadcrumbLd([
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
]);

const About = () => {
  const { isEditing, getDraftValue, updateDraft } = useEdit();
  const base = import.meta.env.BASE_URL;

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Seo
        title="About Chick Rocks — Halal Fried Chicken in Astoria & Flushing"
        description="Chick Rocks brings bold halal fried chicken, sandwiches, rice bowls and spaghetti combos to Astoria and Flushing, Queens. 100% halal, hand-breaded and fried fresh to order."
        path="/about"
        keywords="chick rocks story, halal fried chicken astoria, halal restaurant queens, chinese american halal"
        image={`${SITE.URL}/store-front-1.webp`}
        imageAlt="Chick Rocks storefront — halal fried chicken in Queens, NY"
        jsonLd={[aboutLd, aboutCrumbsLd]}
      />
      <Navbar />

      <section className="bg-cream pt-10 sm:pt-12 md:pt-16 pb-6 sm:pb-8 md:pb-10">
        <div className="container mx-auto px-5 sm:px-6 md:px-10 max-w-[1400px]">
          <p className="text-center font-mono text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-accent mb-5 sm:mb-6 md:mb-8">
            <InlineEdit
              id="about_v3_hero_eyebrow"
              as="span"
              isEditing={isEditing}
              value={getDraftValue("about_v3_hero_eyebrow", "—  About Chick Rocks  —")}
              onChange={(v) => updateDraft("about_v3_hero_eyebrow", v)}
            />
          </p>

          <h1 className="text-center font-heading uppercase leading-[0.9] tracking-[-0.02em] text-foreground text-[36px] sm:text-[56px] md:text-[76px] lg:text-[92px] xl:text-[108px] max-w-6xl mx-auto text-balance">
            <InlineEdit
              id="about_v3_hero_line_1"
              as="span"
              className="block"
              isEditing={isEditing}
              value={getDraftValue("about_v3_hero_line_1", "We Built Chick Rocks")}
              onChange={(v) => updateDraft("about_v3_hero_line_1", v)}
            />
            <InlineEdit
              id="about_v3_hero_line_2"
              as="span"
              className="block"
              isEditing={isEditing}
              value={getDraftValue("about_v3_hero_line_2", "for People Who Want")}
              onChange={(v) => updateDraft("about_v3_hero_line_2", v)}
            />
            <InlineEdit
              id="about_v3_hero_accent"
              as="span"
              className="block italic font-serif font-normal text-primary lowercase tracking-tight"
              isEditing={isEditing}
              value={getDraftValue("about_v3_hero_accent", "real flavor.")}
              onChange={(v) => updateDraft("about_v3_hero_accent", v)}
            />
          </h1>

          <div className="mt-5 sm:mt-6 md:mt-8 flex flex-col items-center gap-3 sm:gap-4">
            <span aria-hidden="true" className="block w-px h-6 sm:h-8 bg-foreground/30" />
            <InlineEdit
              id="about_v3_hero_subtitle"
              as="p"
              className="font-serif italic text-base sm:text-lg md:text-xl lg:text-2xl leading-[1.4] text-foreground/75 max-w-2xl text-center block text-pretty"
              isEditing={isEditing}
              multiline
              value={getDraftValue(
                "about_v3_hero_subtitle",
                "Crispy halal fried chicken, wings, sandwiches, rice bowls, and comfort food served fresh in Astoria and Flushing, Queens."
              )}
              onChange={(v) => updateDraft("about_v3_hero_subtitle", v)}
            />
          </div>
        </div>
      </section>

      <span aria-hidden="true" className="block w-px h-6 sm:h-8 md:h-10 bg-foreground/30 mx-auto" />

      <section className="bg-cream pt-6 sm:pt-8 md:pt-12 pb-10 sm:pb-12 md:pb-16">
        <div className="container mx-auto px-5 sm:px-6 md:px-10 max-w-[1400px]">
          <div className="grid md:grid-cols-12 gap-6 sm:gap-8 md:gap-10 lg:gap-16 items-start max-w-6xl mx-auto">
            <div className="md:col-span-5 relative pt-2 md:pt-4">
              <div className="flex items-center justify-center md:block">
                <div className="relative w-[50%] md:w-auto md:max-w-[280px] shrink-0 md:mr-auto md:ml-0 rotate-[-3deg]">
                  <div className="bg-white p-2 pb-6 md:p-2.5 md:pb-10 shadow-[0_30px_50px_-12px_rgba(0,0,0,0.35)]">
                    <MediaEdit
                      id="about_v3_polaroid_1"
                      isEditing={isEditing}
                      value={getDraftValue("about_v3_polaroid_1", `${base}uploads/2026/04/Storefront-Chickrocks-USA-scaled-e1777478645890.jpg`)}
                      onChange={(v) => updateDraft("about_v3_polaroid_1", v)}
                      className="block"
                    >
                      <img
                        src={getDraftValue("about_v3_polaroid_1", `${base}uploads/2026/04/Storefront-Chickrocks-USA-scaled-e1777478645890.jpg`)}
                        alt="Chick Rocks storefront in Astoria, Queens"
                        loading="lazy"
                        className="w-full aspect-[4/5] object-cover"
                      />
                    </MediaEdit>
                  </div>
                </div>

                <div className="relative w-[46%] md:w-auto md:max-w-[240px] shrink-0 -ml-3 md:ml-auto md:mr-2 md:-mt-14 rotate-[3deg]">
                  <div className="bg-white p-2 pb-6 md:p-2.5 md:pb-10 shadow-[0_30px_50px_-12px_rgba(0,0,0,0.35)]">
                    <MediaEdit
                      id="about_v3_polaroid_2"
                      isEditing={isEditing}
                      value={getDraftValue("about_v3_polaroid_2", `${base}uploads/2026/05/Fired-Chicken-Chickrocks-USA-1-e1778258997812.jpg`)}
                      onChange={(v) => updateDraft("about_v3_polaroid_2", v)}
                      className="block"
                    >
                      <img
                        src={getDraftValue("about_v3_polaroid_2", `${base}uploads/2026/05/Fired-Chicken-Chickrocks-USA-1-e1778258997812.jpg`)}
                        alt="Chick Rocks halal fried chicken"
                        loading="lazy"
                        className="w-full aspect-[5/4] object-cover"
                      />
                    </MediaEdit>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
                <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-accent shrink-0">
                  <InlineEdit
                    id="about_v3_story_eyebrow"
                    as="span"
                    isEditing={isEditing}
                    value={getDraftValue("about_v3_story_eyebrow", "Our Story")}
                    onChange={(v) => updateDraft("about_v3_story_eyebrow", v)}
                  />
                </p>
                <span aria-hidden="true" className="block flex-1 h-px bg-foreground/25" />
              </div>

              <h2 className="font-heading uppercase leading-[0.95] tracking-[-0.02em] text-foreground text-[34px] sm:text-[44px] md:text-[52px] lg:text-[64px] xl:text-[74px] mb-6 sm:mb-8 md:mb-10 text-balance">
                <InlineEdit
                  id="about_v3_story_heading_1"
                  as="span"
                  className="block"
                  isEditing={isEditing}
                  value={getDraftValue("about_v3_story_heading_1", "Born from one")}
                  onChange={(v) => updateDraft("about_v3_story_heading_1", v)}
                />
                <InlineEdit
                  id="about_v3_story_heading_2"
                  as="span"
                  className="block italic font-serif font-normal text-primary lowercase tracking-tight"
                  isEditing={isEditing}
                  value={getDraftValue("about_v3_story_heading_2", "simple idea.")}
                  onChange={(v) => updateDraft("about_v3_story_heading_2", v)}
                />
              </h2>

              <InlineEdit
                id="about_v3_story_p1"
                as="p"
                className="font-serif text-base sm:text-lg md:text-xl leading-[1.55] text-foreground block text-pretty"
                isEditing={isEditing}
                multiline
                value={getDraftValue(
                  "about_v3_story_p1",
                  "Chick Rocks started with one simple thought: fried chicken should be full of flavor on its own."
                )}
                onChange={(v) => updateDraft("about_v3_story_p1", v)}
              />

              <InlineEdit
                id="about_v3_story_p2"
                as="p"
                className="font-serif text-base sm:text-lg md:text-xl leading-[1.55] text-foreground/85 block mt-4 sm:mt-6 md:mt-8 text-pretty"
                isEditing={isEditing}
                multiline
                value={getDraftValue(
                  "about_v3_story_p2",
                  "Too often, fried chicken looks good but tastes bland until you dip it into sauce. We wanted to do things differently. Our goal was to create chicken in Queens that is crispy, juicy, and seasoned all the way through, using homemade spices blended right into the batter."
                )}
                onChange={(v) => updateDraft("about_v3_story_p2", v)}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream py-12 sm:py-16 md:py-28 relative">
        <span
          aria-hidden="true"
          className="absolute top-6 sm:top-8 md:top-12 left-1/2 -translate-x-1/2 block w-px h-8 sm:h-10 md:h-12 bg-foreground/30"
        />
        <div className="container mx-auto px-5 sm:px-6 md:px-10 max-w-[1400px]">
          <blockquote className="max-w-6xl mx-auto text-center">
            <p className="font-heading uppercase leading-[0.95] tracking-[-0.02em] text-foreground text-[34px] sm:text-[56px] md:text-[80px] lg:text-[100px] text-balance">
              <InlineEdit
                id="about_v3_pullquote_part_1"
                as="span"
                isEditing={isEditing}
                value={getDraftValue("about_v3_pullquote_part_1", "That way, every bite has")}
                onChange={(v) => updateDraft("about_v3_pullquote_part_1", v)}
              />
              {" "}
              <InlineEdit
                id="about_v3_pullquote_emphasis"
                as="span"
                className="italic font-serif font-normal text-primary lowercase tracking-tight"
                isEditing={isEditing}
                value={getDraftValue("about_v3_pullquote_emphasis", "real flavor")}
                onChange={(v) => updateDraft("about_v3_pullquote_emphasis", v)}
              />
              {" — "}
              <InlineEdit
                id="about_v3_pullquote_part_2"
                as="span"
                isEditing={isEditing}
                value={getDraftValue(
                  "about_v3_pullquote_part_2",
                  "even before the sauce hits the side."
                )}
                onChange={(v) => updateDraft("about_v3_pullquote_part_2", v)}
              />
            </p>
          </blockquote>
        </div>
        <span
          aria-hidden="true"
          className="absolute bottom-6 sm:bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 block w-px h-8 sm:h-10 md:h-12 bg-foreground/30"
        />
      </section>

      <section className="bg-cream pt-8 sm:pt-12 md:pt-16 pb-12 sm:pb-16 md:pb-24">
        <div className="container mx-auto px-5 sm:px-6 md:px-10 max-w-[1400px]">
          <div className="grid md:grid-cols-12 gap-6 sm:gap-8 md:gap-10 lg:gap-16 items-start max-w-6xl mx-auto">
            <div className="md:col-span-7 md:order-1 order-2 md:pt-4">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
                <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-accent shrink-0">
                  <InlineEdit
                    id="about_v3_halal_eyebrow"
                    as="span"
                    isEditing={isEditing}
                    value={getDraftValue("about_v3_halal_eyebrow", "Halal for Everyone")}
                    onChange={(v) => updateDraft("about_v3_halal_eyebrow", v)}
                  />
                </p>
                <span aria-hidden="true" className="block flex-1 h-px bg-foreground/25" />
              </div>

              <h2 className="font-heading uppercase leading-[0.95] tracking-[-0.02em] text-foreground text-[34px] sm:text-[44px] md:text-[52px] lg:text-[64px] xl:text-[74px] mb-6 sm:mb-8 md:mb-10 text-balance">
                <InlineEdit
                  id="about_v3_halal_heading_1"
                  as="span"
                  className="block"
                  isEditing={isEditing}
                  value={getDraftValue("about_v3_halal_heading_1", "Made for")}
                  onChange={(v) => updateDraft("about_v3_halal_heading_1", v)}
                />
                <InlineEdit
                  id="about_v3_halal_heading_2"
                  as="span"
                  className="block italic font-serif font-normal text-primary lowercase tracking-tight"
                  isEditing={isEditing}
                  value={getDraftValue("about_v3_halal_heading_2", "everyone.")}
                  onChange={(v) => updateDraft("about_v3_halal_heading_2", v)}
                />
              </h2>

              <InlineEdit
                id="about_v3_story_p3"
                as="p"
                className="font-serif text-base sm:text-lg md:text-xl leading-[1.55] text-foreground/85 block text-pretty"
                isEditing={isEditing}
                multiline
                value={getDraftValue(
                  "about_v3_story_p3",
                  "As more customers asked for halal food options, we listened. What started as growing demand from the Queens community became part of who we are. Today, both our Astoria and Flushing locations serve an all-halal menu, so more people can enjoy the fried chicken, wings, sandwiches, and comfort food they love without compromise."
                )}
                onChange={(v) => updateDraft("about_v3_story_p3", v)}
              />

              <InlineEdit
                id="about_v3_story_p4"
                as="p"
                className="font-serif text-base sm:text-lg md:text-xl leading-[1.55] text-foreground/85 block mt-4 sm:mt-6 md:mt-8 text-pretty"
                isEditing={isEditing}
                multiline
                value={getDraftValue(
                  "about_v3_story_p4",
                  "From halal chicken sandwiches and wings to rice bowls, spaghetti combos, and comfort-food favorites, Chick Rocks brings together bold taste, satisfying meals, and the kind of food you keep coming back for."
                )}
                onChange={(v) => updateDraft("about_v3_story_p4", v)}
              />
            </div>

            <div className="md:col-span-5 relative pt-2 md:pt-4 md:order-2 order-1">
              <div className="flex items-center justify-center md:block">
                <div className="relative w-[50%] md:w-auto md:max-w-[280px] shrink-0 md:ml-auto md:mr-0 rotate-[3deg]">
                  <div className="bg-white p-2 pb-6 md:p-2.5 md:pb-10 shadow-[0_30px_50px_-12px_rgba(0,0,0,0.35)]">
                    <MediaEdit
                      id="about_v3_polaroid_3"
                      isEditing={isEditing}
                      value={getDraftValue("about_v3_polaroid_3", `${base}uploads/2026/05/Hamburger-Chickrocks-USA-scaled.jpg`)}
                      onChange={(v) => updateDraft("about_v3_polaroid_3", v)}
                      className="block"
                    >
                      <img
                        src={getDraftValue("about_v3_polaroid_3", `${base}uploads/2026/05/Hamburger-Chickrocks-USA-scaled.jpg`)}
                        alt="Chick Rocks halal chicken sandwich"
                        loading="lazy"
                        className="w-full aspect-[4/5] object-cover"
                      />
                    </MediaEdit>
                  </div>
                </div>

                <div className="relative w-[46%] md:w-auto md:max-w-[240px] shrink-0 -ml-3 md:mr-auto md:ml-2 md:-mt-14 rotate-[-3deg]">
                  <div className="bg-white p-2 pb-6 md:p-2.5 md:pb-10 shadow-[0_30px_50px_-12px_rgba(0,0,0,0.35)]">
                    <MediaEdit
                      id="about_v3_polaroid_4"
                      isEditing={isEditing}
                      value={getDraftValue("about_v3_polaroid_4", `${base}uploads/2026/05/Milk-Shake-Chickrocks-scaled-e1778177234336.jpg`)}
                      onChange={(v) => updateDraft("about_v3_polaroid_4", v)}
                      className="block"
                    >
                      <img
                        src={getDraftValue("about_v3_polaroid_4", `${base}uploads/2026/05/Milk-Shake-Chickrocks-scaled-e1778177234336.jpg`)}
                        alt="Chick Rocks halal meal"
                        loading="lazy"
                        className="w-full aspect-[5/4] object-cover"
                      />
                    </MediaEdit>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <span aria-hidden="true" className="block w-px h-10 sm:h-14 md:h-20 bg-foreground/30 mx-auto" />

      <section className="bg-cream pt-10 sm:pt-14 md:pt-24 pb-12 sm:pb-16 md:pb-32">
        <div className="container mx-auto px-5 sm:px-6 md:px-10 max-w-[1400px]">
          <p className="text-center font-mono text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-accent mb-6 sm:mb-8 md:mb-10">
            <InlineEdit
              id="about_v3_diff_eyebrow"
              as="span"
              isEditing={isEditing}
              value={getDraftValue("about_v3_diff_eyebrow", "—  What Makes Us Different  —")}
              onChange={(v) => updateDraft("about_v3_diff_eyebrow", v)}
            />
          </p>

          <h2 className="text-center font-heading uppercase leading-[0.95] tracking-[-0.02em] text-foreground text-[36px] sm:text-[60px] md:text-[80px] lg:text-[96px] max-w-5xl mx-auto mb-10 sm:mb-14 md:mb-24 text-balance">
            <InlineEdit
              id="about_v3_diff_heading_1"
              as="span"
              isEditing={isEditing}
              value={getDraftValue("about_v3_diff_heading_1", "What Makes Us")}
              onChange={(v) => updateDraft("about_v3_diff_heading_1", v)}
            />
            {" "}
            <InlineEdit
              id="about_v3_diff_heading_2"
              as="span"
              className="italic font-serif font-normal text-primary lowercase tracking-tight"
              isEditing={isEditing}
              value={getDraftValue("about_v3_diff_heading_2", "different.")}
              onChange={(v) => updateDraft("about_v3_diff_heading_2", v)}
            />
          </h2>

          <div className="max-w-5xl mx-auto border-t border-foreground/15">
            <article className="grid md:grid-cols-12 gap-3 sm:gap-4 md:gap-8 py-7 sm:py-9 md:py-14 border-b border-foreground/15 items-baseline">
              <div className="md:col-span-2">
                <span className="font-heading text-[56px] sm:text-[64px] md:text-[88px] leading-[0.85] text-primary block">01</span>
              </div>
              <div className="md:col-span-4">
                <InlineEdit
                  id="about_v3_pillar_1_title"
                  as="h3"
                  className="font-heading uppercase text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-[0.95] tracking-tight text-foreground block text-balance"
                  isEditing={isEditing}
                  value={getDraftValue("about_v3_pillar_1_title", "Flavor in the Batter")}
                  onChange={(v) => updateDraft("about_v3_pillar_1_title", v)}
                />
              </div>
              <div className="md:col-span-6">
                <InlineEdit
                  id="about_v3_pillar_1_body"
                  as="p"
                  className="font-serif text-base sm:text-lg md:text-xl leading-[1.5] text-foreground/80 block text-pretty"
                  isEditing={isEditing}
                  multiline
                  value={getDraftValue(
                    "about_v3_pillar_1_body",
                    "We use homemade spices in our batter so our halal fried chicken tastes crispy, juicy, and full of flavor with or without sauce."
                  )}
                  onChange={(v) => updateDraft("about_v3_pillar_1_body", v)}
                />
              </div>
            </article>

            <article className="grid md:grid-cols-12 gap-3 sm:gap-4 md:gap-8 py-7 sm:py-9 md:py-14 border-b border-foreground/15 items-baseline">
              <div className="md:col-span-2">
                <span className="font-heading text-[56px] sm:text-[64px] md:text-[88px] leading-[0.85] text-primary block">02</span>
              </div>
              <div className="md:col-span-4">
                <InlineEdit
                  id="about_v3_pillar_2_title"
                  as="h3"
                  className="font-heading uppercase text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-[0.95] tracking-tight text-foreground block text-balance"
                  isEditing={isEditing}
                  value={getDraftValue("about_v3_pillar_2_title", "Halal for Everyone")}
                  onChange={(v) => updateDraft("about_v3_pillar_2_title", v)}
                />
              </div>
              <div className="md:col-span-6">
                <InlineEdit
                  id="about_v3_pillar_2_body"
                  as="p"
                  className="font-serif text-base sm:text-lg md:text-xl leading-[1.5] text-foreground/80 block text-pretty"
                  isEditing={isEditing}
                  multiline
                  value={getDraftValue(
                    "about_v3_pillar_2_body",
                    "We made the full menu halal at both our Queens locations, giving customers in Astoria and Flushing more ways to enjoy fried chicken, wings, sandwiches, and comfort food without compromise."
                  )}
                  onChange={(v) => updateDraft("about_v3_pillar_2_body", v)}
                />
              </div>
            </article>

            <article className="grid md:grid-cols-12 gap-3 sm:gap-4 md:gap-8 py-7 sm:py-9 md:py-14 items-baseline">
              <div className="md:col-span-2">
                <span className="font-heading text-[56px] sm:text-[64px] md:text-[88px] leading-[0.85] text-primary block">03</span>
              </div>
              <div className="md:col-span-4">
                <InlineEdit
                  id="about_v3_pillar_3_title"
                  as="h3"
                  className="font-heading uppercase text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-[0.95] tracking-tight text-foreground block text-balance"
                  isEditing={isEditing}
                  value={getDraftValue("about_v3_pillar_3_title", "Comfort Food With Character")}
                  onChange={(v) => updateDraft("about_v3_pillar_3_title", v)}
                />
              </div>
              <div className="md:col-span-6">
                <InlineEdit
                  id="about_v3_pillar_3_body"
                  as="p"
                  className="font-serif text-base sm:text-lg md:text-xl leading-[1.5] text-foreground/80 block text-pretty"
                  isEditing={isEditing}
                  multiline
                  value={getDraftValue(
                    "about_v3_pillar_3_body",
                    "From crispy halal chicken sandwiches and wings to rice bowls and spaghetti combos, Chick Rocks offers more than fried chicken with a menu full of halal comfort food favorites in Queens."
                  )}
                  onChange={(v) => updateDraft("about_v3_pillar_3_body", v)}
                />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-24 bg-card">
        <div className="container mx-auto px-5 sm:px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center md:min-h-[520px]">
            <div className="max-w-2xl space-y-4 sm:space-y-5 md:space-y-6 order-2 md:order-1 md:justify-self-end md:pr-4">
              <InlineEdit
                id="about_page_section_2_eyebrow"
                as="p"
                className="text-accent font-bold uppercase tracking-wide text-xs sm:text-sm block"
                isEditing={isEditing}
                value={getDraftValue("about_page_section_2_eyebrow", "Built for Everyday Cravings")}
                onChange={(v) => updateDraft("about_page_section_2_eyebrow", v)}
              />
              <InlineEdit
                id="about_page_section_2_heading"
                as="h2"
                className="text-3xl sm:text-4xl md:text-5xl font-heading uppercase leading-tight text-foreground block text-balance"
                isEditing={isEditing}
                value={getDraftValue("about_page_section_2_heading", "More Than Just Fried Chicken")}
                onChange={(v) => updateDraft("about_page_section_2_heading", v)}
              />
              <InlineEdit
                id="about_page_section_2_body"
                as="p"
                className="text-sm sm:text-base text-muted-foreground leading-relaxed block text-pretty"
                isEditing={isEditing}
                multiline
                value={getDraftValue(
                  "about_page_section_2_body",
                  "From halal fried chicken and signature chicken sandwiches to wings, rice bowls, and spaghetti combos, Chick Rocks serves bold comfort food inspired by Queens. Whether you are stopping by our Astoria or Flushing location for a quick bite, ordering takeout, or planning your next meal, our menu is made for big flavor and satisfying halal meals."
                )}
                onChange={(v) => updateDraft("about_page_section_2_body", v)}
              />
            </div>

            <MediaEdit
              id="about_page_img_2"
              isEditing={isEditing}
              value={getDraftValue("about_page_img_2", `${base}uploads/2026/05/Fired-Chicken-Chickrocks-USA-scaled.jpg`)}
              onChange={(v) => updateDraft("about_page_img_2", v)}
              className="flex justify-center md:justify-end order-1 md:order-2"
            >
              <img
                src={getDraftValue("about_page_img_2", `${base}uploads/2026/05/Fired-Chicken-Chickrocks-USA-scaled.jpg`)}
                alt="Chick Rocks menu favorites including sandwiches, rice bowls, and sides"
                loading="lazy"
                className="w-full max-w-[600px] h-auto max-h-[560px] object-contain rounded-3xl"
              />
            </MediaEdit>
          </div>
        </div>
      </section>

      <section className="relative bg-cream text-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none [background-image:radial-gradient(theme(colors.primary.DEFAULT)_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="container mx-auto px-5 sm:px-6 md:px-10 py-12 sm:py-16 md:py-24 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
            <div className="relative order-1 max-w-xl mx-auto">
              <div className="absolute -inset-2 md:-inset-4 rounded-[3rem] bg-primary/10 -rotate-3" aria-hidden />
              <MediaEdit
                id="about_page_cta_image"
                isEditing={isEditing}
                value={getDraftValue("about_page_cta_image", `${base}uploads/2026/05/Fired-Chicken-Chickrocks-USA-2-scaled.jpg`)}
                onChange={(v) => updateDraft("about_page_cta_image", v)}
                className="relative block aspect-[4/3] rounded-[2.5rem] overflow-hidden ring-2 ring-primary/20 shadow-2xl"
              >
                <img
                  src={getDraftValue("about_page_cta_image", `${base}uploads/2026/05/Fired-Chicken-Chickrocks-USA-2-scaled.jpg`)}
                  alt="Chick Rocks halal fried chicken plate"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </MediaEdit>
              <Sparkle className="absolute -top-2 -left-2 md:-top-4 md:-left-6 w-10 md:w-14 text-primary rotate-12" style={{ animationDelay: "0s" }} />
              <Sparkle className="absolute top-1/3 -right-3 md:-right-6 w-7 md:w-10 text-accent -rotate-12" style={{ animationDelay: "0.7s" }} />
              <Sparkle className="absolute -bottom-3 left-10 md:left-16 w-9 md:w-12 text-primary rotate-45" style={{ animationDelay: "1.4s" }} />
              <Sparkle className="absolute bottom-1/4 -left-4 md:-left-8 w-6 md:w-8 text-accent/80" style={{ animationDelay: "2.1s" }} />
            </div>

            <div className="order-2 space-y-4 sm:space-y-5 md:space-y-6">
              <InlineEdit
                id="about_page_belief_eyebrow"
                as="p"
                className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-primary block"
                isEditing={isEditing}
                value={getDraftValue("about_page_belief_eyebrow", "Dig In")}
                onChange={(v) => updateDraft("about_page_belief_eyebrow", v)}
              />
              <InlineEdit
                id="about_page_belief_heading"
                as="h2"
                className="font-heading uppercase text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[0.95] tracking-wide text-foreground block text-balance"
                isEditing={isEditing}
                value={getDraftValue("about_page_belief_heading", "Taste the Difference")}
                onChange={(v) => updateDraft("about_page_belief_heading", v)}
              />
              <InlineEdit
                id="about_page_belief_body"
                as="p"
                className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-md block text-pretty"
                isEditing={isEditing}
                multiline
                value={getDraftValue(
                  "about_page_belief_body",
                  "Crispy fried chicken, sandwiches, wings, and comfort food favorites made for big flavor. Order Chick Rocks online from our Flushing or Astoria location."
                )}
                onChange={(v) => updateDraft("about_page_belief_body", v)}
              />
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                <a
                  href="https://pos.chowbus.com/online-ordering/store/chick-rocks/11843"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-primary text-primary-foreground px-7 py-3.5 rounded-full font-bold uppercase tracking-wide hover:translate-y-[-2px] hover:shadow-lg transition-all duration-200"
                >
                  <InlineEdit
                    id="about_page_cta_flushing"
                    as="span"
                    isEditing={isEditing}
                    value={getDraftValue("about_page_cta_flushing", "Order Flushing Location")}
                    onChange={(v) => updateDraft("about_page_cta_flushing", v)}
                  />
                </a>
                <a
                  href="https://pos.chowbus.com/online-ordering/store/chick-rocks-astoria/20957"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center border-2 border-primary text-primary px-7 py-3.5 rounded-full font-bold uppercase tracking-wide hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                >
                  <InlineEdit
                    id="about_page_cta_astoria"
                    as="span"
                    isEditing={isEditing}
                    value={getDraftValue("about_page_cta_astoria", "Order Astoria Location")}
                    onChange={(v) => updateDraft("about_page_cta_astoria", v)}
                  />
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

export default About;
