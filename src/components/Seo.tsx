import { useEffect } from "react";
import { STORES, STORE_CITIES_SENTENCE, storeLd } from "@/lib/stores";

const SITE_URL = "https://chickrocksusa.com";
const SITE_NAME = "Chick Rocks";
const DEFAULT_OG_IMAGE = `${SITE_URL}/CHICK%20ROCKS.png`;
const TWITTER_HANDLE = "@ChickRocks";

type JsonLd = Record<string, unknown> | Record<string, unknown>[];

export type SeoProps = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article" | "restaurant";
  keywords?: string;
  noIndex?: boolean;
  jsonLd?: JsonLd;
};

const SEO_ATTR = "data-managed-seo";

const upsertMeta = (selector: string, attrs: Record<string, string>) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(SEO_ATTR, "1");
    document.head.appendChild(el);
  }
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
};

const upsertLink = (selector: string, attrs: Record<string, string>) => {
  let el = document.head.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute(SEO_ATTR, "1");
    document.head.appendChild(el);
  }
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
};

const setJsonLd = (id: string, data: JsonLd | undefined) => {
  const existing = document.getElementById(id);
  if (!data) {
    if (existing) existing.remove();
    return;
  }
  const json = JSON.stringify(data);
  if (existing && existing instanceof HTMLScriptElement) {
    if (existing.textContent !== json) existing.textContent = json;
    return;
  }
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = id;
  script.setAttribute(SEO_ATTR, "1");
  script.textContent = json;
  document.head.appendChild(script);
};

const BRAND_ID = `${SITE_URL}#restaurant`;

// Brand-level node. Individual branches (with their own address, phone and hours)
// are emitted separately below as `siteLocationsLd` and point back here.
const siteOrganizationLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "@id": BRAND_ID,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.webp`,
  image: DEFAULT_OG_IMAGE,
  description: `Chick Rocks serves halal fried chicken, signature chicken sandwiches, wings, rice bowls and spaghetti combos in ${STORE_CITIES_SENTENCE}, NY.`,
  servesCuisine: ["Halal", "Fried Chicken", "American", "Chinese American"],
  priceRange: "$$",
  acceptsReservations: false,
  hasMenu: `${SITE_URL}/menu`,
  sameAs: [
    "https://www.instagram.com/chickrocksus/",
    "https://www.facebook.com/chickrocks2022/",
    "https://www.tiktok.com/@chickrockinc",
  ],
  address: STORES.map((s) => ({
    "@type": "PostalAddress",
    addressCountry: "US",
    ...s.postal,
  })),
  subOrganization: STORES.map((s) => ({ "@id": `${SITE_URL}#store-${s.id}` })),
};

const siteLocationsLd = STORES.map((s) => storeLd(s, SITE_URL, BRAND_ID));

const Seo = ({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  imageAlt = `Chick Rocks — Halal Fried Chicken in ${STORE_CITIES_SENTENCE}, NY`,
  type = "website",
  keywords,
  noIndex = false,
  jsonLd,
}: SeoProps) => {
  useEffect(() => {
    const canonical = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`.replace(/\/+$/, "") || SITE_URL;
    const absoluteImage = image.startsWith("http") ? image : `${SITE_URL}${image.startsWith("/") ? "" : "/"}${image}`;

    if (document.title !== title) document.title = title;

    upsertMeta('meta[name="description"]', { name: "description", content: description });
    upsertMeta('meta[name="author"]', { name: "author", content: SITE_NAME });
    if (keywords) {
      upsertMeta('meta[name="keywords"]', { name: "keywords", content: keywords });
    } else {
      document.head.querySelector('meta[name="keywords"]')?.remove();
    }
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: noIndex ? "noindex,nofollow" : "index,follow,max-image-preview:large",
    });
    upsertMeta('meta[name="theme-color"]', { name: "theme-color", content: "#F97316" });

    upsertLink('link[rel="canonical"]', { rel: "canonical", href: canonical });

    upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: type });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: SITE_NAME });
    upsertMeta('meta[property="og:locale"]', { property: "og:locale", content: "en_US" });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: absoluteImage });
    upsertMeta('meta[property="og:image:alt"]', { property: "og:image:alt", content: imageAlt });

    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    upsertMeta('meta[name="twitter:site"]', { name: "twitter:site", content: TWITTER_HANDLE });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: absoluteImage });
    upsertMeta('meta[name="twitter:image:alt"]', { name: "twitter:image:alt", content: imageAlt });

    setJsonLd("ld-site-restaurant", siteOrganizationLd);
    setJsonLd("ld-site-locations", siteLocationsLd);

    const pageLdList = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
    setJsonLd("ld-page-0", pageLdList[0]);
    setJsonLd("ld-page-1", pageLdList[1]);
    setJsonLd("ld-page-2", pageLdList[2]);
    if (pageLdList.length < 3) {
      document.getElementById("ld-page-2")?.remove();
      if (pageLdList.length < 2) document.getElementById("ld-page-1")?.remove();
    }
  }, [title, description, path, image, imageAlt, type, keywords, noIndex, jsonLd]);

  return null;
};

export default Seo;

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: `${SITE_URL}${it.path}`,
  })),
});

export const SITE = { URL: SITE_URL, NAME: SITE_NAME };
