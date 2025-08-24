// src/components/cards/RichCards.tsx
import React from "react";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────
  TIPOS DE CARD
  Llama a cada variante con { type: "<variant>", ...props }
  desde message.cards en tu ChatContainer/ChatMessage.
────────────────────────────────────────────────────────────── */
export type Card =
  | AppointmentsCard
  | RouteCard
  | ReadingClubCard
  | PromoHeroCard
  | ProductCard
  | TravelListingCard
  | WelcomeSignupCard
  | WeatherStackCard
  | CalendarGlassCard
  | EventTeaserCard
  | FeatureHeroCard;

/* 1) Citas médicas */
export type AppointmentsCard = {
  type: "appointments";
  appointments: { date: string; time: string; title: string; location?: string }[];
  calendarUrl?: string;
};

/* 2) Ruta senderismo / montaña */
export type RouteCard = {
  type: "route";
  title: string;
  imageUrl: string;
  stats?: { distance?: string; elevation?: string; duration?: string };
  directionsUrl?: string;
  chip?: string;
  rating?: string;
};

/* 3) Reading club (fecha + share, glass / blur) */
export type ReadingClubCard = {
  type: "readingClub";
  imageUrl: string;
  month: string; // p.e. "NOV"
  day: string;   // "12"
  weekday?: string; // "Wed"
  title: string; // "The Lotus Reading Club"
  subtitle?: string;
  cta?: { label: string; href?: string };
  shareHref?: string;
};

/* 4) Hero promocional (tipo Vision Pro) */
export type PromoHeroCard = {
  type: "promoHero";
  imageUrl: string;
  title: string;
  subtitle?: string;
  cta?: { label: string; href?: string };
  logoEmoji?: string; // pequeño emoji a la izquierda arriba (opcional)
};

/* 5) Producto simple (Ice Matcha) */
export type ProductCard = {
  type: "product";
  imageUrl: string;
  title: string;
  price: string; // "10$"
  tags?: string[];
  subline?: string; // "Free Delivery until …"
  orderHref?: string;
};

/* 6) Listado de viaje / hotel */
export type TravelListingCard = {
  type: "travelListing";
  title: string; // "Banff, Canada"
  datesLine?: string; // "June 22–26 · Local host"
  price: string; // "$172 / night"
  imageUrl: string;
  rating?: string; // "4.8"
  tags?: string[]; // ["Adventure","Ancient Monuments"]
  badge?: string; // "Top rated"
  cta?: { label: string; href?: string };
};

/* 7) Pantalla de bienvenida / signup (solo UI) */
export type WelcomeSignupCard = {
  type: "welcomeSignup";
  imageUrl: string;
  headline: string;
  subline?: string;
  cta?: { label: string; href?: string };
};

/* 8) Weather stack (3 widgets apilados con glass) */
export type WeatherStackCard = {
  type: "weatherStack";
  items: { city: string; temp: string; note?: string; time?: string }[]; // 2–4 ítems
};

/* 9) Calendario glass (no interactivo, showcase) */
export type CalendarGlassCard = {
  type: "calendarGlass";
  monthLabel: string; // "March"
  days: { label: string; isMuted?: boolean; isToday?: boolean; isSelected?: boolean }[]; // 35-42 casillas
};

/* 10) Teaser de evento (neumorphism) */
export type EventTeaserCard = {
  type: "eventTeaser";
  imageUrl: string;
  kicker?: string; // "CARD 1"
  title: string;   // "Set up your event in minutes:"
  highlight?: string; // palabra a resaltar (p.e. "done.")
  body?: string;
};

/* 11) Feature hero con badges (Stress Analytics) */
export type FeatureHeroCard = {
  type: "featureHero";
  imageUrl: string;
  badges?: string[];
  title: string;
  body?: string;
  primary?: { label: string; href?: string };
  secondary?: { label: string; href?: string };
};

/* ──────────────────────────────────────────────────────────────
  RENDER GENÉRICO
────────────────────────────────────────────────────────────── */
export function renderCard(card: Card) {
  switch (card.type) {
    case "appointments":
      return <Appointments c={card} />;
    case "route":
      return <Route c={card} />;
    case "readingClub":
      return <ReadingClub c={card} />;
    case "promoHero":
      return <PromoHero c={card} />;
    case "product":
      return <Product c={card} />;
    case "travelListing":
      return <TravelListing c={card} />;
    case "welcomeSignup":
      return <WelcomeSignup c={card} />;
    case "weatherStack":
      return <WeatherStack c={card} />;
    case "calendarGlass":
      return <CalendarGlass c={card} />;
    case "eventTeaser":
      return <EventTeaser c={card} />;
    case "featureHero":
      return <FeatureHero c={card} />;
    default:
      return null;
  }
}

/* ──────────────────────────────────────────────────────────────
  SUBCOMPONENTES (estilos base y variantes)
────────────────────────────────────────────────────────────── */
const Base = ({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) => (
  <div
    className={cn(
      "rounded-[22px] bg-white shadow-[0_20px_60px_-22px_rgba(2,6,23,0.16),0_6px_20px_-10px_rgba(2,6,23,0.10)]",
      "border border-slate-100 overflow-hidden",
      className
    )}
  >
    {children}
  </div>
);

/* 1) Citas */
function Appointments({ c }: { c: AppointmentsCard }) {
  return (
    <Base className="p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">Próximas citas</h3>
        {c.calendarUrl && (
          <a
            className="text-xs px-2 py-1 rounded-full border bg-white hover:bg-slate-50 text-slate-600"
            href={c.calendarUrl}
            target="_blank"
            rel="noreferrer"
          >
            Ver calendario →
          </a>
        )}
      </div>
      <div className="mt-3 space-y-2">
        {c.appointments.map((a, i) => (
          <div
            key={i}
            className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 items-center p-3 rounded-xl border bg-slate-50"
          >
            <div className="text-center px-2 py-1 rounded-lg bg-white border">
              <div className="text-[10px] font-bold tracking-wide text-slate-500">
                {a.date}
              </div>
              <div className="text-xs font-semibold text-slate-700">{a.time}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-800">{a.title}</div>
              {a.location && (
                <div className="text-xs text-slate-500 mt-0.5">{a.location}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Base>
  );
}

/* 2) Ruta / senderismo */
function Route({ c }: { c: RouteCard }) {
  return (
    <Base>
      <div className="p-3">
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src={c.imageUrl}
            alt={c.title}
            className="w-full h-[220px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <div className="text-xs/none mb-1 font-medium opacity-90">
              {c.chip ?? "Recomendado"}
            </div>
            <div className="flex items-end gap-3">
              <div className="text-base font-semibold">{c.title}</div>
              {c.rating && (
                <div className="ml-auto text-xs bg-white/15 px-2 py-1 rounded-full">
                  ⭐ {c.rating}
                </div>
              )}
            </div>
            {c.stats && (
              <div className="flex gap-4 text-[11px] opacity-90 mt-1">
                {c.stats.distance && <span>📏 {c.stats.distance}</span>}
                {c.stats.elevation && <span>⛰️ {c.stats.elevation}</span>}
                {c.stats.duration && <span>🕒 {c.stats.duration}</span>}
              </div>
            )}
            {c.directionsUrl && (
              <a
                href={c.directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex mt-3 items-center justify-center px-4 py-2 rounded-full bg-white text-slate-900 text-sm font-medium hover:bg-slate-100"
              >
                Directions
              </a>
            )}
          </div>
        </div>
      </div>
    </Base>
  );
}

/* 3) Reading club */
function ReadingClub({ c }: { c: ReadingClubCard }) {
  return (
    <Base className="relative">
      <div className="relative h-[220px] overflow-hidden">
        <img src={c.imageUrl} alt={c.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/30 to-transparent" />
        {/* pills */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <div className="rounded-[14px] bg-black/60 backdrop-blur px-2 py-1 text-[10px] text-white font-semibold">
            {c.month}
          </div>
          <div className="rounded-[10px] bg-white/85 px-2 py-1 text-[11px] font-semibold text-slate-900">
            {c.day} <span className="font-normal text-slate-500">{c.weekday}</span>
          </div>
        </div>
        {c.shareHref && (
          <a
            href={c.shareHref}
            target="_blank"
            rel="noreferrer"
            className="absolute top-3 right-3 grid place-items-center w-9 h-9 rounded-xl bg-white/70 backdrop-blur text-slate-700 hover:bg-white"
          >
            ⤴︎
          </a>
        )}
      </div>
      <div className="p-5 bg-gradient-to-b from-transparent to-white">
        <div className="text-[28px] leading-[1.05] font-serif font-semibold text-slate-900">
          {c.title}
        </div>
        {c.subtitle && (
          <p className="mt-2 text-sm text-slate-600">{c.subtitle}</p>
        )}
        {c.cta && (
          <a
            href={c.cta.href}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center justify-center w-full h-11 rounded-2xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
          >
            {c.cta.label}
          </a>
        )}
      </div>
    </Base>
  );
}

/* 4) Promo hero */
function PromoHero({ c }: { c: PromoHeroCard }) {
  return (
    <Base className="overflow-hidden">
      <div className="relative">
        <img src={c.imageUrl} alt={c.title} className="w-full h-[260px] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-300/30 via-fuchsia-300/20 to-purple-300/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/45" />
        <div className="absolute top-3 left-3 text-xl">{c.logoEmoji ?? "✨"}</div>
        <div className="absolute left-6 right-6 bottom-6 text-white">
          <div className="text-[28px] font-semibold drop-shadow">{c.title}</div>
          {c.subtitle && (
            <p className="mt-1 text-sm opacity-90 drop-shadow">{c.subtitle}</p>
          )}
          {c.cta && (
            <a
              href={c.cta.href}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex px-4 py-2 rounded-xl bg-white/85 text-slate-900 text-sm font-medium hover:bg-white"
            >
              {c.cta.label}
            </a>
          )}
        </div>
      </div>
    </Base>
  );
}

/* 5) Producto */
function Product({ c }: { c: ProductCard }) {
  return (
    <Base className="p-4">
      <div className="relative rounded-2xl overflow-hidden">
        <img src={c.imageUrl} alt={c.title} className="w-full h-[220px] object-cover" />
        <div className="absolute top-3 right-3 text-xs font-semibold bg-white/85 px-2 py-1 rounded-lg">
          {c.price}
        </div>
        {c.subline && (
          <div className="absolute left-0 right-0 bottom-0 text-center text-[11px] bg-black/35 text-white py-1">
            {c.subline}
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="font-medium text-slate-900">{c.title}</div>
        {c.orderHref && (
          <a
            href={c.orderHref}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium px-3 py-1.5 rounded-xl border bg-white hover:bg-slate-50"
          >
            Order Now →
          </a>
        )}
      </div>
      {c.tags && c.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {c.tags.map((t, i) => (
            <span
              key={i}
              className="text-[10px] px-2 py-1 rounded-full bg-slate-100 text-slate-600 border"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </Base>
  );
}

/* 6) Travel listing */
function TravelListing({ c }: { c: TravelListingCard }) {
  return (
    <Base>
      <div className="p-3">
        <div className="relative overflow-hidden rounded-2xl">
          <img src={c.imageUrl} alt={c.title} className="w-full h-[220px] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/55" />
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {c.badge && (
              <span className="text-[11px] px-2 py-1 rounded-full bg-white/85">
                {c.badge}
              </span>
            )}
            {c.rating && (
              <span className="text-[11px] px-2 py-1 rounded-full bg-black/55 text-white">
                ★ {c.rating}
              </span>
            )}
          </div>
          {/* tags dentro de la imagen */}
          {c.tags && c.tags.length > 0 && (
            <div className="absolute left-3 bottom-3 flex gap-2 flex-wrap">
              {c.tags.map((t, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2 py-1 rounded-full bg-black/55 text-white backdrop-blur"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="mt-3">
          <div className="text-lg font-semibold text-slate-900">{c.title}</div>
          {c.datesLine && <div className="text-sm text-slate-500">{c.datesLine}</div>}
          <div className="mt-3 flex items-center justify-between">
            <div className="text-base font-semibold">{c.price}</div>
            {c.cta && (
              <a
                href={c.cta.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-sm hover:bg-slate-800"
              >
                {c.cta.label} ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </Base>
  );
}

/* 7) Welcome signup (UI estática) */
function WelcomeSignup({ c }: { c: WelcomeSignupCard }) {
  return (
    <Base className="overflow-hidden">
      <img src={c.imageUrl} alt="" className="w-full h-[180px] object-cover" />
      <div className="p-5">
        <div className="text-xl font-semibold text-slate-900">{c.headline}</div>
        {c.subline && <p className="text-sm text-slate-600 mt-1">{c.subline}</p>}

        {/* mini-form (decorativo) */}
        <div className="mt-4 grid gap-3">
          <label className="text-xs font-medium text-slate-600">Display name</label>
          <input
            className="h-11 rounded-xl border px-3 outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="@ username"
          />
          <button className="h-11 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800">
            {c.cta?.label ?? "Create an account"}
          </button>
        </div>
      </div>
    </Base>
  );
}

/* 8) Weather stack */
function WeatherStack({ c }: { c: WeatherStackCard }) {
  return (
    <div className="space-y-2">
      {c.items.map((w, i) => (
        <div
          key={i}
          className="rounded-[18px] border bg-white/70 backdrop-blur px-4 py-3 flex items-center justify-between shadow-[0_10px_30px_-15px_rgba(2,6,23,.18)]"
        >
          <div>
            <div className="text-sm font-medium text-slate-800">{w.city}</div>
            <div className="text-[11px] text-slate-500">
              {w.note ?? "Weather"} {w.time ? `· ${w.time}` : ""}
            </div>
          </div>
          <div className="text-xl font-semibold text-slate-900">{w.temp}</div>
        </div>
      ))}
    </div>
  );
}

/* 9) Calendario glass (no interactivo) */
function CalendarGlass({ c }: { c: CalendarGlassCard }) {
  return (
    <Base className="p-4 bg-white/80 backdrop-blur">
      <div className="text-center font-medium text-slate-700">{c.monthLabel}</div>
      <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[11px] text-slate-400">
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {c.days.map((d, i) => (
          <div
            key={i}
            className={cn(
              "h-8 grid place-items-center rounded-lg text-sm",
              d.isSelected
                ? "bg-slate-900 text-white"
                : d.isToday
                ? "ring-1 ring-slate-300"
                : d.isMuted
                ? "text-slate-300"
                : "text-slate-700 hover:bg-slate-100"
            )}
          >
            {d.label}
          </div>
        ))}
      </div>
    </Base>
  );
}

/* 10) Event teaser (neumorphism) */
function EventTeaser({ c }: { c: EventTeaserCard }) {
  return (
    <div className="rounded-[24px] p-4 bg-[#f7f8fb] shadow-[inset_0_1px_0_rgba(255,255,255,1),0_20px_40px_-22px_rgba(2,6,23,.20)] border border-slate-100">
      <div className="overflow-hidden rounded-3xl">
        <img src={c.imageUrl} alt="" className="w-full h-[160px] object-cover" />
      </div>
      <div className="pt-4 px-1">
        <div className="text-xs font-bold text-slate-400 tracking-wide">
          {c.kicker ?? "CARD"}
        </div>
        <div className="mt-1 text-[15px] leading-tight text-slate-700">
          {c.title} {c.body && <span className="text-slate-500">{c.body}</span>}{" "}
          {c.highlight && <strong className="text-slate-900">{c.highlight}</strong>}
        </div>
      </div>
    </div>
  );
}

/* 11) Feature hero con badges y CTA (imagen arriba, degrade a blanco abajo) */
function FeatureHero({ c }: { c: FeatureHeroCard }) {
  return (
    <Base className="overflow-hidden">
      <div className="relative h-[210px]">
        <img src={c.imageUrl} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white" />
        {/* badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {(c.badges ?? []).map((b, i) => (
            <span
              key={i}
              className="text-[11px] px-2 py-1 rounded-full bg-black/55 text-white backdrop-blur border border-white/10"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
      <div className="p-5">
        <div className="text-[22px] font-semibold text-slate-900">{c.title}</div>
        {c.body && <p className="mt-1 text-sm text-slate-600">{c.body}</p>}
        <div className="mt-3 flex gap-2">
          {c.primary && (
            <a
              href={c.primary.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center px-3.5 py-2 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
            >
              {c.primary.label}
            </a>
          )}
          {c.secondary && (
            <a
              href={c.secondary.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center px-3.5 py-2 rounded-xl border bg-white text-sm font-medium hover:bg-slate-50"
            >
              {c.secondary.label}
            </a>
          )}
        </div>
      </div>
    </Base>
  );
}
