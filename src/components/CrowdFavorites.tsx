import { Link } from "react-router-dom";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEdit } from "@/contexts/EditContext";
import { InlineEdit } from "@/components/ui/inline-edit";
import { MediaEdit } from "@/components/ui/media-edit";

const CrowdFavorites = () => {
  const { isEditing, getDraftValue, updateDraft } = useEdit();
  const base = import.meta.env.BASE_URL;
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const cardWidth = first ? first.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
  };

  const favorites = [
    {
      key: "fav_1",
      name: "Honey Hot Chicken Sandwich",
      desc: "Crispy fried chicken glazed in sweet honey heat, stacked on a toasted bun for the perfect balance of sweet and spicy.",
      img: `${base}Honey%20Hot%20Chicken%20Sandwich.png`,
    },
    {
      key: "fav_2",
      name: "Halal Fried Chicken",
      desc: " Crispy, juicy, and full of flavor, our halal fried chicken is seasoned for the perfect bite every time.",
      img: `${base}uploads/2026/05/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20251212202151.jpg`,
    },
    {
      key: "fav_3",
      name: "Rice Bowls",
      desc: "Build your meal around tender chicken, bold sauces, and satisfying rice bowls made for lunch or dinner.",
      img: `${base}uploads/2026/05/Ricebowl-Chickrock-USA-e1778271036382.jpg`,
    },
    {
      key: "fav_4",
      name: "Crawfish Grill Chicken Roll",
      desc: "A unique Chick Rocks favorite packed with flavor, layered with sauce, and made to stand out from the usual sandwich lineup.",
      img: `${base}uploads/2026/05/burgersandwich-crawfish_grilled_chicken_roll-e1778532134414.jpg`,
    },
    {
      key: "fav_5",
      name: "Chicken Sandwich",
      desc: "Crispy chicken, fresh slaw, and bold sauce served on a soft toasted bun for a crave-worthy bite.",
      img: `${base}uploads/2026/05/Crispy-Chicken-Sandwich-Chickrocks-USA-e1778512454281.jpg`,
    },
  ];

  return (
    <section className="py-12 sm:py-14 md:py-16 bg-cream">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8 md:mb-10">
          <InlineEdit
            id="favorites_heading"
            as="h2"
            className="text-3xl sm:text-4xl md:text-5xl font-heading uppercase text-foreground text-balance"
            isEditing={isEditing}
            value={getDraftValue("favorites_heading", "Customer Favorites")}
            onChange={(v) => updateDraft("favorites_heading", v)}
          />
          <Link to="/menu" className="lg:hidden text-primary font-semibold text-sm hover:underline whitespace-nowrap shrink-0">
            <InlineEdit
              id="favorites_view_menu"
              as="span"
              isEditing={isEditing}
              value={getDraftValue("favorites_view_menu", "View Menu →")}
              onChange={(v) => updateDraft("favorites_view_menu", v)}
            />
          </Link>
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <button
              type="button"
              aria-label="Previous favorites"
              onClick={() => scrollByCard(-1)}
              className="w-10 h-10 rounded-full border border-border bg-card text-foreground/70 hover:text-foreground hover:border-foreground/40 transition-colors flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="Next favorites"
              onClick={() => scrollByCard(1)}
              className="w-10 h-10 rounded-full border border-foreground bg-foreground text-card hover:bg-foreground/90 transition-colors flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div ref={scrollerRef} className="grid grid-flow-col auto-cols-[78%] sm:auto-cols-[calc((100%-1.5rem)/2)] lg:auto-cols-[calc((100%-4.5rem)/4)] gap-6 overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0 snap-x snap-mandatory scrollbar-hide scroll-smooth">
          {favorites.map((item) => {
            const nameKey = `${item.key}_name`;
            const descKey = `${item.key}_desc`;
            const imgKey = `${item.key}_img`;
            return (
              <div
                key={item.key}
                className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow flex flex-col snap-start"
              >
                <MediaEdit
                  id={imgKey}
                  isEditing={isEditing}
                  value={getDraftValue(imgKey, item.img)}
                  onChange={(v) => updateDraft(imgKey, v)}
                  className="h-48 overflow-hidden"
                >
                  <img
                    src={getDraftValue(imgKey, item.img)}
                    alt={item.name}
                    loading="lazy"
                    width={512}
                    height={512}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </MediaEdit>
                <div className="p-4 flex flex-col flex-1">
                  <InlineEdit
                    id={nameKey}
                    as="h3"
                    className="font-heading text-lg uppercase text-foreground mb-2 block"
                    isEditing={isEditing}
                    value={getDraftValue(nameKey, item.name)}
                    onChange={(v) => updateDraft(nameKey, v)}
                  />
                  <InlineEdit
                    id={descKey}
                    as="p"
                    className="text-sm text-muted-foreground leading-relaxed mb-2 block"
                    isEditing={isEditing}
                    multiline
                    value={getDraftValue(descKey, item.desc)}
                    onChange={(v) => updateDraft(descKey, v)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CrowdFavorites;
