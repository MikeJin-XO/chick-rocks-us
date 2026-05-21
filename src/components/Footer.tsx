import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";
import { useEdit } from "@/contexts/EditContext";
import { useOrderModal } from "@/contexts/OrderModalContext";
import { InlineEdit } from "@/components/ui/inline-edit";
import { MediaEdit } from "@/components/ui/media-edit";
import {
  DAY_LABELS,
  STORES,
  formatHour,
  formatRange,
  getOpenStatus,
  type DayHours,
} from "@/lib/stores";

const StoreHours = ({ hours }: { hours: DayHours[] }) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const day = now.getDay();
  const status = getOpenStatus(hours, now);

  const statusNode = status.open ? (
    <>
      <span className="font-semibold opacity-100">Open now</span>
      <span className="opacity-70"> ({formatRange(status.activeHours)})</span>
    </>
  ) : (
    <>
      <span className="font-semibold opacity-100">Closed</span>
      <span className="opacity-70">
        {" · Opens "}
        {status.nextWhen}
        {" at "}
        {formatHour(status.nextHours.open)}
      </span>
    </>
  );

  return (
    <div className="relative inline-block group mt-1.5">
      <p
        tabIndex={0}
        className="text-[10px] md:text-xs flex items-center justify-center md:justify-start gap-1.5 cursor-help focus:outline-none whitespace-nowrap"
      >
        <span
          aria-hidden="true"
          className={`inline-block w-1.5 h-1.5 rounded-full ${status.open ? "bg-green-400" : "bg-red-400"}`}
        />
        {statusNode}
      </p>
      <div
        role="tooltip"
        className="pointer-events-none absolute z-20 left-0 bottom-full mb-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-opacity bg-background text-foreground rounded-md shadow-xl p-3 text-xs text-left"
      >
        <p className="font-semibold mb-2">Weekly Hours</p>
        <ul className="space-y-1">
          {DAY_LABELS.map((label, i) => (
            <li
              key={label}
              className={`flex justify-between gap-3 ${i === day ? "font-semibold" : "opacity-70"}`}
            >
              <span>{label}</span>
              <span>{formatRange(hours[i])}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const FLUSHING_HOURS = STORES.find((s) => s.id === "flushing")!.hours;
const ASTORIA_HOURS = STORES.find((s) => s.id === "astoria")!.hours;

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M19.321 5.562a5.122 5.122 0 0 1-3.414-1.267 5.122 5.122 0 0 1-1.713-3.168V1h-3.364v13.152a3.021 3.021 0 0 1-5.44 1.796 3.021 3.021 0 0 1 3.713-4.64V7.9a6.384 6.384 0 0 0-5.173 11.692 6.384 6.384 0 0 0 10.27-5.074V8.44a8.462 8.462 0 0 0 5.121 1.711V6.786a5.088 5.088 0 0 1 0-1.224Z" />
  </svg>
);

const Footer = () => {
  const { isEditing, getDraftValue, updateDraft } = useEdit();
  const { open: openOrderModal } = useOrderModal();
  const base = import.meta.env.BASE_URL;
  const defaultLogo = `${base}logo.webp`;

  return (
    <footer className="bg-foreground text-background">
      <div className="checkered-border h-2" />
      <div className="container mx-auto px-4 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-7 md:gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <Link
              to="/"
              aria-label="Chick Rocks home"
              className="inline-flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              <MediaEdit
                id="footer_logo_img"
                isEditing={isEditing}
                value={getDraftValue("footer_logo_img", defaultLogo)}
                onChange={(v) => updateDraft("footer_logo_img", v)}
              >
                <img
                  src={getDraftValue("footer_logo_img", defaultLogo)}
                  alt="Chick Rocks"
                  className="h-14 md:h-16 w-auto brightness-0 invert"
                />
              </MediaEdit>
              <InlineEdit
                id="footer_brand"
                as="h3"
                className="text-3xl font-heading text-primary leading-none"
                isEditing={isEditing}
                value={getDraftValue("footer_brand", "CHICK ROCKS")}
                onChange={(v) => updateDraft("footer_brand", v)}
              />
            </Link>
            <InlineEdit
              id="footer_tagline"
              as="p"
              className="text-[10px] leading-relaxed opacity-60 mt-3 mb-5 md:mb-4 max-w-[16rem] md:max-w-xs text-center md:text-left"
              isEditing={isEditing}
              value={getDraftValue(
                "footer_tagline",
                "Chick Rocks is a halal chicken restaurant in Queens with locations in Astoria and Flushing. We serve crispy halal fried chicken, wings, chicken sandwiches, rice bowls, spaghetti, drinks, desserts, pickup, delivery, and catering for customers looking for bold halal comfort food in Queens, NY."
              )}
              onChange={(v) => updateDraft("footer_tagline", v)}
            />
            <button
              type="button"
              onClick={openOrderModal}
              className="md:hidden inline-flex items-center justify-center bg-primary text-primary-foreground px-9 py-3 rounded-full font-bold uppercase tracking-[0.18em] text-xs hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 mb-5"
            >
              Order Now
            </button>
            <div className="hidden md:block w-full">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <a
                  href="https://www.instagram.com/chickrocksus/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chick Rocks on Instagram"
                  className="w-9 h-9 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.facebook.com/chickrocks2022/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chick Rocks on Facebook"
                  className="w-9 h-9 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://www.tiktok.com/@chickrockinc"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chick Rocks on TikTok"
                  className="w-9 h-9 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                >
                  <TikTokIcon className="w-4 h-4" />
                </a>
              </div>
              <button
                type="button"
                onClick={openOrderModal}
                className="hidden md:inline-flex mt-5 items-center justify-center bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-bold uppercase tracking-wide text-xs hover:opacity-90 transition-opacity"
              >
                Order Now
              </button>
            </div>
          </div>
          <div>
            <InlineEdit
              id="footer_col1_heading"
              as="h4"
              className="font-semibold mb-4 text-sm hidden md:block"
              isEditing={isEditing}
              value={getDraftValue("footer_col1_heading", "Company")}
              onChange={(v) => updateDraft("footer_col1_heading", v)}
            />
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 md:block md:space-y-2 text-sm opacity-70">
              <li>
                <a href="#" className="hover:opacity-100 transition-opacity">
                  <InlineEdit
                    id="footer_col1_link_1"
                    as="span"
                    isEditing={isEditing}
                    value={getDraftValue("footer_col1_link_1", "Home")}
                    onChange={(v) => updateDraft("footer_col1_link_1", v)}
                  />
                </a>
              </li>
              <li>
                <Link to="/menu" className="hover:opacity-100 transition-opacity">
                  <InlineEdit
                    id="footer_col1_link_6"
                    as="span"
                    isEditing={isEditing}
                    value={getDraftValue("footer_col1_link_6", "Menu")}
                    onChange={(v) => updateDraft("footer_col1_link_6", v)}
                  />
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:opacity-100 transition-opacity">
                  <InlineEdit
                    id="footer_col1_link_2"
                    as="span"
                    isEditing={isEditing}
                    value={getDraftValue("footer_col1_link_2", "About Us")}
                    onChange={(v) => updateDraft("footer_col1_link_2", v)}
                  />
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:opacity-100 transition-opacity">
                  <InlineEdit
                    id="footer_col1_link_3"
                    as="span"
                    isEditing={isEditing}
                    value={getDraftValue("footer_col1_link_3", "Blog")}
                    onChange={(v) => updateDraft("footer_col1_link_3", v)}
                  />
                </Link>
              </li>
              <li>
                <Link to="/catering" className="hover:opacity-100 transition-opacity">
                  <InlineEdit
                    id="footer_col1_link_4"
                    as="span"
                    isEditing={isEditing}
                    value={getDraftValue("footer_col1_link_4", "Catering")}
                    onChange={(v) => updateDraft("footer_col1_link_4", v)}
                  />
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:opacity-100 transition-opacity">
                  <InlineEdit
                    id="footer_col1_link_5"
                    as="span"
                    isEditing={isEditing}
                    value={getDraftValue("footer_col1_link_5", "FAQ")}
                    onChange={(v) => updateDraft("footer_col1_link_5", v)}
                  />
                </Link>
              </li>
              <li className="basis-full h-0 md:hidden" aria-hidden="true" />
              <li className="md:hidden">
                <Link to="/privacy" className="hover:opacity-100 transition-opacity">
                  <InlineEdit
                    id="footer_privacy_link"
                    as="span"
                    isEditing={isEditing}
                    value={getDraftValue("footer_privacy_link", "Privacy policy")}
                    onChange={(v) => updateDraft("footer_privacy_link", v)}
                  />
                </Link>
              </li>
              <li className="md:hidden">
                <Link to="/terms" className="hover:opacity-100 transition-opacity">
                  <InlineEdit
                    id="footer_terms_link"
                    as="span"
                    isEditing={isEditing}
                    value={getDraftValue("footer_terms_link", "Terms of use")}
                    onChange={(v) => updateDraft("footer_terms_link", v)}
                  />
                </Link>
              </li>
            </ul>
          </div>
          <div className="hidden md:block">
            <InlineEdit
              id="footer_col2_heading"
              as="h4"
              className="font-semibold mb-4 text-sm block"
              isEditing={isEditing}
              value={getDraftValue("footer_col2_heading", "Menu")}
              onChange={(v) => updateDraft("footer_col2_heading", v)}
            />
            <ul className="space-y-2 text-sm opacity-70">
              <li>
                <Link to="/menu#burger-sandwich-combo" className="hover:opacity-100 transition-opacity">
                  <InlineEdit
                    id="footer_col2_link_1"
                    as="span"
                    isEditing={isEditing}
                    value={getDraftValue("footer_col2_link_1", "Burgers & Sandwiches")}
                    onChange={(v) => updateDraft("footer_col2_link_1", v)}
                  />
                </Link>
              </li>
              <li>
                <Link to="/menu#chicken-wings" className="hover:opacity-100 transition-opacity">
                  <InlineEdit
                    id="footer_col2_link_2"
                    as="span"
                    isEditing={isEditing}
                    value={getDraftValue("footer_col2_link_2", "Chicken Wings")}
                    onChange={(v) => updateDraft("footer_col2_link_2", v)}
                  />
                </Link>
              </li>
              <li>
                <Link to="/menu#rice-bowl" className="hover:opacity-100 transition-opacity">
                  <InlineEdit
                    id="footer_col2_link_3"
                    as="span"
                    isEditing={isEditing}
                    value={getDraftValue("footer_col2_link_3", "Rice Bowls")}
                    onChange={(v) => updateDraft("footer_col2_link_3", v)}
                  />
                </Link>
              </li>
              <li>
                <Link to="/menu#rocks-spaghetti-combo" className="hover:opacity-100 transition-opacity">
                  <InlineEdit
                    id="footer_col2_link_4"
                    as="span"
                    isEditing={isEditing}
                    value={getDraftValue("footer_col2_link_4", "Spaghetti")}
                    onChange={(v) => updateDraft("footer_col2_link_4", v)}
                  />
                </Link>
              </li>
              <li>
                <Link to="/menu#beverages" className="hover:opacity-100 transition-opacity">
                  <InlineEdit
                    id="footer_col2_link_5"
                    as="span"
                    isEditing={isEditing}
                    value={getDraftValue("footer_col2_link_5", "Drinks")}
                    onChange={(v) => updateDraft("footer_col2_link_5", v)}
                  />
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <InlineEdit
              id="footer_col3_heading"
              as="h4"
              className="font-semibold mb-4 text-sm hidden md:block"
              isEditing={isEditing}
              value={getDraftValue("footer_col3_heading", "Locations")}
              onChange={(v) => updateDraft("footer_col3_heading", v)}
            />
            <div className="text-sm opacity-100 md:opacity-70 flex flex-row gap-x-3 md:flex-col md:gap-x-0 md:gap-y-4 md:items-start text-center md:text-left">
              <div className="flex-1 min-w-0 md:flex-none">
                <InlineEdit
                  id="footer_loc_1_name"
                  as="p"
                  className="font-heading uppercase tracking-[0.04em] text-[1.5rem] leading-[0.95] text-background md:font-body md:font-semibold md:text-sm md:normal-case md:tracking-normal md:leading-normal md:opacity-100 block"
                  isEditing={isEditing}
                  value={getDraftValue("footer_loc_1_name", "Flushing")}
                  onChange={(v) => updateDraft("footer_loc_1_name", v)}
                />
                <span aria-hidden="true" className="block h-[2px] w-7 bg-primary mt-2 mx-auto md:mx-0 md:hidden" />
                <InlineEdit
                  id="footer_loc_1_addr"
                  as="p"
                  className="block mt-2 md:mt-1 text-[11px] leading-snug md:text-sm md:leading-normal opacity-60 md:opacity-100"
                  isEditing={isEditing}
                  multiline
                  value={getDraftValue("footer_loc_1_addr", "136-20 Roosevelt Ave #25,<br />Flushing, NY 11354")}
                  onChange={(v) => updateDraft("footer_loc_1_addr", v)}
                />
                <StoreHours hours={FLUSHING_HOURS} />
              </div>
              <div className="flex-1 min-w-0 md:flex-none">
                <InlineEdit
                  id="footer_loc_2_name"
                  as="p"
                  className="font-heading uppercase tracking-[0.04em] text-[1.5rem] leading-[0.95] text-background md:font-body md:font-semibold md:text-sm md:normal-case md:tracking-normal md:leading-normal md:opacity-100 block"
                  isEditing={isEditing}
                  value={getDraftValue("footer_loc_2_name", "Astoria")}
                  onChange={(v) => updateDraft("footer_loc_2_name", v)}
                />
                <span aria-hidden="true" className="block h-[2px] w-7 bg-primary mt-2 mx-auto md:mx-0 md:hidden" />
                <InlineEdit
                  id="footer_loc_2_addr"
                  as="p"
                  className="block mt-2 md:mt-1 text-[11px] leading-snug md:text-sm md:leading-normal opacity-60 md:opacity-100"
                  isEditing={isEditing}
                  multiline
                  value={getDraftValue("footer_loc_2_addr", "30-02 Steinway St,<br />Astoria, NY 11103")}
                  onChange={(v) => updateDraft("footer_loc_2_addr", v)}
                />
                <StoreHours hours={ASTORIA_HOURS} />
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-background/20 mt-8 sm:mt-10 pt-6">
          <div className="md:hidden flex items-center justify-center gap-4 pb-5 mb-5 border-b border-background/20">
            <a
              href="https://www.instagram.com/chickrocksus/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chick Rocks on Instagram"
              className="w-9 h-9 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://www.facebook.com/chickrocks2022/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chick Rocks on Facebook"
              className="w-9 h-9 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://www.tiktok.com/@chickrockinc"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chick Rocks on TikTok"
              className="w-9 h-9 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
            >
              <TikTokIcon className="w-4 h-4" />
            </a>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between text-sm opacity-60 gap-4 md:gap-6">
          <div className="flex flex-col items-center md:items-start gap-1 text-center md:text-left">
            <InlineEdit
              id="footer_copyright"
              as="p"
              isEditing={isEditing}
              value={getDraftValue("footer_copyright", "© Copyright Chick Rocks Inc. 2026")}
              onChange={(v) => updateDraft("footer_copyright", v)}
            />
            <p className="text-[11px] md:text-sm">
              <InlineEdit
                id="footer_credit_prefix"
                as="span"
                isEditing={isEditing}
                value={getDraftValue("footer_credit_prefix", "Web Design &amp; SEO: ")}
                onChange={(v) => updateDraft("footer_credit_prefix", v)}
              />
              <a
                href={getDraftValue("footer_credit_url", "https://xocontinental.com")}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-100 transition-opacity"
              >
                <InlineEdit
                  id="footer_credit_name"
                  as="span"
                  isEditing={isEditing}
                  value={getDraftValue(
                    "footer_credit_name",
                    "X.O. Continental Marketing &amp; Branding Co."
                  )}
                  onChange={(v) => updateDraft("footer_credit_name", v)}
                />
              </a>
              {isEditing && (
                <span className="ml-2 text-xs opacity-70">
                  Link URL:{" "}
                  <InlineEdit
                    id="footer_credit_url"
                    as="span"
                    className="underline"
                    isEditing={isEditing}
                    value={getDraftValue("footer_credit_url", "https://xocontinental.com")}
                    onChange={(v) => updateDraft("footer_credit_url", v)}
                  />
                </span>
              )}
            </p>
          </div>
          <div className="hidden md:flex gap-4">
            <Link to="/privacy" className="hover:opacity-100 transition-opacity">
              <InlineEdit
                id="footer_privacy_link"
                as="span"
                isEditing={isEditing}
                value={getDraftValue("footer_privacy_link", "Privacy policy")}
                onChange={(v) => updateDraft("footer_privacy_link", v)}
              />
            </Link>
            <Link to="/terms" className="hover:opacity-100 transition-opacity">
              <InlineEdit
                id="footer_terms_link"
                as="span"
                isEditing={isEditing}
                value={getDraftValue("footer_terms_link", "Terms of use")}
                onChange={(v) => updateDraft("footer_terms_link", v)}
              />
            </Link>
          </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
