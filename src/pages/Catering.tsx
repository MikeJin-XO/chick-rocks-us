import { useState } from "react";
import { Users, Clock, Utensils } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo, { breadcrumbLd, SITE } from "@/components/Seo";
import { useEdit } from "@/contexts/EditContext";
import { InlineEdit } from "@/components/ui/inline-edit";
import { MediaEdit } from "@/components/ui/media-edit";
import CateringMenuComingSoonModal from "@/components/CateringMenuComingSoonModal";
import CateringOrderComingSoonModal from "@/components/CateringOrderComingSoonModal";
import CateringLeadFormModal from "@/components/CateringLeadFormModal";

const cateringLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Chick Rocks Halal Catering",
  serviceType: "Halal Catering",
  areaServed: [
    { "@type": "City", name: "Queens" },
    { "@type": "City", name: "New York" },
  ],
  provider: {
    "@type": "Restaurant",
    name: SITE.NAME,
    url: SITE.URL,
  },
  url: `${SITE.URL}/catering`,
  description:
    "Halal catering for offices, parties, weddings and events across Queens and NYC. Family combos, sandwich platters, wing buckets, rice bowl bars and drinks.",
};

const cateringCrumbsLd = breadcrumbLd([
  { name: "Home", path: "/" },
  { name: "Catering", path: "/catering" },
]);

const Catering = () => {
  const { isEditing, getDraftValue, updateDraft } = useEdit();
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [orderComingSoonOpen, setOrderComingSoonOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const base = import.meta.env.BASE_URL;
  const defaultSection1 = `${base}uploads/2026/05/Chick-Rocks-halal-fried-chicken-catering.png`;
  const defaultSection2 = `${base}uploads/2026/04/Packages-Built-Around-Your-Event-Chickrocks-USA-scaled.jpg`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo
        title="Halal Catering in Queens & NYC | Chick Rocks Catering"
        description="Halal catering for offices, parties, weddings and events across Queens and NYC. Family combos, sandwich platters, wing buckets, rice bowl bars — Chick Rocks delivers fresh, crispy halal fried chicken to your next event."
        path="/catering"
        keywords="halal catering queens, halal catering nyc, halal office catering, halal event catering astoria, chick rocks catering"
        image={`${SITE.URL}/catering-1.avif`}
        imageAlt="Chick Rocks halal catering spread with chicken platters and sides"
        jsonLd={[cateringLd, cateringCrumbsLd]}
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
            id="catering_page_hero_logo"
            isEditing={isEditing}
            value={getDraftValue("catering_page_hero_logo", `${base}logo.webp`)}
            onChange={(v) => updateDraft("catering_page_hero_logo", v)}
          >
            <img
              src={getDraftValue("catering_page_hero_logo", `${base}logo.webp`)}
              alt="Chick Rocks halal fried chicken logo"
              className="h-12 sm:h-14 md:h-16 w-auto brightness-0 invert"
            />
          </MediaEdit>

          <div className="mt-4 sm:mt-5 flex items-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.32em] opacity-80">
            <span aria-hidden className="h-px w-8 sm:w-10 bg-primary-foreground/60" />
            <span>Group Orders · Events</span>
            <span aria-hidden className="h-px w-8 sm:w-10 bg-primary-foreground/60" />
          </div>

          <InlineEdit
            id="catering_page_title"
            as="h1"
            className="mt-3 sm:mt-4 font-heading uppercase tracking-wide text-balance text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] leading-[1] block"
            isEditing={isEditing}
            value={getDraftValue("catering_page_title", "Fried Chicken Catering in Queens &amp; NYC")}
            onChange={(v) => updateDraft("catering_page_title", v)}
          />

          <div aria-hidden className="mt-4 sm:mt-5 flex items-center gap-2 opacity-70">
            <span className="h-px w-8 bg-primary-foreground" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
            <span className="h-px w-8 bg-primary-foreground" />
          </div>

          <InlineEdit
            id="catering_page_hero_subtext"
            as="p"
            className="mt-3 sm:mt-4 text-[13px] sm:text-sm md:text-[15px] leading-relaxed opacity-90 max-w-3xl mx-auto block text-pretty"
            isEditing={isEditing}
            multiline
            value={getDraftValue(
              "catering_page_hero_subtext",
              "Crowd-pleasing trays, sandwich platters, wings, rice bowls, and party packages for office lunches, birthdays, and special events. All catering is 100% halal."
            )}
            onChange={(v) => updateDraft("catering_page_hero_subtext", v)}
          />

          <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setMenuModalOpen(true)}
              className="inline-flex items-center justify-center bg-primary-foreground text-primary px-7 py-3 rounded-full font-bold uppercase tracking-wide shadow-lg shadow-black/10 hover:translate-y-[-2px] hover:shadow-xl transition-all duration-200 w-full sm:w-auto sm:min-w-[200px]"
            >
              <InlineEdit
                id="catering_page_hero_cta_primary"
                as="span"
                isEditing={isEditing}
                value={getDraftValue("catering_page_hero_cta_primary", "See Catering Menu")}
                onChange={(v) => updateDraft("catering_page_hero_cta_primary", v)}
              />
            </button>
            <button
              type="button"
              onClick={() => setOrderComingSoonOpen(true)}
              className="inline-flex items-center justify-center border-2 border-primary-foreground text-primary-foreground px-7 py-3 rounded-full font-bold uppercase tracking-wide hover:bg-primary-foreground hover:text-primary transition-colors duration-200 w-full sm:w-auto sm:min-w-[200px]"
            >
              <InlineEdit
                id="catering_page_hero_cta_secondary"
                as="span"
                isEditing={isEditing}
                value={getDraftValue("catering_page_hero_cta_secondary", "Order Catering")}
                onChange={(v) => updateDraft("catering_page_hero_cta_secondary", v)}
              />
            </button>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-24 bg-cream">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center md:min-h-[520px]">
            <MediaEdit
              id="catering_page_img_1"
              isEditing={isEditing}
              value={getDraftValue("catering_page_img_1", defaultSection1)}
              onChange={(v) => updateDraft("catering_page_img_1", v)}
              className="flex justify-center"
            >
              <img
                src={getDraftValue("catering_page_img_1", defaultSection1)}
                alt="Chick Rocks catering spread with chicken platters and sides"
                loading="lazy"
                className="max-w-full max-h-[560px] w-auto h-auto object-contain rounded-3xl block"
              />
            </MediaEdit>

            <div className="max-w-2xl space-y-4 sm:space-y-5 md:space-y-6 md:justify-self-start md:pl-4">
              <InlineEdit
                id="catering_page_section_1_eyebrow"
                as="p"
                className="text-accent font-bold uppercase tracking-wide text-xs sm:text-sm block"
                isEditing={isEditing}
                value={getDraftValue("catering_page_section_1_eyebrow", "Feed The Whole Crew")}
                onChange={(v) => updateDraft("catering_page_section_1_eyebrow", v)}
              />
              <InlineEdit
                id="catering_page_section_1_heading"
                as="h2"
                className="text-3xl sm:text-4xl md:text-5xl font-heading uppercase leading-tight text-foreground block text-balance"
                isEditing={isEditing}
                value={getDraftValue("catering_page_section_1_heading", "Big Flavor for Every Event")}
                onChange={(v) => updateDraft("catering_page_section_1_heading", v)}
              />
              <InlineEdit
                id="catering_page_section_1_body"
                as="p"
                className="text-sm sm:text-base text-muted-foreground leading-relaxed block text-pretty"
                isEditing={isEditing}
                multiline
                value={getDraftValue(
                  "catering_page_section_1_body",
                  "From office lunches and team meetings to birthdays, parties, and holiday gatherings, Chick Rocks catering makes feeding a crowd easy. Choose from fried chicken, signature sandwiches, wings, rice bowls, spaghetti combos, and sides made fresh and packed to share. Every catering order is fully halal."
                )}
                onChange={(v) => updateDraft("catering_page_section_1_body", v)}
              />
              <div className="grid sm:grid-cols-3 gap-6 pt-4">
                <div className="flex flex-col items-center text-center gap-3 text-sm">
                  <Users className="w-7 h-7 text-primary" strokeWidth={1.75} />
                  <InlineEdit
                    id="catering_page_feature_1"
                    as="span"
                    className="font-semibold text-foreground block text-balance leading-snug"
                    isEditing={isEditing}
                    value={getDraftValue("catering_page_feature_1", "Serves 10–200+")}
                    onChange={(v) => updateDraft("catering_page_feature_1", v)}
                  />
                </div>
                <div className="flex flex-col items-center text-center gap-3 text-sm">
                  <Utensils className="w-7 h-7 text-primary" strokeWidth={1.75} />
                  <InlineEdit
                    id="catering_page_feature_2"
                    as="span"
                    className="font-semibold text-foreground block text-balance leading-snug"
                    isEditing={isEditing}
                    value={getDraftValue("catering_page_feature_2", "Custom Catering Packages")}
                    onChange={(v) => updateDraft("catering_page_feature_2", v)}
                  />
                </div>
                <div className="flex flex-col items-center text-center gap-3 text-sm">
                  <Clock className="w-7 h-7 text-primary" strokeWidth={1.75} />
                  <InlineEdit
                    id="catering_page_feature_3"
                    as="span"
                    className="font-semibold text-foreground block text-balance leading-snug"
                    isEditing={isEditing}
                    value={getDraftValue("catering_page_feature_3", "48-Hour Notice Recommended")}
                    onChange={(v) => updateDraft("catering_page_feature_3", v)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center md:min-h-[520px]">
            <div className="max-w-2xl space-y-4 sm:space-y-5 md:space-y-6 order-2 md:order-1 md:justify-self-end md:pr-4">
              <InlineEdit
                id="catering_page_section_2_eyebrow"
                as="p"
                className="text-accent font-bold uppercase tracking-wide text-xs sm:text-sm block"
                isEditing={isEditing}
                value={getDraftValue("catering_page_section_2_eyebrow", "Packages Made Simple")}
                onChange={(v) => updateDraft("catering_page_section_2_eyebrow", v)}
              />
              <InlineEdit
                id="catering_page_section_2_heading"
                as="h2"
                className="text-3xl sm:text-4xl md:text-5xl font-heading uppercase leading-tight text-foreground block text-balance"
                isEditing={isEditing}
                value={getDraftValue("catering_page_section_2_heading", "CATERING PACKAGES THAT FIT")}
                onChange={(v) => updateDraft("catering_page_section_2_heading", v)}
              />
              <InlineEdit
                id="catering_page_section_2_body"
                as="p"
                className="text-sm sm:text-base text-muted-foreground leading-relaxed block text-pretty"
                isEditing={isEditing}
                multiline
                value={getDraftValue(
                  "catering_page_section_2_body",
                  "Choose from fried chicken trays, sandwich platters, wing buckets, rice bowl packages, spaghetti combos, sides, and drink trays. Whether you need a simple pickup order or a larger catering setup, our Flushing and Astoria locations can help you build a menu that fits. Every catering order is fully halal."
                )}
                onChange={(v) => updateDraft("catering_page_section_2_body", v)}
              />
            </div>

            <MediaEdit
              id="catering_page_img_2"
              isEditing={isEditing}
              value={getDraftValue("catering_page_img_2", defaultSection2)}
              onChange={(v) => updateDraft("catering_page_img_2", v)}
              className="flex justify-center order-1 md:order-2"
            >
              <img
                src={getDraftValue("catering_page_img_2", defaultSection2)}
                alt="Chick Rocks catering packages and shareable platters"
                loading="lazy"
                className="max-w-full max-h-[560px] w-auto h-auto object-contain rounded-3xl block"
              />
            </MediaEdit>
          </div>
        </div>
      </section>

      <section id="catering-order" className="py-12 sm:py-16 md:py-24 bg-cream scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-5 md:space-y-6">
            <InlineEdit
              id="catering_page_cta_eyebrow"
              as="p"
              className="text-accent font-bold uppercase tracking-wide text-xs sm:text-sm block"
              isEditing={isEditing}
              value={getDraftValue("catering_page_cta_eyebrow", "Ready To Order")}
              onChange={(v) => updateDraft("catering_page_cta_eyebrow", v)}
            />
            <InlineEdit
              id="catering_page_cta_heading"
              as="h2"
              className="text-3xl sm:text-4xl md:text-5xl font-heading uppercase leading-tight text-foreground block text-balance"
              isEditing={isEditing}
              value={getDraftValue("catering_page_cta_heading", "Ready to Feed the Crowd?")}
              onChange={(v) => updateDraft("catering_page_cta_heading", v)}
            />
            <InlineEdit
              id="catering_page_cta_body"
              as="p"
              className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed block text-pretty"
              isEditing={isEditing}
              multiline
              value={getDraftValue(
                "catering_page_cta_body",
                "View our catering menu, place your order, or contact Chick Rocks to build a custom package for office lunches, birthdays, parties, and special events."
              )}
              onChange={(v) => updateDraft("catering_page_cta_body", v)}
            />
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <button
                type="button"
                onClick={() => setMenuModalOpen(true)}
                className="inline-block bg-primary text-primary-foreground px-10 py-4 rounded-full font-bold uppercase tracking-wide hover:opacity-90 transition-opacity"
              >
                <InlineEdit
                  id="catering_page_cta_primary"
                  as="span"
                  isEditing={isEditing}
                  value={getDraftValue("catering_page_cta_primary", "See Catering Menu")}
                  onChange={(v) => updateDraft("catering_page_cta_primary", v)}
                />
              </button>
              <button
                type="button"
                onClick={() => setOrderComingSoonOpen(true)}
                className="inline-block bg-primary text-primary-foreground px-10 py-4 rounded-full font-bold uppercase tracking-wide hover:opacity-90 transition-opacity"
              >
                <InlineEdit
                  id="catering_page_cta_secondary"
                  as="span"
                  isEditing={isEditing}
                  value={getDraftValue("catering_page_cta_secondary", "Order Catering")}
                  onChange={(v) => updateDraft("catering_page_cta_secondary", v)}
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <CateringMenuComingSoonModal open={menuModalOpen} onClose={() => setMenuModalOpen(false)} />
      <CateringOrderComingSoonModal open={orderComingSoonOpen} onClose={() => setOrderComingSoonOpen(false)} />
      <CateringLeadFormModal open={leadModalOpen} onClose={() => setLeadModalOpen(false)} />
    </div>
  );
};

export default Catering;
