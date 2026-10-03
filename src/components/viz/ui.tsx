import type { ReactNode, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Btn({ variant = "ghost", className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "accent" }) {
  return <button {...p} className={cn("btn", `btn-${variant}`, className)} />;
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string | undefined }) {
  return (
    <div className="panel px-4 py-3" title={hint}>
      <div className="label">{label}</div>
      <div className="mt-1 font-mono text-2xl text-foreground tabular-nums">{value}</div>
    </div>
  );
}

export function Panel({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn("panel p-5", className)}>
      {title && <h3 className="label mb-4">{title}</h3>}
      {children}
    </section>
  );
}

export function Complexity({ name, rows }: { name: string; rows: [string, string][] }) {
  return (
    <div className="panel p-5">
      <h4 className="font-display text-lg text-foreground">{name}</h4>
      <dl className="mt-3 space-y-1.5">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between border-b border-border/60 pb-1.5 text-sm">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="font-mono text-primary">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function SpeedControl({ speed, setSpeed }: { speed: number; setSpeed: (n: number) => void }) {
  const presets: [string, number][] = [["Slow", 900], ["Normal", 450], ["Fast", 120]];
  return (
    <div>
      <div className="label mb-2">Animation speed</div>
      <div className="flex gap-1.5">
        {presets.map(([n, v]) => (
          <button key={n} onClick={() => setSpeed(v)} className={cn("chip", speed === v && "chip-on")}>{n}</button>
        ))}
      </div>
      <input type="range" min={30} max={1200} step={10} value={1230 - speed} onChange={(e) => setSpeed(1230 - +e.target.value)} className="mt-3 w-full accent-primary" title="Drag right for faster animation" />
    </div>
  );
}

export function Progress({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div className="h-full bg-primary transition-all duration-200" style={{ width: `${Math.min(100, value * 100)}%` }} />
    </div>
  );
}
