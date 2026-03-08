import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface InterventionData {
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
  rationale?: string;
  baselineConditions?: string[];
  timeline?: { date: string; event: string; type: "milestone" | "signal" | "update" }[];
  linkedDatasets?: { name: string; source: string; records: string }[];
  expertAnnotations?: { author: string; note: string; date: string }[];
}

export const interventions: InterventionData[] = [
  {
    id: "INT-2026-041",
    title: "Wetland Restoration — Nairobi Peri-Urban Flood Zones",
    location: "Nairobi, Kenya",
    type: "Flood Mitigation",
    dateRecommended: "Jun 2026",
    dateImplemented: "Sep 2026",
    status: "monitoring",
    confidenceAtIssue: 78,
    rationale: "Upstream ecosystem largely intact; satellite analysis showed 62% of flood-prone area suitable for wetland restoration at lower cost than concrete barriers.",
    baselineConditions: ["Annual flood events: 4.2 avg", "Existing green cover: 18%", "Community displacement risk: moderate", "Infrastructure age: 12 years avg"],
    expectedOutcomes: [
      { metric: "Flood runoff reduction", predicted: "18%", actual: "14%", delta: "-4%", favorable: false },
      { metric: "Biodiversity gain", predicted: "9%", actual: "15%", delta: "+6%", favorable: true },
      { metric: "Maintenance cost Δ", predicted: "-12%", actual: "-8%", delta: "+4%", favorable: false },
      { metric: "Community trust", predicted: "+7%", actual: "-3%", delta: "-10%", favorable: false },
    ],
    learningDelta: "Ecological model confidence ↑ | Social land-use conflict penalty ↑ | Governance readiness weighting added",
    timeline: [
      { date: "Jun 2026", event: "Recommendation issued by Atlas v4.1", type: "milestone" },
      { date: "Jul 2026", event: "County government approved with modifications", type: "milestone" },
      { date: "Sep 2026", event: "Phase 1 implementation begins", type: "milestone" },
      { date: "Dec 2026", event: "Early signal: runoff reduction slower than expected", type: "signal" },
      { date: "Mar 2027", event: "Biodiversity index exceeds forecast by 6%", type: "signal" },
      { date: "Jun 2027", event: "Local land conflicts reported in 3 sub-counties", type: "signal" },
      { date: "Sep 2027", event: "Model v4.3 update triggered — governance weighting added", type: "update" },
    ],
    linkedDatasets: [
      { name: "Sentinel-2 NDVI Time Series", source: "ESA Copernicus", records: "1,240 observations" },
      { name: "Nairobi County Flood Records", source: "Kenya Met Dept", records: "48 events" },
      { name: "Community Survey — Trust Index", source: "Atlas Field Team", records: "2,100 respondents" },
      { name: "Biodiversity Assessment", source: "UNEP-WCMC", records: "340 species tracked" },
    ],
    expertAnnotations: [
      { author: "Dr. Wanjiku M.", note: "Land conflict was predictable — governance readiness should have been assessed pre-implementation.", date: "Aug 2027" },
      { author: "Atlas Review Board", note: "Ecological outcomes exceeded expectations. Social dimension requires deeper modeling.", date: "Oct 2027" },
    ],
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
    rationale: "Remote communities with frequent grid outages; distributed solar with battery storage projected to outperform centralized grid extension by 34% cost-efficiency.",
    baselineConditions: ["Grid uptime: 71%", "Avg outage duration: 8.4 hours", "Households: 1,200", "Nearest grid connection: 45km"],
    expectedOutcomes: [
      { metric: "Grid uptime", predicted: "94%", actual: "97%", delta: "+3%", favorable: true },
      { metric: "Cost per kWh Δ", predicted: "-22%", actual: "-19%", delta: "+3%", favorable: false },
      { metric: "Local employment", predicted: "+12 jobs", actual: "+18 jobs", delta: "+6", favorable: true },
    ],
    learningDelta: "Cooperative maintenance model outperforms centralized servicing assumption",
    timeline: [
      { date: "Mar 2026", event: "Recommendation issued", type: "milestone" },
      { date: "Jul 2026", event: "Installation completed in 4 communities", type: "milestone" },
      { date: "Nov 2026", event: "Uptime exceeding 96% — cooperative model thriving", type: "signal" },
      { date: "Feb 2027", event: "Employment effects stronger than forecast", type: "signal" },
      { date: "Apr 2027", event: "Model v4.2 updated with cooperative effectiveness data", type: "update" },
    ],
    linkedDatasets: [
      { name: "Microgrid Performance Telemetry", source: "SolarEdge API", records: "8.2M readings" },
      { name: "Employment Survey — Oaxaca", source: "INEGI / Atlas Field", records: "480 respondents" },
    ],
    expertAnnotations: [
      { author: "Ing. Carlos R.", note: "Cooperative model success strongly linked to existing community governance structures.", date: "May 2027" },
    ],
  },
  {
    id: "INT-2026-055",
    title: "Regenerative Agriculture Transition — Mekong Delta",
    location: "Mekong Delta, Vietnam",
    type: "Agricultural Resilience",
    dateRecommended: "Aug 2026",
    status: "active",
    confidenceAtIssue: 62,
    rationale: "Soil degradation accelerating; regenerative practices projected to stabilize yields while reducing chemical dependency over 3-year transition.",
    baselineConditions: ["Soil organic carbon: 1.2%", "Chemical input cost: $340/ha/yr", "Yield volatility: ±22%", "Participating farms: 180"],
    expectedOutcomes: [
      { metric: "Soil carbon Δ", predicted: "+14%", delta: "pending" },
      { metric: "Crop yield stability", predicted: "+8%", delta: "pending" },
      { metric: "Chemical input reduction", predicted: "-35%", delta: "pending" },
    ],
    timeline: [
      { date: "Aug 2026", event: "Recommendation issued", type: "milestone" },
      { date: "Oct 2026", event: "First cohort of 60 farms enrolled", type: "milestone" },
      { date: "Jan 2027", event: "Initial soil sampling completed", type: "signal" },
    ],
    linkedDatasets: [
      { name: "Soil Carbon Monitoring", source: "IRRI / Atlas Sensors", records: "540 samples" },
      { name: "Farm Yield Tracking", source: "Mekong Ag Cooperative", records: "180 farms" },
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
    rationale: "Centralized health facility access below 30% in target settlements; CHW network predicted to improve early detection at 60% lower cost.",
    baselineConditions: ["Health facility access: 28%", "Early detection rate: 41%", "Population mobility: high", "CHW ratio target: 1:200"],
    expectedOutcomes: [
      { metric: "Early detection rate", predicted: "+24%", actual: "+31%", delta: "+7%", favorable: true },
      { metric: "Hospitalization Δ", predicted: "-15%", actual: "-11%", delta: "+4%", favorable: false },
      { metric: "Community coverage", predicted: "68%", actual: "52%", delta: "-16%", favorable: false },
    ],
    learningDelta: "Coverage model underestimated informal settlement mobility patterns",
    timeline: [
      { date: "Nov 2025", event: "Recommendation issued", type: "milestone" },
      { date: "Feb 2026", event: "CHW network deployed — 340 workers", type: "milestone" },
      { date: "Jun 2026", event: "Detection rate exceeds forecast", type: "signal" },
      { date: "Sep 2026", event: "Coverage shortfall identified — mobility factor", type: "signal" },
      { date: "Nov 2026", event: "Model updated with mobility patterns", type: "update" },
    ],
    linkedDatasets: [
      { name: "CHW Activity Reports", source: "BRAC / Atlas", records: "24,000 visits" },
      { name: "Hospital Admission Records", source: "DGHS Bangladesh", records: "3,200 records" },
    ],
    expertAnnotations: [
      { author: "Dr. Fatima K.", note: "Settlement populations shift 15-20% seasonally. Static coverage models will always underperform here.", date: "Oct 2026" },
    ],
  },
];

const statusStyles: Record<string, string> = {
  active: "bg-atlas-info/15 text-atlas-info border-atlas-info/30",
  monitoring: "bg-atlas-warning/15 text-atlas-warning border-atlas-warning/30",
  completed: "bg-atlas-positive/15 text-atlas-positive border-atlas-positive/30",
  rejected: "bg-atlas-negative/15 text-atlas-negative border-atlas-negative/30",
};

const timelineTypeStyles: Record<string, string> = {
  milestone: "bg-atlas-info",
  signal: "bg-atlas-warning",
  update: "bg-atlas-positive",
};

function InterventionModal({ item, open, onOpenChange }: { item: InterventionData; open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[11px] text-muted-foreground">{item.id}</span>
            <Badge className={cn("text-[10px] font-mono border", statusStyles[item.status])}>{item.status}</Badge>
          </div>
          <DialogTitle className="text-base font-bold text-foreground">{item.title}</DialogTitle>
          <DialogDescription className="text-xs">{item.location} · {item.type} · Confidence at issue: <span className="font-mono font-bold">{item.confidenceAtIssue}%</span></DialogDescription>
        </DialogHeader>

        {/* Rationale */}
        {item.rationale && (
          <div className="p-3 rounded-md bg-secondary/50 border border-border">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 font-medium">Rationale</div>
            <p className="text-xs text-foreground/80 leading-relaxed">{item.rationale}</p>
          </div>
        )}

        {/* Baseline Conditions */}
        {item.baselineConditions && (
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-medium">Baseline Conditions</div>
            <div className="grid grid-cols-2 gap-1.5">
              {item.baselineConditions.map((c, i) => (
                <div key={i} className="text-[11px] font-mono text-foreground/70 px-2 py-1 rounded bg-muted/50">{c}</div>
              ))}
            </div>
          </div>
        )}

        {/* Outcomes Table */}
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-medium">Outcome Comparison</div>
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
        </div>

        {/* Evidence Timeline */}
        {item.timeline && (
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-medium">Evidence Timeline</div>
            <div className="relative pl-4 space-y-3">
              <div className="absolute left-[7px] top-1 bottom-1 w-px bg-border" />
              {item.timeline.map((t, i) => (
                <div key={i} className="relative flex items-start gap-3">
                  <div className={cn("absolute left-[-13px] top-1 w-2.5 h-2.5 rounded-full border-2 border-card", timelineTypeStyles[t.type])} />
                  <div className="flex-1">
                    <span className="font-mono text-[10px] text-muted-foreground">{t.date}</span>
                    <p className="text-xs text-foreground/80">{t.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Linked Datasets */}
        {item.linkedDatasets && (
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-medium">Linked Datasets</div>
            <div className="space-y-1.5">
              {item.linkedDatasets.map((d, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded bg-muted/30 border border-border">
                  <div>
                    <span className="text-xs font-medium text-foreground">{d.name}</span>
                    <span className="text-[10px] text-muted-foreground ml-2">· {d.source}</span>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">{d.records}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expert Annotations */}
        {item.expertAnnotations && (
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-medium">Expert Annotations</div>
            <div className="space-y-2">
              {item.expertAnnotations.map((a, i) => (
                <div key={i} className="p-2.5 rounded-md bg-primary/5 border border-primary/10">
                  <p className="text-xs text-foreground/80 leading-relaxed italic">"{a.note}"</p>
                  <p className="text-[10px] text-muted-foreground mt-1">— {a.author}, {a.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning Delta */}
        {item.learningDelta && (
          <div className="p-3 rounded-md bg-primary/5 border border-primary/10">
            <div className="text-[10px] uppercase tracking-wider text-primary mb-1 font-medium">Learning Delta</div>
            <p className="text-xs text-foreground/80 leading-relaxed">{item.learningDelta}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function InterventionTracker() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedItem = interventions.find((i) => i.id === selectedId);

  return (
    <div className="space-y-3">
      {interventions.map((item, i) => (
        <div
          key={item.id}
          onClick={() => setSelectedId(item.id)}
          className="animate-fade-in-up rounded-lg border border-border bg-card p-5 hover:border-primary/20 transition-all duration-300 group cursor-pointer"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[11px] text-muted-foreground">{item.id}</span>
                <Badge className={cn("text-[10px] font-mono border", statusStyles[item.status])}>{item.status}</Badge>
                <span className="text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity">Click to expand →</span>
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

      {selectedItem && (
        <InterventionModal item={selectedItem} open={!!selectedId} onOpenChange={(v) => !v && setSelectedId(null)} />
      )}
    </div>
  );
}
