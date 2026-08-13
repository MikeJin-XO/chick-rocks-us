import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MenuCategories from "@/components/MenuCategories";
import CrowdFavorites from "@/components/CrowdFavorites";
import FeaturedMeals from "@/components/FeaturedMeals";
import AboutSection from "@/components/AboutSection";
import CateringCta from "@/components/CateringCta";
import HomeFaq, { homeFaqItems } from "@/components/HomeFaq";
import Footer from "@/components/Footer";
import Seo, { SITE } from "@/components/Seo";
import { STORES } from "@/lib/stores";

// The Restaurant/branch nodes are emitted site-wide by <Seo>; the homepage only adds
// a pointer list so crawlers see all locations enumerated on the primary page.
const homeLocationsLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Chick Rocks locations",
  itemListElement: STORES.map((store, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: `Chick Rocks ${store.name}`,
    item: `${SITE.URL}#store-${store.id}`,
  })),
};

const homeFaqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: homeFaqItems.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Chick Rocks — Halal Fried Chicken in Astoria, Flushing & Jackson Heights, NY"
        description="Crispy halal fried chicken, signature sandwiches, wings, rice bowls and spaghetti combos in Astoria, Flushing & Jackson Heights, Queens. Dine in, takeout and delivery — order now."
        path="/"
        keywords="halal fried chicken astoria, halal fried chicken jackson heights, halal fried chicken nyc, halal fried chicken queens, chick rocks, halal chicken sandwich, halal wings astoria"
        type="restaurant"
        jsonLd={[homeLocationsLd, homeFaqLd]}
      />
      <Navbar />
      <HeroSection />
      <MenuCategories />
      <CateringCta />
      <FeaturedMeals />
      <CrowdFavorites />
      <AboutSection />
      <HomeFaq />
      <Footer />
    </div>
  );
};

export default Index;
