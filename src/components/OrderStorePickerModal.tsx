import { useEffect } from "react";
import { X, MapPin, Phone } from "lucide-react";
import { useNow } from "@/hooks/use-now";
import {
  DAY_LABELS,
  STORES,
  formatHour,
  formatRange,
  getOpenStatus,
  type Store,
} from "@/lib/stores";

type Props = {
  open: boolean;
  onClose: () => void;
};

const StoreCard = ({ store, now }: { store: Store; now: Date }) => {
  const status = getOpenStatus(store.hours, now);
  const day = now.getDay();

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 flex flex-col gap-4">
      <div className="space-y-1">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h3 className="text-2xl font-heading uppercase tracking-wide text-foreground leading-none">
            {store.name}
          </h3>
          {store.isNew && (
            <span className="shrink-0 rounded-full bg-accent/15 text-accent text-[10px] font-bold uppercase tracking-[0.14em] px-2 py-0.5">
              New
            </span>
          )}
        </div>
        <a
          href={store.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-start gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <MapPin className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
          <span>
            {store.addressLine1}
            <br />
            {store.addressLine2}
          </span>
        </a>
        <a
          href={`tel:${store.tel}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{store.phone}</span>
        </a>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span
          aria-hidden="true"
          className={`inline-block w-2 h-2 rounded-full ${status.open ? "bg-green-500" : "bg-red-500"}`}
        />
        {status.open ? (
          <span>
            <span className="font-semibold text-foreground">Open now</span>
            <span className="text-muted-foreground"> · {formatRange(status.activeHours)}</span>
          </span>
        ) : (
          <span>
            <span className="font-semibold text-foreground">Closed</span>
            <span className="text-muted-foreground">
              {" · Opens "}
              {status.nextWhen}
              {" at "}
              {formatHour(status.nextHours.open)}
            </span>
          </span>
        )}
      </div>

      <details className="group text-sm">
        <summary className="cursor-pointer list-none text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          <span className="underline-offset-2 group-hover:underline">View weekly hours</span>
          <span className="transition-transform group-open:rotate-180" aria-hidden="true">▾</span>
        </summary>
        <ul className="mt-3 space-y-1 text-xs">
          {DAY_LABELS.map((label, i) => (
            <li
              key={label}
              className={`flex justify-between gap-3 ${
                i === day ? "font-semibold text-foreground" : "text-muted-foreground"
              }`}
            >
              <span>{label}</span>
              <span>{formatRange(store.hours[i])}</span>
            </li>
          ))}
        </ul>
      </details>

      {/* Label stays uniform across cards — "Order from {name}" wraps on longer
          neighborhood names and knocks the buttons out of alignment. */}
      <a
        href={store.orderUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Order online from Chick Rocks ${store.name}`}
        className="mt-auto inline-flex items-center justify-center bg-primary text-primary-foreground px-5 py-3 rounded-full font-bold uppercase tracking-wide hover:opacity-90 transition-opacity whitespace-nowrap"
      >
        Order Online
      </a>
    </div>
  );
};

const OrderStorePickerModal = ({ open, onClose }: Props) => {
  const now = useNow(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-3xl lg:max-w-5xl max-h-[90vh] overflow-y-auto bg-background rounded-3xl shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 sm:px-8 pt-6 pb-4 bg-background border-b border-border">
          <div>
            <h2
              id="order-modal-title"
              className="text-2xl sm:text-3xl font-heading uppercase tracking-wide text-foreground"
            >
              Choose a Location
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Pick the Chick Rocks closest to you to start your order.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 w-9 h-9 rounded-full bg-muted hover:bg-muted/70 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 sm:px-8 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {STORES.map((store) => (
            <StoreCard key={store.id} store={store} now={now} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderStorePickerModal;
