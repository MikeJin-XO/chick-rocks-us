import { useState } from "react";
import { Plus } from "lucide-react";
import { useEdit } from "@/contexts/EditContext";
import { InlineEdit } from "@/components/ui/inline-edit";

export const homeFaqItems = [
  {
    q: "Is Chick Rocks in Astoria and Flushing halal?",
    a: "Yes. Chick Rocks serves halal chicken at both our Astoria and Flushing locations in Queens.",
  },
  {
    q: "Where can I find halal fried chicken in Astoria?",
    a: "You can visit Chick Rocks Astoria for crispy halal fried chicken, wings, chicken sandwiches, rice bowls, pickup, and delivery.",
  },
  {
    q: "Is Chick Rocks Flushing halal?",
    a: "Yes. Chick Rocks serves halal chicken in New World Mall in Flushing, Queens.",
  },
  {
    q: "Does Chick Rocks offer catering?",
    a: "Yes. Chick Rocks offers halal chicken catering in Queens for office lunches, parties, school events, and family gatherings.",
  },
  {
    q: "Can I order Chick Rocks online?",
    a: "Yes. Customers can order Chick Rocks online for pickup or delivery from our Astoria or Flushing location.",
  },
];

const HomeFaq = () => {
  const { isEditing, getDraftValue, updateDraft } = useEdit();
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (idx: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <section
      id="home-faq"
      aria-labelledby="home-faq-heading"
      className="bg-background py-14 sm:py-20 md:py-24"
    >
      <div className="container mx-auto px-4 max-w-3xl">
        <InlineEdit
          id="home_faq_heading"
          as="h2"
          className="text-3xl sm:text-4xl md:text-5xl font-heading uppercase tracking-wide text-foreground text-center text-balance block"
          isEditing={isEditing}
          value={getDraftValue("home_faq_heading", "Quick Questions About Chick Rocks")}
          onChange={(v) => updateDraft("home_faq_heading", v)}
        />

        <div className="mt-8 sm:mt-10 md:mt-12 divide-y divide-border border-y border-border">
          {homeFaqItems.map((item, i) => {
            const idx = i + 1;
            const isOpen = isEditing || openItems.has(idx);
            return (
              <article key={item.q}>
                <button
                  type="button"
                  onClick={() => !isEditing && toggleItem(idx)}
                  aria-expanded={isOpen}
                  aria-controls={`home_faq_panel_${idx}`}
                  className="w-full flex items-start justify-between gap-4 sm:gap-6 py-4 sm:py-5 text-left hover:text-primary transition-colors"
                >
                  <InlineEdit
                    id={`home_faq_q_${idx}`}
                    as="h3"
                    className="text-base md:text-lg font-body font-normal text-foreground leading-snug block text-pretty"
                    isEditing={isEditing}
                    value={getDraftValue(`home_faq_q_${idx}`, item.q)}
                    onChange={(v) => updateDraft(`home_faq_q_${idx}`, v)}
                  />
                  <Plus
                    aria-hidden="true"
                    className={`shrink-0 w-5 h-5 mt-1 text-muted-foreground transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  />
                </button>
                <div
                  id={`home_faq_panel_${idx}`}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <InlineEdit
                      id={`home_faq_a_${idx}`}
                      as="p"
                      className="text-sm sm:text-base leading-relaxed text-muted-foreground block pb-4 sm:pb-5 pr-8 sm:pr-11 text-pretty"
                      isEditing={isEditing}
                      multiline
                      value={getDraftValue(`home_faq_a_${idx}`, item.a)}
                      onChange={(v) => updateDraft(`home_faq_a_${idx}`, v)}
                    />
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
  );
};

export default HomeFaq;
