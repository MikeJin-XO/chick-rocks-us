import { useEdit } from "@/contexts/EditContext";
import { InlineEdit } from "@/components/ui/inline-edit";
import { MediaEdit } from "@/components/ui/media-edit";

const AboutSection = () => {
  const { isEditing, getDraftValue, updateDraft } = useEdit();
  const base = import.meta.env.BASE_URL;

  const qrImg = `${base}reward-qr.png`;

  const rewards = [
    { key: "reward_1", img: `${base}uploads/2026/05/200PTS-e1778182402609.png`, alt: "200 points reward — Milk Tea, Lemonade, or Sparkling drink" },
    { key: "reward_2", img: `${base}uploads/2026/05/400PTS-e1778182479102.png`, alt: "400 points reward — Fried Chicken 2pc with French Fries or Mashed Potato" },
    { key: "reward_3", img: `${base}uploads/2026/05/600PTS-e1778182527981.png`, alt: "600 points reward — Fried Chicken 5pc or Chicken Sandwich" },
    { key: "reward_4", img: `${base}uploads/2026/05/800PTS-1-e1778182184344.png`, alt: "800 points reward — Fried Chicken 2pc with French Fries or Mashed Potato" },
    { key: "reward_5", img: `${base}uploads/2026/05/1000PTS-e1778182147293.png`, alt: "1000 points reward — Fried Chicken 2pc with French Fries or Mashed Potato" },
    { key: "reward_6", img: `${base}uploads/2026/05/1500PTS-e1778182271615.png`, alt: "1500 points reward — Fried Chicken 2pc with French Fries or Mashed Potato" },
  ];

  const checkerStyle: React.CSSProperties = {
    backgroundImage:
      "linear-gradient(45deg, hsl(var(--cream)) 25%, transparent 25%, transparent 75%, hsl(var(--cream)) 75%), linear-gradient(45deg, hsl(var(--cream)) 25%, transparent 25%, transparent 75%, hsl(var(--cream)) 75%)",
    backgroundSize: "44px 44px",
    backgroundPosition: "0 0, 22px 22px",
  };

  const gridStyle: React.CSSProperties = {
    backgroundImage:
      "linear-gradient(to right, hsl(var(--cream) / 0.55) 2px, transparent 2px), linear-gradient(to bottom, hsl(var(--cream) / 0.55) 2px, transparent 2px)",
    backgroundSize: "64px 64px",
  };

  return (
    <section
      id="about"
      className="relative py-14 sm:py-20 md:py-24 overflow-hidden bg-[#f9b251]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0" style={gridStyle} />
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 w-32 h-20 sm:w-56 sm:h-28 md:w-72 md:h-32 opacity-90 [mask-image:linear-gradient(135deg,black_30%,transparent_75%)]"
        style={checkerStyle}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 w-32 h-20 sm:w-56 sm:h-28 md:w-72 md:h-32 opacity-90 [mask-image:linear-gradient(225deg,black_30%,transparent_75%)]"
        style={checkerStyle}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 grain-overlay" />

      <div className="container relative mx-auto px-4">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] md:grid-cols-3 items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="flex justify-start order-1">
            <div className="relative -rotate-[8deg]">
              <div className="absolute inset-0 bg-accent rounded-full blur-md opacity-40 hidden md:block" aria-hidden />
              <div className="relative bg-accent text-accent-foreground rounded-full px-2.5 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 shadow-lg md:shadow-xl ring-2 ring-background/40 text-center">
                <InlineEdit
                  id="rewards_rate_value"
                  as="div"
                  className="font-heading text-sm sm:text-lg md:text-2xl lg:text-3xl leading-none uppercase tracking-tight"
                  isEditing={isEditing}
                  value={getDraftValue("rewards_rate_value", "$1 = 10 PTS")}
                  onChange={(v) => updateDraft("rewards_rate_value", v)}
                />
                <InlineEdit
                  id="rewards_rate_caption"
                  as="div"
                  className="font-heading text-[7px] sm:text-[9px] md:text-[10px] lg:text-xs uppercase tracking-widest mt-0.5 md:mt-1 opacity-95"
                  isEditing={isEditing}
                  value={getDraftValue("rewards_rate_caption", "Redeemable for free food")}
                  onChange={(v) => updateDraft("rewards_rate_caption", v)}
                />
              </div>
            </div>
          </div>

          <div className="text-center order-2 px-1 sm:px-2">
            <InlineEdit
              id="about_heading"
              as="h2"
              className="font-heading uppercase italic text-accent text-xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight drop-shadow-sm block text-balance"
              isEditing={isEditing}
              value={getDraftValue("about_heading", "Join Chick Rocks")}
              onChange={(v) => updateDraft("about_heading", v)}
            />
            <InlineEdit
              id="rewards_heading_line2"
              as="div"
              className="font-heading uppercase text-background/95 text-sm sm:text-xl md:text-2xl lg:text-3xl tracking-[0.2em] mt-0.5 sm:mt-1 block"
              isEditing={isEditing}
              value={getDraftValue("rewards_heading_line2", "Rewards")}
              onChange={(v) => updateDraft("rewards_heading_line2", v)}
            />
          </div>

          <div className="flex justify-end order-3">
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
              <div className="flex flex-col gap-0.5 sm:gap-1 md:gap-1.5 -rotate-[4deg]">
                <span className="bg-accent text-accent-foreground font-heading uppercase text-[8px] sm:text-[10px] md:text-xs lg:text-sm px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1.5 rounded-md shadow md:shadow-md tracking-wider whitespace-nowrap">
                  <InlineEdit
                    id="rewards_qr_line1"
                    as="span"
                    isEditing={isEditing}
                    value={getDraftValue("rewards_qr_line1", "Scan QR Code")}
                    onChange={(v) => updateDraft("rewards_qr_line1", v)}
                  />
                </span>
                <span className="bg-accent text-accent-foreground font-heading uppercase text-[8px] sm:text-[10px] md:text-xs lg:text-sm px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1.5 rounded-md shadow md:shadow-md tracking-wider whitespace-nowrap">
                  <InlineEdit
                    id="rewards_qr_line2"
                    as="span"
                    isEditing={isEditing}
                    value={getDraftValue("rewards_qr_line2", "Check Reward Points")}
                    onChange={(v) => updateDraft("rewards_qr_line2", v)}
                  />
                </span>
              </div>
              <MediaEdit
                id="rewards_qr_img"
                isEditing={isEditing}
                value={getDraftValue("rewards_qr_img", qrImg)}
                onChange={(v) => updateDraft("rewards_qr_img", v)}
                className="rotate-[6deg] rounded-md overflow-hidden bg-background p-0.5 sm:p-1 md:p-1.5 shadow-lg md:shadow-xl ring-2 ring-background"
              >
                <img
                  src={getDraftValue("rewards_qr_img", qrImg)}
                  alt="Chick Rocks Rewards QR code"
                  loading="lazy"
                  width={120}
                  height={120}
                  className="block w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain"
                />
              </MediaEdit>
            </div>
          </div>
        </div>

        <InlineEdit
          id="about_subheading"
          as="p"
          className="text-[11px] sm:text-sm md:text-base text-background/95 max-w-xl mx-auto text-center mb-6 sm:mb-8 md:mb-12 block text-pretty"
          isEditing={isEditing}
          value={getDraftValue(
            "about_subheading",
            "Earn points every time you order your favorite halal fried chicken, sandwiches, drinks, and combos at Chick Rocks."
          )}
          onChange={(v) => updateDraft("about_subheading", v)}
        />

        <div className="flex md:grid md:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory md:snap-none scrollbar-hide">
          {rewards.map((item) => {
            const imgKey = `${item.key}_img`;
            const card = (
              <MediaEdit
                id={imgKey}
                isEditing={isEditing}
                value={getDraftValue(imgKey, item.img)}
                onChange={(v) => updateDraft(imgKey, v)}
                className="block"
              >
                <img
                  src={getDraftValue(imgKey, item.img)}
                  alt={item.alt}
                  loading="lazy"
                  width={400}
                  height={400}
                  className="block w-full h-auto [filter:drop-shadow(0_2px_3px_rgba(0,0,0,0.18))_drop-shadow(0_6px_10px_rgba(0,0,0,0.18))] md:[filter:drop-shadow(0_6px_8px_rgba(0,0,0,0.25))_drop-shadow(0_18px_28px_rgba(0,0,0,0.3))] transition-[filter] duration-300 hover:md:[filter:drop-shadow(0_8px_12px_rgba(0,0,0,0.35))_drop-shadow(0_24px_36px_rgba(0,0,0,0.4))]"
                />
              </MediaEdit>
            );

            const wrapperClass =
              "shrink-0 w-[38%] sm:w-[32%] snap-start md:w-auto md:shrink transition-transform duration-300 hover:-translate-y-1 hover:rotate-[-1deg] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-background/60 rounded-2xl";

            if (isEditing) {
              return (
                <div key={item.key} className={wrapperClass}>
                  {card}
                </div>
              );
            }

            return (
              <a
                key={item.key}
                href="https://loyalty.chowbus.com/v2/83CG47U/landing"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Join Chick Rocks Rewards — ${item.alt}`}
                className={wrapperClass}
              >
                {card}
              </a>
            );
          })}
        </div>

        <InlineEdit
          id="rewards_disclaimer"
          as="p"
          className="text-center text-background/90 text-xs sm:text-sm font-heading uppercase tracking-wider mt-6 sm:mt-8 block"
          isEditing={isEditing}
          value={getDraftValue(
            "rewards_disclaimer",
            "*Pictures are for references only. *Chick Rocks reserves all rights."
          )}
          onChange={(v) => updateDraft("rewards_disclaimer", v)}
        />
      </div>
    </section>
  );
};

export default AboutSection;
