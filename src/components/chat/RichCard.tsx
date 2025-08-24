import { cn } from "@/lib/utils";

export type RichCardProps = {
  title: string;
  subtitle?: string;
  description?: string;
  tags?: string[];
  /** Usa rutas locales: p.ej. "/placeholder.svg" en /public */
  imageUrl?: string;
  /** "photo" agrega una cabecera (con imagen si hay imageUrl, o degradado CSS si no) */
  variant?: "photo" | "dark" | "light";
  className?: string;
};

export default function RichCard({
  title,
  subtitle,
  description,
  tags = [],
  imageUrl,
  variant = "photo",
  className,
}: RichCardProps) {
  const isDark = variant === "dark";
  const showHeader = variant === "photo" || !!imageUrl;

  return (
    <div
      className={cn(
        "relative w-full max-w-[520px] rounded-[22px] overflow-hidden",
        "border border-slate-200/70 bg-white/90 backdrop-blur",
        "shadow-[0_20px_60px_-18px_rgba(2,6,23,.18),0_6px_18px_-10px_rgba(2,6,23,.12)]",
        className
      )}
      role="group"
    >
      {/* Header: imagen local o degradado CSS (sin APIs) */}
      {showHeader && (
        <div className="relative h-[180px] w-full overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => {
                // Si falla, oculta la img y deja sólo el degradado
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 100% at 0% 0%, #8ec5ff 0%, transparent 60%), radial-gradient(120% 100% at 100% 0%, #fba3ff 0%, transparent 60%), radial-gradient(140% 100% at 50% 100%, #ffd7a8 0%, transparent 65%), linear-gradient(180deg, #ffffff 0%, #f7f7fb 100%)",
              }}
            />
          )}
          {/* degradado para legibilidad del header */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-transparent" />
          {/* chips tags */}
          {tags.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
              {tags.map((t) => (
                <span
                  key={t}
                  className="px-2 py-[3px] rounded-full text-[11px] font-medium text-white/90 bg-black/45 backdrop-blur-sm border border-white/10"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Contenido */}
      <div
        className={cn(
          "p-4 sm:p-5",
          isDark && "bg-slate-900 text-white",
          !showHeader && "pt-5"
        )}
      >
        {!!title && (
          <h3 className={cn("text-lg font-semibold tracking-tight", isDark ? "text-white" : "text-slate-900")}>
            {title}
          </h3>
        )}
        {!!subtitle && (
          <p className={cn("mt-1 text-sm", isDark ? "text-slate-300" : "text-slate-500")}>{subtitle}</p>
        )}
        {!!description && (
          <p className={cn("mt-3 text-[13px] leading-relaxed", isDark ? "text-slate-300/95" : "text-slate-600")}>
            {description}
          </p>
        )}
      </div>

      {/* Glow suave bajo la tarjeta */}
      <div className="pointer-events-none absolute -z-10 inset-x-6 -bottom-6 h-10 blur-xl opacity-70"
           style={{ background:
            "radial-gradient(60% 60% at 50% 0%, rgba(146,151,219,.35), transparent 70%)"
           }} />
    </div>
  );
}