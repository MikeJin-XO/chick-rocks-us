/// <reference types="vite/client" />

interface ChickRocksBlogPost {
  slug: string;
  title: string;
  date: string;
  image: string;
  excerpt: string;
  body: string;
}

interface Window {
  ChickRocksTheme?: {
    postId?: number;
    pageData?: Record<string, string>;
    allPageData?: Record<string, Record<string, string>>;
    posts?: ChickRocksBlogPost[];
    singlePost?: ChickRocksBlogPost | null;
    isLoggedIn?: boolean;
    restNonce?: string;
    restUrl?: string;
    themeUrl?: string;
    currentLanguage?: string;
    mediaUrls?: Record<string, string>;
    defaultMedia?: Record<string, string>;
  };

  wp?: {
    media: (options: any) => {
      on: (event: string, callback: (data: any) => void) => any;
      open: () => void;
      state: () => {
        get: (selection: string) => { first: () => { toJSON: () => any } };
      };
    };
  };
}
