import { MapPin, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useEdit } from "@/contexts/EditContext";
import { useOrderModal } from "@/contexts/OrderModalContext";
import { InlineEdit } from "@/components/ui/inline-edit";
import { MediaEdit } from "@/components/ui/media-edit";

const Navbar = () => {
  const { isEditing, getDraftValue, updateDraft } = useEdit();
  const { open: openOrderModal } = useOrderModal();
  const base = import.meta.env.BASE_URL;
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2" aria-label="Chick Rocks home">
              <MediaEdit
                id="nav_logo_img"
                isEditing={isEditing}
                value={getDraftValue("nav_logo_img", `${base}logo.webp`)}
                onChange={(v) => updateDraft("nav_logo_img", v)}
              >
                <img
                  src={getDraftValue("nav_logo_img", `${base}logo.webp`)}
                  alt="Chick Rocks"
                  className="h-12 w-auto"
                />
              </MediaEdit>
              <InlineEdit
                id="nav_brand"
                as="h1"
                className="text-2xl font-heading text-primary tracking-wider"
                isEditing={isEditing}
                value={getDraftValue("nav_brand", "CHICK ROCKS")}
                onChange={(v) => updateDraft("nav_brand", v)}
              />
            </Link>
            <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
              <a
                href="https://pos.chowbus.com/online-ordering/store/chick-rocks/11843"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <InlineEdit
                  id="nav_location_1"
                  as="span"
                  isEditing={isEditing}
                  value={getDraftValue("nav_location_1", "Flushing, NY")}
                  onChange={(v) => updateDraft("nav_location_1", v)}
                />
              </a>
              <span className="text-border">|</span>
              <a
                href="https://pos.chowbus.com/online-ordering/store/chick-rocks-astoria/20957"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <InlineEdit
                  id="nav_location_2"
                  as="span"
                  isEditing={isEditing}
                  value={getDraftValue("nav_location_2", "Astoria, NY")}
                  onChange={(v) => updateDraft("nav_location_2", v)}
                />
              </a>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium ml-auto">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              <InlineEdit
                id="nav_link_home"
                as="span"
                isEditing={isEditing}
                value={getDraftValue("nav_link_home", "Home")}
                onChange={(v) => updateDraft("nav_link_home", v)}
              />
            </Link>
            <Link to="/menu" className="text-foreground hover:text-primary transition-colors">
              <InlineEdit
                id="nav_link_menu"
                as="span"
                isEditing={isEditing}
                value={getDraftValue("nav_link_menu", "Menu")}
                onChange={(v) => updateDraft("nav_link_menu", v)}
              />
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              <InlineEdit
                id="nav_link_about"
                as="span"
                isEditing={isEditing}
                value={getDraftValue("nav_link_about", "About Us")}
                onChange={(v) => updateDraft("nav_link_about", v)}
              />
            </Link>
            <Link to="/catering" className="text-foreground hover:text-primary transition-colors">
              <InlineEdit
                id="nav_link_catering"
                as="span"
                isEditing={isEditing}
                value={getDraftValue("nav_link_catering", "Catering")}
                onChange={(v) => updateDraft("nav_link_catering", v)}
              />
            </Link>
            <Link to="/blog" className="text-foreground hover:text-primary transition-colors">
              <InlineEdit
                id="nav_link_blog"
                as="span"
                isEditing={isEditing}
                value={getDraftValue("nav_link_blog", "Blog")}
                onChange={(v) => updateDraft("nav_link_blog", v)}
              />
            </Link>
            <Link to="/faq" className="text-foreground hover:text-primary transition-colors">
              <InlineEdit
                id="nav_link_faq"
                as="span"
                isEditing={isEditing}
                value={getDraftValue("nav_link_faq", "FAQ")}
                onChange={(v) => updateDraft("nav_link_faq", v)}
              />
            </Link>
            <button
              type="button"
              onClick={openOrderModal}
              className="ml-2 inline-flex items-center justify-center bg-primary text-primary-foreground px-5 py-2 rounded-full font-bold uppercase tracking-wide text-xs hover:opacity-90 transition-opacity shadow-sm"
            >
              Order Now
            </button>
          </div>
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden ml-auto inline-flex items-center justify-center w-10 h-10 rounded-md text-foreground hover:text-primary hover:bg-muted transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {mobileOpen && (
          <div id="mobile-nav" className="md:hidden mt-3 pb-2 flex flex-col gap-1 text-sm font-medium">
            <Link to="/" className="px-2 py-2 rounded-md text-foreground hover:text-primary hover:bg-muted transition-colors">
              {getDraftValue("nav_link_home", "Home")}
            </Link>
            <Link to="/menu" className="px-2 py-2 rounded-md text-foreground hover:text-primary hover:bg-muted transition-colors">
              {getDraftValue("nav_link_menu", "Menu")}
            </Link>
            <Link to="/about" className="px-2 py-2 rounded-md text-foreground hover:text-primary hover:bg-muted transition-colors">
              {getDraftValue("nav_link_about", "About Us")}
            </Link>
            <Link to="/catering" className="px-2 py-2 rounded-md text-foreground hover:text-primary hover:bg-muted transition-colors">
              {getDraftValue("nav_link_catering", "Catering")}
            </Link>
            <Link to="/blog" className="px-2 py-2 rounded-md text-foreground hover:text-primary hover:bg-muted transition-colors">
              {getDraftValue("nav_link_blog", "Blog")}
            </Link>
            <Link to="/faq" className="px-2 py-2 rounded-md text-foreground hover:text-primary hover:bg-muted transition-colors">
              {getDraftValue("nav_link_faq", "FAQ")}
            </Link>
            <button
              type="button"
              onClick={openOrderModal}
              className="mt-2 inline-flex items-center justify-center bg-primary text-primary-foreground px-4 py-2.5 rounded-full font-bold uppercase tracking-wide text-sm hover:opacity-90 transition-opacity"
            >
              Order Now
            </button>
            <div className="mt-2 pt-2 border-t border-border flex flex-col gap-2 text-muted-foreground">
              <a
                href="https://pos.chowbus.com/online-ordering/store/chick-rocks/11843"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-2 py-2 hover:text-primary transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <span>{getDraftValue("nav_location_1", "Flushing, NY")}</span>
              </a>
              <a
                href="https://pos.chowbus.com/online-ordering/store/chick-rocks-astoria/20957"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-2 py-2 hover:text-primary transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <span>{getDraftValue("nav_location_2", "Astoria, NY")}</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
