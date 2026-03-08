import { cn } from "@/lib/utils";

interface GapItem {
  title: string;
  severity: "critical" | "moderate" | "low";
  category: string;
  detail: string;
  coverage: number;
}

const gaps: GapItem[] = [
  {
    title: "Biodiversity outcomes too early to validate",
    severity: "moderate",
    category: "Temporal Gap",
    detail: "41% of restoration projects lack sufficient longitudinal data for validation",
    coverage: 59,
  },
  {
    title: "Economic spillover under-measured in informal regions",
    severity: "critical",
    category: "Sensor Coverage",
    detail: "Informal economy effects remain proxy-based with no direct measurement infrastructure",
    coverage: 23,
  },
  {
    title: "Community trust inferred from proxy data",
    severity: "moderate",
    category: "Data Quality",
    detail: "No direct survey coverage available; trust shifts estimated from secondary behavioral indicators",
    coverage: 45,
  },
  {
    title: "Missing counterfactual for barrier-only approach",
    severity: "low",
    category: "Causal Attribution",
    detail: "No comparable region implemented barrier-only intervention during same period",
    coverage: 0,
  },
  {
    title: "Conflicting agricultural yield signals",
    severity: "moderate",
    category: "Conflicting Signals",
    detail: "Satellite estimates diverge from ground-truth sampling by 18% in 3 provinces",
    coverage: 67,
  },
  {
    title: "Urban migration response model lacks validation data",
    severity: "critical",
    category: "Delayed Outcomes",
    detail: "Migration effects typically manifest over 5-10 year horizons; only 2 years of data available",
    coverage: 15,
  },
];

const severityStyles: Record<string, string> = {
  critical: "border-l-atlas-negative bg-atlas-negative/5",
  moderate: "border-l-atlas-warning bg-atlas-warning/5",
  low: "border-l-atlas-neutral bg-atlas-neutral/5",
};

const severityLabel: Record<string, string> = {
  critical: "text-atlas-negative",
  moderate: "text-atlas-warning",
  low: "text-atlas-neutral",
};

export function LearningGaps() {
  return (
    <div className="space-y-2.5">
      {gaps.map((gap, i) => (
        <div
          key={i}
          className={cn("animate-fade-in-up rounded-r-lg border-l-2 p-3.5 transition-all duration-300", severityStyles[gap.severity])}
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <div className="flex items-start justify-between mb-1">
            <h4 className="text-xs font-semibold text-foreground leading-tight">{gap.title}</h4>
            <span className={cn("text-[10px] font-mono font-bold shrink-0 ml-2", severityLabel[gap.severity])}>
              {gap.severity.toUpperCase()}
            </span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">{gap.category}</span>
          <p className="text-[11px] text-foreground/70 mt-1.5 leading-relaxed">{gap.detail}</p>
          {gap.coverage > 0 && (
            <div className="mt-2">
              <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                <span>Data coverage</span>
                <span className="font-mono">{gap.coverage}%</span>
              </div>
              <div className="h-1 rounded-full bg-secondary overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", gap.coverage >= 60 ? "bg-atlas-positive" : gap.coverage >= 40 ? "bg-atlas-warning" : "bg-atlas-negative")}
                  style={{ width: `${gap.coverage}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
