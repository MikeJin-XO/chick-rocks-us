import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo, { breadcrumbLd, SITE } from "@/components/Seo";
import { useEdit } from "@/contexts/EditContext";
import { InlineEdit } from "@/components/ui/inline-edit";
import { MediaEdit } from "@/components/ui/media-edit";
import { DEMO_POSTS, type BlogPost } from "@/lib/data/blog";
import { fetchWpPosts, isWordPressRuntime } from "@/lib/data/blog-wp";

const buildBlogLd = (posts: BlogPost[]) => ({
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Chick Rocks Blog",
  url: `${SITE.URL}/blog`,
  description:
    "Halal food guides, Astoria eats, fried chicken stories and the latest from the Chick Rocks kitchen.",
  publisher: { "@type": "Organization", name: SITE.NAME, logo: `${SITE.URL}/logo.webp` },
  blogPost: posts.map((p) => ({
    "@type": "BlogPosting",
    headline: p.title,
    image: p.image,
    datePublished: p.date,
    url: `${SITE.URL}/blog/${p.slug}`,
    author: { "@type": "Organization", name: SITE.NAME },
  })),
});

const blogCrumbsLd = breadcrumbLd([
  { name: "Home", path: "/" },
  { name: "Blog", path: "/blog" },
]);

const Blog = () => {
  const { isEditing, getDraftValue, updateDraft } = useEdit();
  const base = import.meta.env.BASE_URL;

  // Under WP runtime, prefer server-injected posts so first paint shows real content
  // (avoids the DEMO_POSTS → real posts flash). Fall back to DEMO_POSTS only in
  // standalone Vite dev where there's no WP bridge.
  const initialPosts: BlogPost[] = (() => {
    if (typeof window !== "undefined") {
      const preloaded = window.ChickRocksTheme?.posts;
      if (preloaded && preloaded.length > 0) return preloaded;
    }
    if (isWordPressRuntime()) return [];
    return DEMO_POSTS;
  })();

  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [loading, setLoading] = useState(isWordPressRuntime() && initialPosts.length === 0);

  useEffect(() => {
    let cancelled = false;
    if (!isWordPressRuntime()) return;
    fetchWpPosts(24).then((wpPosts) => {
      if (cancelled) return;
      if (wpPosts && wpPosts.length > 0) setPosts(wpPosts);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo
        title="Halal Food & Fried Chicken Blog | Chick Rocks"
        description="Halal food guides, Astoria eats, fried chicken explainers, recipes and news from Chick Rocks — the halal fried chicken spot in Astoria and Flushing, NY."
        path="/blog"
        keywords="halal food blog nyc, halal fried chicken blog, astoria food blog, queens halal guide"
        jsonLd={[buildBlogLd(posts), blogCrumbsLd]}
      />
      <Navbar />

      <section className="relative bg-primary text-primary-foreground overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08] pointer-events-none [background-image:radial-gradient(theme(colors.primary.foreground)_1px,transparent_1px)] [background-size:22px_22px]"
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.18)_100%)]"
        />
        <div className="relative container mx-auto px-4 py-9 sm:py-11 md:py-14 flex flex-col items-center text-center">
          <MediaEdit
            id="blog_page_hero_logo"
            isEditing={isEditing}
            value={getDraftValue("blog_page_hero_logo", `${base}logo.webp`)}
            onChange={(v) => updateDraft("blog_page_hero_logo", v)}
          >
            <img
              src={getDraftValue("blog_page_hero_logo", `${base}logo.webp`)}
              alt="Chick Rocks halal fried chicken logo"
              className="h-12 sm:h-14 md:h-16 w-auto brightness-0 invert"
            />
          </MediaEdit>

          <div className="mt-4 sm:mt-5 flex items-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.32em] opacity-80">
            <span aria-hidden className="h-px w-8 sm:w-10 bg-primary-foreground/60" />
            <span>Stories · Recipes · Eats</span>
            <span aria-hidden className="h-px w-8 sm:w-10 bg-primary-foreground/60" />
          </div>

          <InlineEdit
            id="blog_page_title"
            as="h1"
            className="mt-3 sm:mt-4 font-heading uppercase tracking-wide text-balance text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] leading-[1] block"
            isEditing={isEditing}
            value={getDraftValue("blog_page_title", "The Chick Rocks Blog")}
            onChange={(v) => updateDraft("blog_page_title", v)}
          />

          <div aria-hidden className="mt-4 sm:mt-5 flex items-center gap-2 opacity-70">
            <span className="h-px w-8 bg-primary-foreground" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
            <span className="h-px w-8 bg-primary-foreground" />
          </div>

          <InlineEdit
            id="blog_page_hero_subtext"
            as="p"
            className="mt-3 sm:mt-4 text-[13px] sm:text-sm md:text-[15px] leading-relaxed opacity-90 max-w-3xl mx-auto block text-pretty"
            isEditing={isEditing}
            multiline
            value={getDraftValue(
              "blog_page_hero_subtext",
              "Halal food stories, fried chicken favorites, and the latest from Astoria and Flushing."
            )}
            onChange={(v) => updateDraft("blog_page_hero_subtext", v)}
          />
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 py-10 sm:py-12 md:py-16">
        {loading && posts.length === 0 ? (
          <p className="text-center text-muted-foreground">Loading posts…</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-muted-foreground">No posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 sm:gap-y-10 md:gap-y-12">
            {posts.map((post, index) => {
              const resolvedImg =
                post.image && !post.image.startsWith("http") ? `${base}${post.image}` : post.image;
              const imageKey = `blog_post_${post.slug}_image`;
              const imageSrc = getDraftValue(imageKey, resolvedImg || "");
              const cardInner = (
                <>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2 sm:mb-3">
                    Blog Post
                  </p>
                  <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3 leading-snug group-hover:text-primary transition-colors text-balance">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-3 text-pretty">
                      {post.excerpt}
                    </p>
                  )}
                  <p className="text-sm uppercase tracking-widest text-muted-foreground">
                    {post.date}
                  </p>
                </>
              );
              return (
                <article key={post.slug} className="group">
                  <MediaEdit
                    id={imageKey}
                    isEditing={isEditing}
                    value={imageSrc}
                    onChange={(v) => updateDraft(imageKey, v)}
                    className="overflow-hidden rounded-2xl mb-4 sm:mb-5 bg-muted block"
                  >
                    {isEditing ? (
                      imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={post.title}
                          loading={index < 2 ? "eager" : "lazy"}
                          className="block w-full h-48 sm:h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-48 sm:h-56 bg-muted flex items-center justify-center text-muted-foreground text-xs">
                          No image — click Replace Image
                        </div>
                      )
                    ) : (
                      <Link to={`/blog/${post.slug}`} className="block">
                        {imageSrc ? (
                          <img
                            src={imageSrc}
                            alt={post.title}
                            loading={index < 2 ? "eager" : "lazy"}
                            className="block w-full h-48 sm:h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-48 sm:h-56 bg-muted" />
                        )}
                      </Link>
                    )}
                  </MediaEdit>
                  {isEditing ? (
                    <div className="block">{cardInner}</div>
                  ) : (
                    <Link to={`/blog/${post.slug}`} className="block">
                      {cardInner}
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
