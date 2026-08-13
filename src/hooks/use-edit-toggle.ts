import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "./use-toast";
import contentDefaults from "@/lib/data/content-defaults.json";

const pageDataCache: Record<string, Record<string, string>> = {};

// Snapshot of the live site's edit-mode content (promoted from production WordPress
// post meta), keyed by route path. Used ONLY in local dev where there is no WordPress
// bridge — it lets localhost render what the live site actually shows instead of the
// hardcoded inline fallbacks. On production `window.ChickRocksTheme` exists and supplies
// real post meta, so this is ignored.
const CONTENT_DEFAULTS = contentDefaults as Record<string, Record<string, string>>;

const MEDIA_KEY_PATTERN = /(bg|img|image|icon|logo|banner|photo)/i;
const DEFAULT_LANG = "en";

export function useEditToggle() {
  const bridge = window.ChickRocksTheme;
  const location = useLocation();
  // Local-dev fallback content (empty on production, where the bridge supplies meta).
  const devContent = bridge ? {} : CONTENT_DEFAULTS;
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState<Record<string, string>>(
    bridge?.pageData || devContent[location.pathname] || {}
  );
  const [draft, setDraft] = useState<Record<string, string>>(
    bridge?.pageData || devContent[location.pathname] || {}
  );
  const [postId, setPostId] = useState<number | undefined>(bridge?.postId);
  const [isLoadingPageData, setIsLoadingPageData] = useState(false);

  const isLoggedIn = bridge?.isLoggedIn || false;
  const hasLoadedInitialRef = useRef(false);

  const currentLanguage = bridge?.currentLanguage || DEFAULT_LANG;

  if (!hasLoadedInitialRef.current) {
    if (bridge?.pageData) pageDataCache[location.pathname] = bridge.pageData;
    if (bridge?.allPageData) Object.assign(pageDataCache, bridge.allPageData);
    if (!bridge) Object.assign(pageDataCache, devContent);
  }

  const getLangKey = useCallback(
    (key: string) => {
      if (currentLanguage === DEFAULT_LANG) return key;
      const suffix = `_${currentLanguage}`;
      return key.endsWith(suffix) ? key : `${key}${suffix}`;
    },
    [currentLanguage]
  );

  useEffect(() => {
    if (pageDataCache[location.pathname]) {
      setContent(pageDataCache[location.pathname]);
      setDraft(pageDataCache[location.pathname]);
    }
    if (!hasLoadedInitialRef.current) {
      hasLoadedInitialRef.current = true;
      return;
    }

    const fetchPageData = async () => {
      if (!bridge?.restUrl) return;
      setIsLoadingPageData(true);
      try {
        const res = await fetch(
          `${bridge.restUrl}chick-rocks/v1/page-data?path=${encodeURIComponent(location.pathname)}`
        );
        const data = await res.json();
        if (res.ok && data.pageData) {
          pageDataCache[location.pathname] = data.pageData;
          setContent(data.pageData);
          setDraft(data.pageData);
          setPostId(data.postId);
          setIsEditing(false);
        }
      } catch (err) {
        console.error("Failed to fetch page data:", location.pathname, err);
      } finally {
        setIsLoadingPageData(false);
      }
    };
    fetchPageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const toggleEditing = useCallback(() => {
    if (isEditing) setDraft(content);
    setIsEditing(!isEditing);
  }, [isEditing, content]);

  const updateDraft = useCallback(
    (key: string, value: string) => {
      const isShared = MEDIA_KEY_PATTERN.test(key);
      if (isShared) {
        setDraft((prev) => {
          const next = { ...prev, [key]: value };
          const localized = getLangKey(key);
          if (key !== localized) delete next[localized];
          return next;
        });
      } else {
        const langKey = getLangKey(key);
        setDraft((prev) => ({ ...prev, [langKey]: value }));
      }
    },
    [getLangKey]
  );

  const getDraftValue = useCallback(
    (key: string, defaultValue: string) => {
      const langKey = getLangKey(key);
      const localized = draft[langKey];
      const shared = draft[key];
      const globalDefaults = bridge?.defaultMedia || {};
      const gLocalized = globalDefaults[langKey];
      const gShared = globalDefaults[key];
      const isShared = MEDIA_KEY_PATTERN.test(key);

      if (currentLanguage !== DEFAULT_LANG) {
        if (localized) return localized;
        if (isShared && shared) return shared;
        if (isShared && gLocalized) return gLocalized;
        if (isShared && gShared) return gShared;
        return defaultValue;
      }
      if (localized) return localized;
      if (shared) return shared;
      if (isShared && gLocalized) return gLocalized;
      if (isShared && gShared) return gShared;
      return defaultValue;
    },
    [draft, getLangKey, currentLanguage, bridge]
  );

  const saveContent = async () => {
    const targetPostId = postId || bridge?.postId;
    if (!targetPostId || !bridge?.restUrl) {
      toast({ title: "Error", description: "WordPress API not configured.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch(`${bridge.restUrl}chick-rocks/v1/save-page-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": bridge.restNonce || "",
        },
        body: JSON.stringify({ postId: targetPostId, pageData: draft }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setContent(draft);
        setIsEditing(false);
        toast({ title: "Saved", description: "Page content saved." });
      } else {
        throw new Error(result.message || "Save failed");
      }
    } catch (e: any) {
      toast({ title: "Save failed", description: e.message || "Unexpected error", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const refreshTextContent = async () => {
    const targetPostId = postId || bridge?.postId;
    if (!targetPostId || !bridge?.restUrl) return;
    if (!window.confirm("Reset all text to defaults (images preserved)?")) return;
    setIsSaving(true);
    try {
      const res = await fetch(`${bridge.restUrl}chick-rocks/v1/refresh-text-content`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": bridge.restNonce || "",
        },
        body: JSON.stringify({ postId: targetPostId }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        toast({ title: "Refreshed", description: `Cleared ${result.deleted_count || 0} fields. Reloading...` });
        setTimeout(() => {
          window.location.href = window.location.href.split("?")[0] + "?refresh=" + Date.now();
        }, 800);
      } else {
        throw new Error(result.message || "Refresh failed");
      }
    } catch (e: any) {
      toast({ title: "Refresh failed", description: e.message || "Unexpected error", variant: "destructive" });
      setIsSaving(false);
    }
  };

  return {
    isEditing,
    isSaving,
    isLoggedIn,
    currentLanguage,
    content,
    draft,
    isLoadingPageData,
    getDraftValue,
    toggleEditing,
    updateDraft,
    saveContent,
    refreshTextContent,
  };
}
