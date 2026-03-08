import { cn } from "@/lib/utils";

interface LogEntry {
  version: string;
  date: string;
  trigger: string;
  shifts: { param: string; change: string; direction: "up" | "down" }[];
  domains: string[];
}

const logs: LogEntry[] = [
  {
    version: "v4.2 → v4.3",
    date: "Nov 2026",
    trigger: "Wetland restoration in 6 counties showed stronger biodiversity gains than forecast but slower social adoption",
    shifts: [
      { param: "Ecological resilience weight", change: "+0.12", direction: "up" },
      { param: "Governance friction variable", change: "+0.18", direction: "up" },
      { param: "Infrastructure substitution optimism", change: "-0.09", direction: "down" },
    ],
    domains: ["Flood Mitigation", "Ecosystem Restoration"],
  },
  {
    version: "v4.1 → v4.2",
    date: "Sep 2026",
    trigger: "Distributed solar projects with local cooperatives outperformed centralized maintenance by 23%",
    shifts: [
      { param: "Cooperative model effectiveness", change: "+0.21", direction: "up" },
      { param: "Centralized service assumption", change: "-0.14", direction: "down" },
    ],
    domains: ["Energy Resilience"],
  },
  {
    version: "v4.0 → v4.1",
    date: "Jul 2026",
    trigger: "Community health worker coverage underperformed in high-mobility informal settlements",
    shifts: [
      { param: "Settlement mobility factor", change: "+0.25", direction: "up" },
      { param: "Static population assumption", change: "-0.19", direction: "down" },
      { param: "Trust decay rate", change: "+0.08", direction: "up" },
    ],
    domains: ["Public Health", "Urban Migration"],
  },
  {
    version: "v3.9 → v4.0",
    date: "May 2026",
    trigger: "Reforestation water retention gains observed to compound after year 3, exceeding linear projections",
    shifts: [
      { param: "Compounding ecological benefit", change: "+0.16", direction: "up" },
      { param: "Linear projection bias", change: "-0.11", direction: "down" },
    ],
    domains: ["Reforestation", "Water Management"],
  },
];

export function ModelUpdateLog() {
  return (
    <div className="space-y-3">
      {logs.map((log, i) => (
        <div
          key={i}
          className="animate-fade-in-up rounded-lg border border-border bg-card p-4 hover:border-primary/20 transition-all duration-300"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold text-primary">{log.version}</span>
            <span className="text-[11px] text-muted-foreground">· {log.date}</span>
          </div>
          <p className="text-xs text-foreground/80 leading-relaxed mb-3">{log.trigger}</p>
          
          <div className="space-y-1.5 mb-3">
            {log.shifts.map((s, j) => (
              <div key={j} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{s.param}</span>
                <span className={cn("font-mono font-medium", s.direction === "up" ? "text-atlas-positive" : "text-atlas-negative")}>
                  {s.change}
                </span>
              </div>
            ))}
          </div>
          
          <div className="flex gap-1.5 flex-wrap">
            {log.domains.map((d) => (
              <span key={d} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{d}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
