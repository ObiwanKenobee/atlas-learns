import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface InterventionData {
  id: string;
  title: string;
  location: string;
  type: string;
  dateRecommended: string;
  dateImplemented?: string;
  status: "active" | "monitoring" | "completed" | "rejected";
  confidenceAtIssue: number;
  expectedOutcomes: { metric: string; predicted: string; actual?: string; delta?: string; favorable?: boolean }[];
  learningDelta?: string;
}

const interventions: InterventionData[] = [
  {
    id: "INT-2026-041",
    title: "Wetland Restoration — Nairobi Peri-Urban Flood Zones",
    location: "Nairobi, Kenya",
    type: "Flood Mitigation",
    dateRecommended: "Jun 2026",
    dateImplemented: "Sep 2026",
    status: "monitoring",
    confidenceAtIssue: 78,
    expectedOutcomes: [
      { metric: "Flood runoff reduction", predicted: "18%", actual: "14%", delta: "-4%", favorable: false },
      { metric: "Biodiversity gain", predicted: "9%", actual: "15%", delta: "+6%", favorable: true },
      { metric: "Maintenance cost Δ", predicted: "-12%", actual: "-8%", delta: "+4%", favorable: false },
      { metric: "Community trust", predicted: "+7%", actual: "-3%", delta: "-10%", favorable: false },
    ],
    learningDelta: "Ecological model confidence ↑ | Social land-use conflict penalty ↑ | Governance readiness weighting added",
  },
  {
    id: "INT-2026-038",
    title: "Distributed Solar Microgrid — Rural Oaxaca",
    location: "Oaxaca, Mexico",
    type: "Energy Resilience",
    dateRecommended: "Mar 2026",
    dateImplemented: "Jul 2026",
    status: "completed",
    confidenceAtIssue: 84,
    expectedOutcomes: [
      { metric: "Grid uptime", predicted: "94%", actual: "97%", delta: "+3%", favorable: true },
      { metric: "Cost per kWh Δ", predicted: "-22%", actual: "-19%", delta: "+3%", favorable: false },
      { metric: "Local employment", predicted: "+12 jobs", actual: "+18 jobs", delta: "+6", favorable: true },
    ],
    learningDelta: "Cooperative maintenance model outperforms centralized servicing assumption",
  },
  {
    id: "INT-2026-055",
    title: "Regenerative Agriculture Transition — Mekong Delta",
    location: "Mekong Delta, Vietnam",
    type: "Agricultural Resilience",
    dateRecommended: "Aug 2026",
    status: "active",
    confidenceAtIssue: 62,
    expectedOutcomes: [
      { metric: "Soil carbon Δ", predicted: "+14%", delta: "pending" },
      { metric: "Crop yield stability", predicted: "+8%", delta: "pending" },
      { metric: "Chemical input reduction", predicted: "-35%", delta: "pending" },
    ],
  },
  {
    id: "INT-2025-019",
    title: "Community Health Worker Network — Dhaka Informal Settlements",
    location: "Dhaka, Bangladesh",
    type: "Public Health",
    dateRecommended: "Nov 2025",
    dateImplemented: "Feb 2026",
    status: "monitoring",
    confidenceAtIssue: 71,
    expectedOutcomes: [
      { metric: "Early detection rate", predicted: "+24%", actual: "+31%", delta: "+7%", favorable: true },
      { metric: "Hospitalization Δ", predicted: "-15%", actual: "-11%", delta: "+4%", favorable: false },
      { metric: "Community coverage", predicted: "68%", actual: "52%", delta: "-16%", favorable: false },
    ],
    learningDelta: "Coverage model underestimated informal settlement mobility patterns",
  },
];

const statusStyles: Record<string, string> = {
  active: "bg-atlas-info/15 text-atlas-info border-atlas-info/30",
  monitoring: "bg-atlas-warning/15 text-atlas-warning border-atlas-warning/30",
  completed: "bg-atlas-positive/15 text-atlas-positive border-atlas-positive/30",
  rejected: "bg-atlas-negative/15 text-atlas-negative border-atlas-negative/30",
};

export function InterventionTracker() {
  return (
    <div className="space-y-3">
      {interventions.map((item, i) => (
        <div
          key={item.id}
          className="animate-fade-in-up rounded-lg border border-border bg-card p-5 hover:border-primary/20 transition-all duration-300 group"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[11px] text-muted-foreground">{item.id}</span>
                <Badge className={cn("text-[10px] font-mono border", statusStyles[item.status])}>
                  {item.status}
                </Badge>
              </div>
              <h3 className="text-sm font-semibold text-foreground leading-tight">{item.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{item.location} · {item.type}</p>
            </div>
            <div className="text-right shrink-0 ml-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Confidence</div>
              <div className={cn("font-mono text-lg font-bold", item.confidenceAtIssue >= 75 ? "text-atlas-positive" : item.confidenceAtIssue >= 60 ? "text-atlas-warning" : "text-atlas-negative")}>
                {item.confidenceAtIssue}%
              </div>
            </div>
          </div>

          <div className="flex gap-2 text-[11px] text-muted-foreground mb-3">
            <span>Recommended: {item.dateRecommended}</span>
            {item.dateImplemented && <span>· Implemented: {item.dateImplemented}</span>}
          </div>

          {/* Outcome table */}
          <div className="rounded-md border border-border overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-2 font-medium text-muted-foreground">Metric</th>
                  <th className="text-right p-2 font-medium text-muted-foreground">Predicted</th>
                  <th className="text-right p-2 font-medium text-muted-foreground">Actual</th>
                  <th className="text-right p-2 font-medium text-muted-foreground">Delta</th>
                </tr>
              </thead>
              <tbody>
                {item.expectedOutcomes.map((o, j) => (
                  <tr key={j} className="border-t border-border">
                    <td className="p-2 text-foreground">{o.metric}</td>
                    <td className="p-2 text-right font-mono text-muted-foreground">{o.predicted}</td>
                    <td className="p-2 text-right font-mono text-foreground">{o.actual || "—"}</td>
                    <td className={cn("p-2 text-right font-mono font-medium", o.delta === "pending" ? "text-atlas-neutral" : o.favorable ? "text-atlas-positive" : o.favorable === false ? "text-atlas-negative" : "text-muted-foreground")}>
                      {o.delta || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {item.learningDelta && (
            <div className="mt-3 p-2.5 rounded-md bg-primary/5 border border-primary/10">
              <div className="text-[10px] uppercase tracking-wider text-primary mb-1 font-medium">Learning Delta</div>
              <p className="text-xs text-foreground/80 leading-relaxed">{item.learningDelta}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
