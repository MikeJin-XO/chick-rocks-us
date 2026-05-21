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

const homeLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: SITE.NAME,
  url: SITE.URL,
  image: `${SITE.URL}/CHICK%20ROCKS.png`,
  servesCuisine: ["Halal", "Fried Chicken", "American", "Chinese American"],
  priceRange: "$$",
  telephone: "",
  address: {
    "@type": "PostalAddress",
    streetAddress: "30-02 Steinway St",
    addressLocality: "Astoria",
    addressRegion: "NY",
    postalCode: "11103",
    addressCountry: "US",
  },
  hasMenu: `${SITE.URL}/menu`,
  acceptsReservations: false,
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
        title="Chick Rocks — Halal Fried Chicken in Astoria & Flushing, NY"
        description="Crispy halal fried chicken, signature sandwiches, wings, rice bowls and spaghetti combos in Astoria & Flushing, Queens. Dine in, takeout and delivery — order now."
        path="/"
        keywords="halal fried chicken astoria, halal fried chicken nyc, halal fried chicken queens, chick rocks, halal chicken sandwich, halal wings astoria"
        type="restaurant"
        jsonLd={[homeLd, homeFaqLd]}
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
