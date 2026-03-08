import { cn } from "@/lib/utils";

interface PolicyInsight {
  insight: string;
  confidence: "high" | "medium" | "emerging";
  domains: string[];
  source: string;
}

const policies: PolicyInsight[] = [
  {
    insight: "Wetland restoration outperforms concrete barriers in moderate flood zones with intact upstream ecosystems",
    confidence: "high",
    domains: ["Flood Mitigation", "Ecosystem"],
    source: "14 interventions, 4 regions",
  },
  {
    insight: "Flood relocation policies fail more often where local trust scores are below 45%",
    confidence: "high",
    domains: ["Governance", "Migration"],
    source: "9 interventions, 6 regions",
  },
  {
    insight: "Distributed solar resilience gains are strongest when paired with local maintenance cooperatives",
    confidence: "medium",
    domains: ["Energy", "Community"],
    source: "7 interventions, 3 regions",
  },
  {
    insight: "Reforestation projects show delayed but compounding water retention gains after year three",
    confidence: "medium",
    domains: ["Reforestation", "Water"],
    source: "11 interventions, 5 regions",
  },
  {
    insight: "Community health worker networks require minimum 60% geographic coverage to produce measurable early detection improvements",
    confidence: "emerging",
    domains: ["Health", "Urban"],
    source: "4 interventions, 2 regions",
  },
  {
    insight: "Regenerative agriculture adoption accelerates when combined with market access programs",
    confidence: "emerging",
    domains: ["Agriculture", "Economics"],
    source: "3 interventions, 2 regions",
  },
];

const confStyles: Record<string, string> = {
  high: "bg-atlas-positive/10 text-atlas-positive border-atlas-positive/20",
  medium: "bg-atlas-warning/10 text-atlas-warning border-atlas-warning/20",
  emerging: "bg-atlas-info/10 text-atlas-info border-atlas-info/20",
};

export function PolicyLibrary() {
  return (
    <div className="space-y-2.5">
      {policies.map((p, i) => (
        <div
          key={i}
          className="animate-fade-in-up rounded-lg border border-border bg-card p-4 hover:border-primary/20 transition-all duration-300"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <p className="text-xs text-foreground leading-relaxed mb-2.5">{p.insight}</p>
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5 flex-wrap">
              {p.domains.map((d) => (
                <span key={d} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">{d}</span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">{p.source}</span>
              <span className={cn("text-[10px] font-mono px-1.5 py-0.5 rounded border", confStyles[p.confidence])}>{p.confidence}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
