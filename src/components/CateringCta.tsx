import { Link } from "react-router-dom";
import { useEdit } from "@/contexts/EditContext";
import { InlineEdit } from "@/components/ui/inline-edit";
import { MediaEdit } from "@/components/ui/media-edit";

const CateringCta = () => {
  const { isEditing, getDraftValue, updateDraft } = useEdit();
  const base = import.meta.env.BASE_URL;
  const defaultImg = `${base}uploads/2026/05/Share-Food-Chickrocks-USA-scaled.jpg`;

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-cream">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center md:min-h-[600px]">
          <MediaEdit
            id="home_catering_img"
            isEditing={isEditing}
            value={getDraftValue("home_catering_img", defaultImg)}
            onChange={(v) => updateDraft("home_catering_img", v)}
            className="flex justify-center md:justify-end order-1 md:order-2"
          >
            <img
              src={getDraftValue("home_catering_img", defaultImg)}
              alt="Chick Rocks catering spread"
              loading="lazy"
              className="w-full max-w-[600px] h-auto max-h-[600px] object-contain rounded-3xl"
            />
          </MediaEdit>

          <div className="max-w-2xl space-y-4 sm:space-y-5 md:space-y-6 order-2 md:order-1 md:justify-self-end md:pr-4">
            <InlineEdit
              id="home_catering_eyebrow"
              as="p"
              className="text-accent font-bold uppercase tracking-wide text-xs sm:text-sm block"
              isEditing={isEditing}
              value={getDraftValue("home_catering_eyebrow", "Cater With Chick Rocks")}
              onChange={(v) => updateDraft("home_catering_eyebrow", v)}
            />
            <InlineEdit
              id="home_catering_heading"
              as="h2"
              className="text-3xl sm:text-4xl md:text-5xl font-heading uppercase leading-tight text-foreground block text-balance"
              isEditing={isEditing}
              value={getDraftValue("home_catering_heading", "Halal Catering for Every Crew")}
              onChange={(v) => updateDraft("home_catering_heading", v)}
            />
            <InlineEdit
              id="home_catering_body"
              as="p"
              className="text-sm sm:text-base text-muted-foreground leading-relaxed block text-pretty"
              isEditing={isEditing}
              multiline
              value={getDraftValue(
                "home_catering_body",
                "Make your next event easy with Chick Rocks halal chicken catering in Queens. From crispy fried chicken and sandwiches to rice bowls, sides, and party trays, we help feed office lunches, school events, birthdays, and family gatherings in Astoria and Flushing."
              )}
              onChange={(v) => updateDraft("home_catering_body", v)}
            />
            <Link
              to="/catering"
              className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold uppercase tracking-wide hover:opacity-90 transition-opacity"
            >
              <InlineEdit
                id="home_catering_cta"
                as="span"
                isEditing={isEditing}
                value={getDraftValue("home_catering_cta", "Explore Catering")}
                onChange={(v) => updateDraft("home_catering_cta", v)}
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CateringCta;
