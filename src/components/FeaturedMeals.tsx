import { Link } from "react-router-dom";
import { useEdit } from "@/contexts/EditContext";
import { InlineEdit } from "@/components/ui/inline-edit";
import { MediaEdit } from "@/components/ui/media-edit";

const FeaturedMeals = () => {
  const { isEditing, getDraftValue, updateDraft } = useEdit();
  const base = import.meta.env.BASE_URL;
  const defaultImg = `${base}uploads/2026/05/ChatGPT-Image-May-8-2026-04_25_39-PM.png`;

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center md:min-h-[600px]">
          <div className="max-w-2xl space-y-4 sm:space-y-5 md:space-y-6 order-2 md:justify-self-start md:pl-4">
            <InlineEdit
              id="catering_eyebrow"
              as="p"
              className="text-accent font-bold uppercase tracking-wide text-xs sm:text-sm block"
              isEditing={isEditing}
              value={getDraftValue("catering_eyebrow", "Halal Food in Queens")}
              onChange={(v) => updateDraft("catering_eyebrow", v)}
            />
            <InlineEdit
              id="catering_heading"
              as="h2"
              className="text-3xl sm:text-4xl md:text-5xl font-heading uppercase leading-tight text-foreground block text-balance"
              isEditing={isEditing}
              value={getDraftValue("catering_heading", "All-Halal Menu With Asian Flavor")}
              onChange={(v) => updateDraft("catering_heading", v)}
            />
            <InlineEdit
              id="catering_body_1"
              as="p"
              className="text-sm sm:text-base text-muted-foreground leading-relaxed block text-pretty"
              isEditing={isEditing}
              multiline
              value={getDraftValue(
                "catering_body_1",
                "At Chick Rocks, we serve halal fried chicken, spicy chicken sandwiches, wings, rice bowls, spaghetti, and bubble tea with bold Asian-American flavor. Visit us in Astoria or Flushing for crispy halal comfort food made fresh for every craving."
              )}
              onChange={(v) => updateDraft("catering_body_1", v)}
            />
            <Link
              to="/faq"
              className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold hover:opacity-90 transition-opacity"
            >
              <InlineEdit
                id="catering_cta"
                as="span"
                isEditing={isEditing}
                value={getDraftValue("catering_cta", "Learn More")}
                onChange={(v) => updateDraft("catering_cta", v)}
              />
            </Link>
          </div>

          <MediaEdit
            id="catering_img"
            isEditing={isEditing}
            value={getDraftValue("catering_img", defaultImg)}
            onChange={(v) => updateDraft("catering_img", v)}
            className="flex justify-center md:justify-start order-1"
          >
            <img
              src={getDraftValue("catering_img", defaultImg)}
              alt="Chick Rocks halal fried chicken"
              loading="lazy"
              className="w-full max-w-[600px] h-auto max-h-[600px] object-contain rounded-3xl"
            />
          </MediaEdit>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMeals;
