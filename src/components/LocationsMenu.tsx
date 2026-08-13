import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { useNow } from "@/hooks/use-now";
import { useOrderModal } from "@/contexts/OrderModalContext";
import { STORES, getOpenStatus, type Store } from "@/lib/stores";

const StatusDot = ({ store, now }: { store: Store; now: Date }) => {
  const status = getOpenStatus(store.hours, now);
  return (
    <span className="inline-flex items-center gap-1.5 shrink-0 text-[11px] leading-none">
      <span
        aria-hidden="true"
        className={`inline-block w-1.5 h-1.5 rounded-full ${
          status.open ? "bg-green-500" : "bg-red-500"
        }`}
      />
      <span className={status.open ? "text-green-600 font-semibold" : "text-muted-foreground"}>
        {status.open ? "Open" : "Closed"}
      </span>
    </span>
  );
};

/** One store row: neighborhood + open state on top, street address underneath. */
const StoreRow = ({
  store,
  now,
  onNavigate,
}: {
  store: Store;
  now: Date;
  onNavigate?: () => void;
}) => (
  <a
    href={store.orderUrl}
    target="_blank"
    rel="noopener noreferrer"
    onClick={onNavigate}
    aria-label={`Order online from Chick Rocks ${store.name}`}
    className="flex flex-col gap-0.5 rounded-lg px-3 py-2.5 hover:bg-muted transition-colors"
  >
    <span className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-1.5 font-semibold text-foreground text-sm">
        {store.name}
        {store.isNew && (
          <span className="rounded-full bg-accent/15 text-accent text-[9px] font-bold uppercase tracking-[0.12em] px-1.5 py-0.5">
            New
          </span>
        )}
      </span>
      <StatusDot store={store} now={now} />
    </span>
    <span className="text-xs text-muted-foreground">
      {store.addressLine1}, {store.addressLine2}
    </span>
  </a>
);

/**
 * Desktop navbar locations dropdown. Collapses every store behind one trigger so
 * the bar stays uncluttered as locations are added.
 */
export const LocationsDropdown = () => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const now = useNow(open);
  const { open: openOrderModal } = useOrderModal();
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <MapPin className="w-4 h-4" aria-hidden="true" />
        <span>{STORES.length} Locations</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          id={panelId}
          className="absolute left-0 top-full mt-2 z-50 w-[19rem] rounded-2xl border border-border bg-card shadow-xl p-2"
        >
          <div className="flex flex-col">
            {STORES.map((store) => (
              <StoreRow key={store.id} store={store} now={now} onNavigate={() => setOpen(false)} />
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openOrderModal();
            }}
            className="mt-1 w-full text-left px-3 py-2 text-xs font-semibold text-primary hover:underline underline-offset-2"
          >
            Phones &amp; weekly hours →
          </button>
        </div>
      )}
    </div>
  );
};

/** Same store rows, rendered flat for the mobile menu (no dropdown needed). */
export const LocationsList = ({ onNavigate }: { onNavigate?: () => void }) => {
  const now = useNow();
  return (
    <div className="flex flex-col">
      {STORES.map((store) => (
        <StoreRow key={store.id} store={store} now={now} onNavigate={onNavigate} />
      ))}
    </div>
  );
};
