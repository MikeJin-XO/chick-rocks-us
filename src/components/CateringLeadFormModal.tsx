import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, MapPin, CheckCircle2 } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

type NominatimSuggestion = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

const buildOsmEmbed = (lat: string, lon: string) => {
  const latN = parseFloat(lat);
  const lonN = parseFloat(lon);
  if (Number.isNaN(latN) || Number.isNaN(lonN)) return "";
  const d = 0.005;
  const bbox = `${lonN - d}%2C${latN - d}%2C${lonN + d}%2C${latN + d}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latN}%2C${lonN}`;
};

const initialState = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  partySize: "",
  eventDate: "",
  address: "",
};

const CateringLeadFormModal = ({ open, onClose }: Props) => {
  const [form, setForm] = useState(initialState);
  const [coords, setCoords] = useState<{ lat: string; lon: string } | null>(null);
  const [suggestions, setSuggestions] = useState<NominatimSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const debounceRef = useRef<number | null>(null);
  const addressInputRef = useRef<HTMLInputElement | null>(null);
  const [dropdownRect, setDropdownRect] = useState<{ left: number; top: number; width: number } | null>(null);

  const updateDropdownRect = () => {
    const el = addressInputRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setDropdownRect({ left: r.left, top: r.bottom, width: r.width });
  };

  useLayoutEffect(() => {
    if (!showSuggestions || suggestions.length === 0) return;
    updateDropdownRect();
    const onScrollOrResize = () => updateDropdownRect();
    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("scroll", onScrollOrResize, true);
    return () => {
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("scroll", onScrollOrResize, true);
    };
  }, [showSuggestions, suggestions.length]);

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

  useEffect(() => {
    if (!open) {
      setForm(initialState);
      setCoords(null);
      setSuggestions([]);
      setShowSuggestions(false);
      setSuccess(false);
      setError("");
      setSubmitting(false);
    }
  }, [open]);

  const update = <K extends keyof typeof initialState>(key: K, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddressChange = (value: string) => {
    update("address", value);
    setCoords(null);
    setShowSuggestions(true);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (value.trim().length < 4) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = window.setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          format: "json",
          addressdetails: "0",
          limit: "5",
          countrycodes: "us",
          q: value,
        });
        const res = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) return;
        const data = (await res.json()) as NominatimSuggestion[];
        setSuggestions(data);
      } catch {
        // network errors are non-fatal — user can still submit a free-text address
      }
    }, 450);
  };

  const pickSuggestion = (s: NominatimSuggestion) => {
    update("address", s.display_name);
    setCoords({ lat: s.lat, lon: s.lon });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const theme = window.ChickRocksTheme;
      const restUrl = theme?.restUrl;
      const restNonce = theme?.restNonce;
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        partySize: form.partySize.trim(),
        eventDate: form.eventDate,
        address: form.address.trim(),
        latitude: coords?.lat ?? "",
        longitude: coords?.lon ?? "",
      };
      if (restUrl) {
        const res = await fetch(`${restUrl}chick-rocks/v1/submit-catering-lead`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(restNonce ? { "X-WP-Nonce": restNonce } : {}),
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.message || "Could not submit. Please try again.");
        }
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const today = new Date().toISOString().slice(0, 10);
  const mapSrc = coords ? buildOsmEmbed(coords.lat, coords.lon) : "";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="catering-lead-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background rounded-3xl shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 px-6 sm:px-8 pt-6 pb-4 bg-background border-b border-border">
          <div>
            <h2
              id="catering-lead-modal-title"
              className="text-2xl sm:text-3xl font-heading uppercase tracking-wide text-foreground"
            >
              Request Catering
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Tell us about your event and we'll reach out with a quote.
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

        {success ? (
          <div className="px-6 sm:px-8 py-10 flex flex-col items-center text-center gap-3">
            <CheckCircle2 className="w-12 h-12 text-primary" strokeWidth={1.75} />
            <h3 className="text-xl font-heading uppercase tracking-wide text-foreground">
              Thanks — we got it
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Your catering request has been submitted. The Chick Rocks team will reach out shortly.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-block bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-bold uppercase tracking-wide hover:opacity-90 transition-opacity"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="First name" required>
                <input
                  type="text"
                  required
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Last name" required>
                <input
                  type="text"
                  required
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Phone" required>
                <input
                  type="tel"
                  required
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Email" required>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Party size" required>
                <input
                  type="number"
                  min={1}
                  required
                  inputMode="numeric"
                  value={form.partySize}
                  onChange={(e) => update("partySize", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Event date" required>
                <input
                  type="date"
                  required
                  min={today}
                  value={form.eventDate}
                  onChange={(e) => update("eventDate", e.target.value)}
                  className={inputCls}
                />
              </Field>
            </div>

            <Field label="Event address" required>
              <div className="relative">
                <input
                  ref={addressInputRef}
                  type="text"
                  required
                  autoComplete="off"
                  placeholder="Start typing an address…"
                  value={form.address}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => window.setTimeout(() => setShowSuggestions(false), 150)}
                  className={inputCls}
                />
                {showSuggestions && suggestions.length > 0 && dropdownRect &&
                  createPortal(
                    <ul
                      style={{
                        position: "fixed",
                        left: dropdownRect.left,
                        top: dropdownRect.top + 4,
                        width: dropdownRect.width,
                      }}
                      className="z-[110] bg-card border border-border rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto"
                    >
                      {suggestions.map((s) => (
                        <li key={s.place_id}>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => pickSuggestion(s)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-start gap-2"
                          >
                            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
                            <span className="text-foreground">{s.display_name}</span>
                          </button>
                        </li>
                      ))}
                    </ul>,
                    document.body
                  )
                }
              </div>
            </Field>

            {mapSrc && (
              <div className="rounded-xl overflow-hidden border border-border">
                <iframe
                  title="Selected event location"
                  src={mapSrc}
                  className="w-full h-48 block"
                  loading="lazy"
                />
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive font-medium" role="alert">
                {error}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold uppercase tracking-wide hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting…" : "Submit Request"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center bg-transparent border-2 border-border text-foreground px-6 py-3 rounded-full font-bold uppercase tracking-wide hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const inputCls =
  "w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow";

const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <label className="block">
    <span className="block text-xs font-bold uppercase tracking-wide text-foreground mb-1.5">
      {label}
      {required && <span className="text-primary ml-0.5">*</span>}
    </span>
    {children}
  </label>
);

export default CateringLeadFormModal;
