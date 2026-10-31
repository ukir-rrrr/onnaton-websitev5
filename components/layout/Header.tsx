"use client";

import { Fragment, useEffect, useState, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { siteConfig } from "@/lib/content/store";
import { LanguageFlags } from "@/components/layout/LanguageFlags";
import { copy } from "@/lib/i18n/copy";
import { useT } from "@/components/i18n/LocaleProvider";

/** Home-page section id → matching nav href */
const SECTION_TO_NAV: { id: string; href: string }[] = [
  { id: "top", href: "/" },
  { id: "notices", href: "/#notices" },
  { id: "about-text", href: "/#about-text" },
  { id: "kodawari", href: "/#kodawari" },
  { id: "course", href: "/course" },
  { id: "interior", href: "/seats" },
  { id: "access", href: "/#access" },
];

function navClass(active: boolean, onHero: boolean) {
  const base =
    "font-serif-jp rounded px-2 py-1.5 text-[14px] tracking-[0.06em] xl:px-2.5 xl:text-[15px] 2xl:px-3.5 2xl:text-[16px]";
  const idle = onHero
    ? `${base} text-on-dark hover:bg-on-dark/10 hover:text-gold`
    : `${base} text-cream hover:bg-cream/6 hover:text-gold-ink`;
  return active
    ? `${base} ${onHero ? "text-gold" : "text-gold-ink"} bg-cream/8`
    : idle;
}

const SCROLL_TO_KEY = "onnaton-scroll-to";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

function restoreBodyScroll() {
  document.body.style.overflow = "";
}

function afterMenuClose(action: () => void) {
  restoreBodyScroll();
  window.requestAnimationFrame(action);
}

export function Header() {
  const { t, isJa } = useT();
  const reserveHref = isJa ? "/#reserve" : "/reserve/intl";
  const navLinks = [
    { href: "/", label: t(copy.nav.top) },
    { href: "/#notices", label: t(copy.nav.notices) },
    { href: "/#about-text", label: t(copy.nav.about) },
    { href: "/#kodawari", label: t(copy.nav.kodawari) },
    { href: "/course", label: t(copy.nav.course) },
    { href: "/seats", label: t(copy.nav.seats) },
    { href: "/#access", label: t(copy.nav.access) },
  ];
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeHref, setActiveHref] = useState("/");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;

      setScrolled(y > 24);

      // At top: always show. Menu open: always show.
      // Scroll down: hide. Scroll up: show.
      if (menuOpen || y < 48) {
        setHidden(false);
      } else if (delta > 6) {
        setHidden(true);
      } else if (delta < -6) {
        setHidden(false);
      }

      lastY = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  // Route pages: highlight by path. Home: scroll-spy sections.
  useEffect(() => {
    if (pathname === "/course") {
      setActiveHref("/course");
      return;
    }
    if (pathname === "/seats") {
      setActiveHref("/seats");
      return;
    }
    if (pathname === "/reserve" || pathname === "/reserve/intl") {
      setActiveHref("/reserve/intl");
      return;
    }
    if (pathname !== "/") {
      setActiveHref("/");
      return;
    }

    const visibles = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            visibles.set(id, entry.intersectionRatio);
          } else {
            visibles.delete(id);
          }
        }

        // Prefer the section highest on the page among those in view
        let best: { id: string; top: number } | null = null;
        for (const { id } of SECTION_TO_NAV) {
          if (!visibles.has(id)) continue;
          const el = document.getElementById(id);
          if (!el) continue;
          const top = el.getBoundingClientRect().top;
          if (!best || Math.abs(top - 96) < Math.abs(best.top - 96)) {
            best = { id, top };
          }
        }

        if (best) {
          const match = SECTION_TO_NAV.find((s) => s.id === best!.id);
          if (match) setActiveHref(match.href);
        } else if (window.scrollY < 80) {
          setActiveHref("/");
        }
      },
      {
        // Account for fixed header; favor content in the upper mid viewport
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5],
      },
    );

    for (const { id } of SECTION_TO_NAV) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [pathname]);

  // App Router: <Link href="/#section"> does not scroll on the same page.
  useEffect(() => {
    if (pathname !== "/") return;

    const stored = sessionStorage.getItem(SCROLL_TO_KEY);
    if (stored) sessionStorage.removeItem(SCROLL_TO_KEY);
    const id = stored || window.location.hash.replace(/^#/, "");
    if (!id) {
      window.scrollTo(0, 0);
      return;
    }

    const timer = window.setTimeout(() => {
      if (scrollToId(id)) {
        window.history.replaceState(null, "", `/#${id}`);
        setActiveHref(`/#${id}`);
      }
    }, 80);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.replaceState(null, "", "/");
    setMenuOpen(false);
    setActiveHref("/");
  };

  const onNavClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    setMenuOpen(false);
    setHidden(false);

    if (href === "/" && pathname === "/") {
      afterMenuClose(scrollToTop);
      return;
    }

    const hash = href.includes("#") ? href.slice(href.indexOf("#") + 1) : "";
    if (!hash) {
      afterMenuClose(() => router.push(href));
      return;
    }

    if (pathname === "/") {
      afterMenuClose(() => {
        scrollToId(hash);
        window.history.pushState(null, "", href);
        setActiveHref(href);
      });
      return;
    }

    afterMenuClose(() => {
      sessionStorage.setItem(SCROLL_TO_KEY, hash);
      router.push("/");
    });
  };

  const onHero = pathname === "/" && !scrolled && !menuOpen;
  const headerText = onHero ? "text-on-dark" : "text-cream";
  const headerTextMuted = onHero ? "text-on-dark/70" : "text-cream/88";
  const headerBorder = onHero ? "border-on-dark/20" : "border-cream/20";
  const headerDivider = onHero ? "border-on-dark/35" : "border-cream/35";
  const headerBar = onHero ? "bg-on-dark" : "bg-cream";

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,backdrop-filter,border-color] duration-300 ease-out ${
        hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"
      } ${
        scrolled || menuOpen
          ? "border-b border-cream/10 bg-ink/90 backdrop-blur-md"
          : "border-b border-transparent bg-black/50 backdrop-blur-[1px]"
      }`}
    >
      <div className="flex h-20 items-stretch justify-between">
        <Link
          href="/"
          onClick={(event) => {
            if (pathname === "/") {
              event.preventDefault();
              scrollToTop();
            } else {
              setMenuOpen(false);
            }
          }}
          className="flex min-w-0 shrink flex-col justify-center gap-0.5 pl-4 sm:flex-row sm:items-center sm:gap-3 sm:pl-10"
          aria-label={`${siteConfig.name} ${siteConfig.nameRomaji}`}
        >
          <span className={`font-serif-jp text-[18px] font-bold leading-none tracking-[0.06em] ${headerText} sm:text-2xl`}>
            {siteConfig.name}
          </span>
          <span className={`font-sans-jp hidden text-[10px] font-medium leading-none tracking-[0.28em] ${headerTextMuted} min-[400px]:inline sm:text-[11px]`}>
            {siteConfig.nameRomaji}
          </span>
        </Link>

        <nav className="hidden min-w-0 items-center gap-3 pr-3 xl:flex xl:gap-4 2xl:gap-7 2xl:pr-8">
          <div className="flex items-center">
            {navLinks.map((link, i) => (
              <Fragment key={link.href}>
                {i > 0 && (
                  <span
                    aria-hidden
                    className={`mx-1 h-5 border-l border-dotted ${headerDivider}`}
                  />
                )}
                <Link
                  href={link.href}
                  onClick={(event) => onNavClick(event, link.href)}
                  aria-current={activeHref === link.href ? "page" : undefined}
                  className={navClass(activeHref === link.href, onHero)}
                >
                  {link.label}
                </Link>
              </Fragment>
            ))}
          </div>

          <LanguageFlags onHero={onHero} />

          <Link
            href={reserveHref}
            onClick={(event) => {
              if (isJa) onNavClick(event, "/#reserve");
            }}
            className="my-3.5 flex shrink-0 items-center rounded-sm bg-gold px-4 text-[13px] font-bold tracking-[0.05em] text-on-dark hover:bg-cream hover:text-on-dark xl:px-5 2xl:px-7 2xl:text-base"
            aria-current={
              pathname === "/reserve" || pathname === "/reserve/intl"
                ? "page"
                : undefined
            }
          >
            {isJa ? t(copy.nav.reserve) : t(copy.reserve.online)}
          </Link>
        </nav>

        <div className="flex shrink-0 items-center xl:hidden">
          {!menuOpen ? (
            <LanguageFlags className="pr-1 sm:pr-3" onHero={onHero} />
          ) : null}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? t(copy.nav.closeMenu) : t(copy.nav.openMenu)}
            aria-expanded={menuOpen}
            className={`flex min-h-11 w-12 shrink-0 flex-col items-center justify-center gap-1.5 self-stretch border-l ${headerBorder} sm:w-16`}
          >
            <span
              className={`h-px w-5 ${headerBar} transition-transform ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span className={`h-px w-5 ${headerBar} transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span
              className={`h-px w-5 ${headerBar} transition-transform ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>
    </header>

    <AnimatePresence>
      {menuOpen ? (
        <>
          <motion.button
            type="button"
            aria-label={t(copy.nav.closeMenu)}
            className="fixed inset-0 top-20 z-[60] bg-black/45 xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMenuOpen(false)}
          />
          <motion.div
            key="mobile-menu"
            className="fixed inset-x-0 top-20 bottom-0 z-[70] overflow-y-auto overscroll-contain border-t border-cream/10 bg-ink/95 px-6 py-5 xl:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav className="flex flex-col text-[18px]">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.04 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={(event) => onNavClick(event, link.href)}
                    aria-current={activeHref === link.href ? "page" : undefined}
                    className={
                      activeHref === link.href
                        ? "flex min-h-11 items-center text-gold-ink"
                        : "flex min-h-11 items-center text-cream/95 hover:text-cream"
                    }
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-6 border-t border-cream/10 pt-5 xl:hidden">
              <LanguageFlags onHero={false} />
            </div>
            <Link
              href={reserveHref}
              onClick={(event) => {
                event.preventDefault();
                if (isJa) {
                  onNavClick(event, "/#reserve");
                } else {
                  setMenuOpen(false);
                  setHidden(false);
                  afterMenuClose(() => router.push(reserveHref));
                }
              }}
              className="mt-5 flex min-h-12 items-center justify-center bg-gold text-[15px] font-bold tracking-[0.05em] text-on-dark"
            >
              {isJa ? t(copy.nav.reserve) : t(copy.reserve.online)}
            </Link>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
    </>
  );
}
