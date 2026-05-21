import { Link } from "react-router-dom";
import { useEdit } from "@/contexts/EditContext";
import { InlineEdit } from "@/components/ui/inline-edit";
import { MediaEdit } from "@/components/ui/media-edit";

const MenuCategories = () => {
  const { isEditing, getDraftValue, updateDraft } = useEdit();
  const base = import.meta.env.BASE_URL;

  const categories = [
    { key: "menu_cat_1", name: "Sandwiches", img: `${base}uploads/2026/05/Crispy-Chicken-Sandwich-Chickrocks-USA-e1778512454281.jpg`, slug: "burger-sandwich" },
    { key: "menu_cat_2", name: "Fried Chicken", img: `${base}uploads/2026/05/Fired-Chicken-Chickrocks-USA-1-e1778258860229.jpg`, slug: "mix-chicken-combo" },
    { key: "menu_cat_3", name: "Rice Bowl", img: `${base}uploads/2026/05/Ricebowl-Chickrock-USA-e1778271036382.jpg`, slug: "rice-bowl" },
    { key: "menu_cat_4", name: "Spaghetti", img: `${base}uploads/2026/05/Spaghetti-Chickrocks-USA-e1778531330383.jpg`, slug: "rocks-spaghetti-combo" },
    { key: "menu_cat_5", name: "Drinks", img: `${base}uploads/2026/05/Milkshake-Fired-ChickRocks-USAjpg-e1778259348675.jpg`, slug: "beverages" },
    { key: "menu_cat_6", name: "Dessert", img: `${base}uploads/2026/05/Cake-Chickrocks-USA-e1778259494920.jpg`, slug: "dessert" },
  ];

  return (
    <section id="menu" className="py-12 sm:py-14 md:py-16 bg-card">
      <div className="container mx-auto px-4">
        <InlineEdit
          id="menu_heading"
          as="h2"
          className="text-3xl sm:text-4xl md:text-5xl font-heading text-center uppercase mb-3 sm:mb-4 text-foreground block text-balance"
          isEditing={isEditing}
          value={getDraftValue("menu_heading", "What's on Our Halal Menu?")}
          onChange={(v) => updateDraft("menu_heading", v)}
        />
        <InlineEdit
          id="menu_subtext"
          as="p"
          className="text-sm sm:text-base md:text-lg text-center text-muted-foreground max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12 block text-pretty"
          isEditing={isEditing}
          value={getDraftValue(
            "menu_subtext",
            "Explore Chick Rocks favorites, including crispy halal fried chicken, chicken sandwiches, rice bowls, spaghetti, drinks, and desserts. Stop by our Astoria or Flushing location for bold halal comfort food in Queens."
          )}
          onChange={(v) => updateDraft("menu_subtext", v)}
        />
        <div className="flex md:grid md:grid-cols-6 gap-6 overflow-x-auto md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory md:snap-none scrollbar-hide">
          {categories.map((cat) => {
            const imgKey = `${cat.key}_img`;
            const nameKey = `${cat.key}_name`;
            return (
              <Link key={cat.key} to={`/menu#${cat.slug}`} className="flex flex-col items-center gap-3 group shrink-0 basis-1/3 snap-start md:basis-auto md:shrink">
                <MediaEdit
                  id={imgKey}
                  isEditing={isEditing}
                  value={getDraftValue(imgKey, cat.img)}
                  onChange={(v) => updateDraft(imgKey, v)}
                  className="w-[97px] h-[97px] md:w-[106px] md:h-[106px] rounded-full overflow-hidden bg-cream border-2 border-border group-hover:border-primary transition-colors"
                >
                  <img
                    src={getDraftValue(imgKey, cat.img)}
                    alt={cat.name}
                    loading="lazy"
                    width={106}
                    height={106}
                    className="w-full h-full object-cover"
                  />
                </MediaEdit>
                <InlineEdit
                  id={nameKey}
                  as="span"
                  className="text-sm font-medium text-foreground"
                  isEditing={isEditing}
                  value={getDraftValue(nameKey, cat.name)}
                  onChange={(v) => updateDraft(nameKey, v)}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MenuCategories;
