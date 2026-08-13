export type DayHours = { open: number; close: number };

export type StoreId = "flushing" | "astoria" | "jackson-heights";

export type Store = {
  id: StoreId;
  /** Short neighborhood name — "Flushing". Used as the primary label everywhere. */
  name: string;
  /** Neighborhood + state — "Flushing, NY". Used in nav/CTA labels. */
  cityState: string;
  addressLine1: string;
  addressLine2: string;
  phone: string;
  tel: string;
  mapsUrl: string;
  orderUrl: string;
  /** Shows a "New" badge in the store picker. */
  isNew?: boolean;
  postal: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
  };
  geo?: { latitude: number; longitude: number };
  hours: DayHours[];
};

export const DAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// hours: index 0 = Sunday ... 6 = Saturday. close > 24 means closes that many hours past
// midnight (next day) — e.g. 26 = 2 AM next day, 29 = 5 AM next day.
export const STORES: Store[] = [
  {
    id: "flushing",
    name: "Flushing",
    cityState: "Flushing, NY",
    addressLine1: "136-20 Roosevelt Ave #25",
    addressLine2: "Flushing, NY 11354",
    phone: "(347) 368-6181",
    tel: "+13473686181",
    mapsUrl:
      "https://www.google.com/maps/place/Chick+Rocks+Flushing/@40.7593046,-73.8291343,17z/data=!3m1!4b1!4m6!3m5!1s0x89c261af3f7543a3:0xb4661eca57443ae!8m2!3d40.7593046!4d-73.8291343!16s%2Fg%2F11t57kbls7",
    orderUrl: "https://pos.chowbus.com/online-ordering/store/chick-rocks/11843",
    postal: {
      streetAddress: "136-20 Roosevelt Ave #25",
      addressLocality: "Flushing",
      addressRegion: "NY",
      postalCode: "11354",
    },
    geo: { latitude: 40.7593046, longitude: -73.8291343 },
    hours: Array.from({ length: 7 }, () => ({ open: 10, close: 21.5 })),
  },
  {
    id: "astoria",
    name: "Astoria",
    cityState: "Astoria, NY",
    addressLine1: "30-02 Steinway St",
    addressLine2: "Astoria, NY 11103",
    phone: "(347) 242-3449",
    tel: "+13472423449",
    mapsUrl:
      "https://www.google.com/maps/place/Chick+Rocks+Astoria/@40.7638561,-73.9152519,16z/data=!3m1!4b1!4m6!3m5!1s0x89c25f00252f3021:0x99d674aa5a4d19c7!8m2!3d40.7638561!4d-73.9152519!16s%2Fg%2F11yb2v04hk",
    orderUrl: "https://pos.chowbus.com/online-ordering/store/chick-rocks-astoria/20957",
    postal: {
      streetAddress: "30-02 Steinway St",
      addressLocality: "Astoria",
      addressRegion: "NY",
      postalCode: "11103",
    },
    geo: { latitude: 40.7638561, longitude: -73.9152519 },
    hours: [
      { open: 10, close: 26 },
      { open: 10, close: 26 },
      { open: 10, close: 26 },
      { open: 10, close: 26 },
      { open: 10, close: 26 },
      { open: 10, close: 29 },
      { open: 10, close: 29 },
    ],
  },
  {
    id: "jackson-heights",
    name: "Jackson Heights",
    cityState: "Jackson Heights, NY",
    addressLine1: "83-12 37th Ave",
    addressLine2: "Jackson Heights, NY 11372",
    phone: "(718) 685-2621",
    tel: "+17186852621",
    mapsUrl: "https://maps.google.com/?q=83-12+37th+Ave+Jackson+Heights+NY+11372",
    orderUrl:
      "https://pos.chowbus.com/online-ordering/store/Chick-Rocks-jackson-heights/50287",
    isNew: true,
    postal: {
      streetAddress: "83-12 37th Ave",
      addressLocality: "Jackson Heights",
      addressRegion: "NY",
      postalCode: "11372",
    },
    hours: Array.from({ length: 7 }, () => ({ open: 10, close: 26 })),
  },
];

export const getStore = (id: StoreId): Store => {
  const store = STORES.find((s) => s.id === id);
  if (!store) throw new Error(`Unknown store id: ${id}`);
  return store;
};

/** "Astoria, Flushing and Jackson Heights" — for prose and meta descriptions. */
export const STORE_CITIES_SENTENCE = (() => {
  const names = ["astoria", "flushing", "jackson-heights"].map((id) => getStore(id as StoreId).name);
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
})();

export const formatHour = (h: number): string => {
  const wrapped = h >= 24 ? h - 24 : h;
  const hour = Math.floor(wrapped);
  const min = Math.round((wrapped - hour) * 60);
  const period = hour >= 12 ? "PM" : "AM";
  const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return min === 0
    ? `${display} ${period}`
    : `${display}:${min.toString().padStart(2, "0")} ${period}`;
};

export const formatRange = (h: DayHours) => `${formatHour(h.open)}–${formatHour(h.close)}`;

/**
 * Human summary of a week of hours, collapsing runs of identical days:
 * "daily 10 AM–9:30 PM" or "Sun–Thu 10 AM–2 AM, Fri–Sat 10 AM–5 AM".
 */
export const summarizeHours = (hours: DayHours[]): string => {
  const short = DAY_LABELS.map((d) => d.slice(0, 3));
  const runs: { start: number; end: number; hours: DayHours }[] = [];
  hours.forEach((h, i) => {
    const last = runs[runs.length - 1];
    if (last && last.hours.open === h.open && last.hours.close === h.close) last.end = i;
    else runs.push({ start: i, end: i, hours: h });
  });
  if (runs.length === 1) return `daily ${formatRange(runs[0].hours)}`;
  return runs
    .map((r) => {
      const days = r.start === r.end ? short[r.start] : `${short[r.start]}–${short[r.end]}`;
      return `${days} ${formatRange(r.hours)}`;
    })
    .join(", ");
};

// The absent-branch keys are declared as `?: undefined` so the union still resolves
// under this project's `strict: false` tsconfig, where a boolean discriminant alone
// does not narrow.
export type OpenStatus =
  | { open: true; activeHours: DayHours; nextWhen?: undefined; nextHours?: undefined }
  | {
      open: false;
      activeHours?: undefined;
      nextWhen: "today" | "tomorrow";
      nextHours: DayHours;
    };

export const getOpenStatus = (hours: DayHours[], now: Date): OpenStatus => {
  const day = now.getDay();
  const decHour = now.getHours() + now.getMinutes() / 60;
  const yIdx = (day + 6) % 7;

  if (hours[yIdx].close > 24 && decHour < hours[yIdx].close - 24) {
    return { open: true, activeHours: hours[yIdx] };
  }
  if (decHour >= hours[day].open && decHour < hours[day].close) {
    return { open: true, activeHours: hours[day] };
  }
  const todayNotYetOpen = decHour < hours[day].open;
  const nextIdx = todayNotYetOpen ? day : (day + 1) % 7;
  return {
    open: false,
    nextWhen: todayNotYetOpen ? "today" : "tomorrow",
    nextHours: hours[nextIdx],
  };
};

/* ---------------------------------------------------------------------------
 * Structured data helpers — every location's schema.org markup is generated
 * from STORES so hours/addresses can never drift from what the UI renders.
 * ------------------------------------------------------------------------ */

const SCHEMA_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/** 26 -> "02:00" (schema.org allows closes < opens to mean past midnight). */
const toIsoTime = (h: number): string => {
  const wrapped = h >= 24 ? h - 24 : h;
  const hour = Math.floor(wrapped);
  const min = Math.round((wrapped - hour) * 60);
  return `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
};

/** Collapses identical days into one spec entry, as Google prefers. */
export const openingHoursSpec = (hours: DayHours[]) => {
  const groups = new Map<string, string[]>();
  hours.forEach((h, i) => {
    const key = `${h.open}|${h.close}`;
    const days = groups.get(key);
    if (days) days.push(SCHEMA_DAYS[i]);
    else groups.set(key, [SCHEMA_DAYS[i]]);
  });
  return Array.from(groups.entries()).map(([key, dayOfWeek]) => {
    const [open, close] = key.split("|").map(Number);
    return {
      "@type": "OpeningHoursSpecification",
      dayOfWeek,
      opens: toIsoTime(open),
      closes: toIsoTime(close),
    };
  });
};

export const storeLd = (store: Store, siteUrl: string, brandId: string) => ({
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "@id": `${siteUrl}#store-${store.id}`,
  name: `Chick Rocks ${store.name}`,
  branchCode: store.id,
  parentOrganization: { "@id": brandId },
  url: siteUrl,
  telephone: store.tel,
  hasMap: store.mapsUrl,
  servesCuisine: ["Halal", "Fried Chicken", "American", "Chinese American"],
  priceRange: "$$",
  acceptsReservations: false,
  hasMenu: `${siteUrl}/menu`,
  address: { "@type": "PostalAddress", addressCountry: "US", ...store.postal },
  ...(store.geo ? { geo: { "@type": "GeoCoordinates", ...store.geo } } : {}),
  openingHoursSpecification: openingHoursSpec(store.hours),
  potentialAction: {
    "@type": "OrderAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: store.orderUrl,
      actionPlatform: [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform",
      ],
    },
    deliveryMethod: ["http://purl.org/goodrelations/v1#DeliveryModePickUp"],
  },
});
