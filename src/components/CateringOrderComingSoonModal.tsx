import { useEffect } from "react";
import { X, Phone } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const LOCATIONS = [
  { name: "Flushing", phone: "(347) 368-6181", tel: "+13473686181" },
  { name: "Astoria", phone: "(347) 242-3449", tel: "+13472423449" },
];

const CateringOrderComingSoonModal = ({ open, onClose }: Props) => {
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
      aria-labelledby="catering-order-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-background rounded-3xl shadow-2xl">
        <div className="flex items-start justify-between gap-4 px-6 sm:px-8 pt-6 pb-2">
          <div>
            <h2
              id="catering-order-modal-title"
              className="text-xl sm:text-2xl font-heading uppercase tracking-wide text-foreground whitespace-nowrap"
            >
              Catering Ordering Coming Soon
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Online catering orders are launching soon. In the meantime, call your nearest Chick Rocks to place your order.
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
        <div className="px-6 sm:px-8 pt-4 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {LOCATIONS.map((loc) => (
            <a
              key={loc.name}
              href={`tel:${loc.tel}`}
              className="rounded-2xl border border-border bg-card p-5 flex flex-col items-center text-center gap-2 hover:border-primary transition-colors"
            >
              <span className="text-xs font-bold uppercase tracking-wide text-accent">
                {loc.name}
              </span>
              <span className="inline-flex items-center gap-2 text-lg font-heading uppercase text-foreground">
                <Phone className="w-4 h-4" aria-hidden="true" />
                {loc.phone}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CateringOrderComingSoonModal;
