import { useState } from "react";
import { Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo, { breadcrumbLd } from "@/components/Seo";
import { useEdit } from "@/contexts/EditContext";
import { useOrderModal } from "@/contexts/OrderModalContext";
import { InlineEdit } from "@/components/ui/inline-edit";
import { MediaEdit } from "@/components/ui/media-edit";

const faqSections = [
  {
    title: "About Chick Rocks",
    items: [
      {
        q: "What is halal?",
        a: "Halal means food that is prepared in a way that follows Islamic dietary guidelines. At Chick Rocks, our menu is halal so customers looking for halal fried chicken, sandwiches, rice bowls, and comfort food in Queens can order with confidence.",
      },
      {
        q: "Is all of the food at Chick Rocks halal?",
        a: "Yes, all menu items at Chick Rocks are halal. We created our menu to serve the growing demand for flavorful halal fried chicken, sandwiches, wings, rice bowls, spaghetti combos, and more in Astoria and Flushing.",
      },
      {
        q: "What makes Chick Rocks different from other fried chicken spots?",
        a: "Chick Rocks stands out because our fried chicken is seasoned for flavor in every bite. Instead of relying only on dipping sauces, we use homemade spices in the batter so the chicken tastes crispy, juicy, and satisfying on its own.",
      },
      {
        q: "What kind of food does Chick Rocks serve?",
        a: "Chick Rocks serves halal fried chicken, chicken sandwiches, wings, rice bowls, spaghetti combos, burgers, wraps, sides, desserts, and drinks. Our menu is built around bold flavor, comfort food, and everyday cravings.",
      },
      {
        q: "Do you have allergen or dietary information available?",
        a: "If you have food allergies or dietary questions, please contact Chick Rocks before ordering. Our team can help you review menu options and answer questions about ingredients, preparation, and halal menu items.",
      },
      {
        q: "Do you have spicy and mild chicken options?",
        a: "Yes, Chick Rocks offers bold flavor profiles for different tastes, including options for customers who prefer milder comfort food or a spicier fried chicken experience.",
      },
    ],
  },
  {
    title: "Ordering & Locations",
    items: [
      {
        q: "Where are your locations and what are your hours?",
        a: "We have two locations in Queens, New York: Chick Rocks Astoria at 30-02 Steinway St, Astoria, NY 11103, and Chick Rocks Flushing at 136-20 Roosevelt Ave #25, Flushing, NY 11354. Both stores serve halal fried chicken for dine-in, takeout and delivery. Please check our Google Business Profile for up-to-date daily hours.",
      },
      {
        q: "Do you offer family meals or combo meals?",
        a: "Yes, Chick Rocks offers combo meals and family-style options designed for sharing, making it easy to order for groups, families, or team meals.",
      },
      {
        q: "Can I order online?",
        a: "Yes, customers can order Chick Rocks online for quick and convenient pickup or delivery, depending on location availability.",
      },
      {
        q: "Do you have current promotions or specials?",
        a: "Yes, Chick Rocks may offer current promotions, combo specials, or limited-time menu items. Check our menu, homepage, or ordering page for the latest deals.",
      },
    ],
  },
  {
    title: "Catering & Events",
    items: [
      {
        q: "Does Chick Rocks offer catering?",
        a: "Yes, Chick Rocks offers halal catering for office lunches, birthday parties, team meals, family gatherings, and special events in Queens and NYC. Our catering menu includes fried chicken, sandwich platters, wings, rice bowls, spaghetti combos, sides, and drink options.",
      },
      {
        q: "How far in advance should I place a catering order?",
        a: "For the best availability, we recommend placing catering orders in advance. Lead time may vary depending on order size, menu selection, and location, so it is best to contact Chick Rocks early for large group orders, office catering, or special events.",
      },
      {
        q: "Are there options for large groups or custom catering packages?",
        a: "Yes, Chick Rocks can help with group orders and catering packages for different event sizes. Whether you need food for a small office lunch or a larger party, our team can help you choose the right halal catering menu for your event.",
      },
      {
        q: "Can I order Chick Rocks for office lunches?",
        a: "Yes, Chick Rocks is a great choice for office lunch catering in Queens and NYC, with halal fried chicken, sandwich platters, sides, and shareable group meals.",
      },
    ],
  },
];

const flatFaqItems = faqSections.flatMap((s) => s.items);

const Faq = () => {
  const { isEditing, getDraftValue, updateDraft } = useEdit();
  const { open: openOrderModal } = useOrderModal();
  const base = import.meta.env.BASE_URL;
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (idx: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const faqPageLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: flatFaqItems.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const crumbsLd = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "FAQ", path: "/faq" },
  ]);

  let itemCounter = 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo
        title="Halal Fried Chicken FAQ — Astoria & Flushing | Chick Rocks"
        description="Answers to common questions about Chick Rocks: halal certification, locations, hours, delivery, catering minimums, allergens and more."
        path="/faq"
        keywords="halal fried chicken faq, chick rocks halal, halal catering queens faq, halal chicken astoria"
        jsonLd={[faqPageLd, crumbsLd]}
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
            id="faq_page_hero_logo"
            isEditing={isEditing}
            value={getDraftValue("faq_page_hero_logo", `${base}logo.webp`)}
            onChange={(v) => updateDraft("faq_page_hero_logo", v)}
          >
            <img
              src={getDraftValue("faq_page_hero_logo", `${base}logo.webp`)}
              alt="Chick Rocks halal fried chicken logo"
              className="h-12 sm:h-14 md:h-16 w-auto brightness-0 invert"
            />
          </MediaEdit>

          <div className="mt-4 sm:mt-5 flex items-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.32em] opacity-80">
            <span aria-hidden className="h-px w-8 sm:w-10 bg-primary-foreground/60" />
            <span>Help · Answers</span>
            <span aria-hidden className="h-px w-8 sm:w-10 bg-primary-foreground/60" />
          </div>

          <InlineEdit
            id="faq_page_title"
            as="h1"
            className="mt-3 sm:mt-4 font-heading uppercase tracking-wide text-balance text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] leading-[1] block"
            isEditing={isEditing}
            value={getDraftValue("faq_page_title", "Halal Fried Chicken FAQ")}
            onChange={(v) => updateDraft("faq_page_title", v)}
          />

          <div aria-hidden className="mt-4 sm:mt-5 flex items-center gap-2 opacity-70">
            <span className="h-px w-8 bg-primary-foreground" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
            <span className="h-px w-8 bg-primary-foreground" />
          </div>

          <InlineEdit
            id="faq_page_hero_subtext"
            as="p"
            className="mt-3 sm:mt-4 text-[13px] sm:text-sm md:text-[15px] leading-relaxed opacity-90 max-w-3xl mx-auto block text-pretty"
            isEditing={isEditing}
            multiline
            value={getDraftValue(
              "faq_page_hero_subtext",
              "Everything you need to know about Chick Rocks halal fried chicken, sandwiches, catering, ordering, and our Astoria and Flushing locations."
            )}
            onChange={(v) => updateDraft("faq_page_hero_subtext", v)}
          />
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 py-10 sm:py-12 md:py-16 max-w-3xl">
        <div className="space-y-10 md:space-y-14">
          {faqSections.map((section, sectionIndex) => (
            <section key={section.title} className="space-y-5 sm:space-y-6 md:space-y-8">
              <InlineEdit
                id={`faq_section_${sectionIndex + 1}_title`}
                as="h2"
                className="text-2xl sm:text-3xl font-heading uppercase text-foreground tracking-wide block text-balance"
                isEditing={isEditing}
                value={getDraftValue(
                  `faq_section_${sectionIndex + 1}_title`,
                  section.title
                )}
                onChange={(v) =>
                  updateDraft(`faq_section_${sectionIndex + 1}_title`, v)
                }
              />
              <div className="divide-y divide-border border-y border-border">
                {section.items.map((item) => {
                  itemCounter += 1;
                  const idx = itemCounter;
                  const isOpen = isEditing || openItems.has(idx);
                  return (
                    <article key={item.q}>
                      <button
                        type="button"
                        onClick={() => !isEditing && toggleItem(idx)}
                        aria-expanded={isOpen}
                        aria-controls={`faq_a_panel_${idx}`}
                        className="w-full flex items-start justify-between gap-4 sm:gap-6 py-4 sm:py-5 text-left hover:text-primary transition-colors"
                      >
                        <InlineEdit
                          id={`faq_q_${idx}`}
                          as="h3"
                          className="text-base md:text-lg font-body font-normal text-foreground leading-snug block text-pretty"
                          isEditing={isEditing}
                          value={getDraftValue(`faq_q_${idx}`, item.q)}
                          onChange={(v) => updateDraft(`faq_q_${idx}`, v)}
                        />
                        <Plus
                          aria-hidden="true"
                          className={`shrink-0 w-5 h-5 mt-1 text-muted-foreground transition-transform duration-300 ${
                            isOpen ? "rotate-45" : ""
                          }`}
                        />
                      </button>
                      <div
                        id={`faq_a_panel_${idx}`}
                        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <InlineEdit
                            id={`faq_a_${idx}`}
                            as="p"
                            className="text-sm sm:text-base leading-relaxed text-muted-foreground block pb-4 sm:pb-5 pr-8 sm:pr-11 text-pretty"
                            isEditing={isEditing}
                            multiline
                            value={getDraftValue(`faq_a_${idx}`, item.a)}
                            onChange={(v) => updateDraft(`faq_a_${idx}`, v)}
                          />
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-12 sm:mt-14 md:mt-16 bg-cream rounded-2xl p-6 sm:p-8 text-center space-y-3 sm:space-y-4">
          <InlineEdit
            id="faq_bottom_heading"
            as="h2"
            className="text-2xl sm:text-3xl font-heading uppercase text-foreground block text-balance"
            isEditing={isEditing}
            value={getDraftValue("faq_bottom_heading", "Still have a question?")}
            onChange={(v) => updateDraft("faq_bottom_heading", v)}
          />
          <InlineEdit
            id="faq_bottom_body"
            as="p"
            className="text-sm sm:text-base text-muted-foreground leading-relaxed block text-pretty"
            isEditing={isEditing}
            multiline
            value={getDraftValue(
              "faq_bottom_body",
              "Reach out about halal catering in Queens, allergens, large orders, or anything else — we're happy to help."
            )}
            onChange={(v) => updateDraft("faq_bottom_body", v)}
          />
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href="mailto:catering@chickrocks.com"
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold uppercase tracking-wide hover:opacity-90 transition-opacity"
            >
              <InlineEdit
                id="faq_bottom_cta_primary"
                as="span"
                isEditing={isEditing}
                value={getDraftValue("faq_bottom_cta_primary", "Email Us")}
                onChange={(v) => updateDraft("faq_bottom_cta_primary", v)}
              />
            </a>
            <button
              type="button"
              onClick={openOrderModal}
              className="inline-block bg-card border border-border text-foreground px-8 py-3 rounded-full font-bold uppercase tracking-wide hover:border-primary hover:text-primary transition-colors"
            >
              <InlineEdit
                id="faq_bottom_cta_secondary"
                as="span"
                isEditing={isEditing}
                value={getDraftValue("faq_bottom_cta_secondary", "Order Online")}
                onChange={(v) => updateDraft("faq_bottom_cta_secondary", v)}
              />
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Faq;
