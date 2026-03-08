import { useState } from "react";
import { MetricCard } from "@/components/atlas/MetricCard";
import { InterventionTracker } from "@/components/atlas/InterventionTracker";
import { ForecastComparison } from "@/components/atlas/ForecastComparison";
import { ModelUpdateLog } from "@/components/atlas/ModelUpdateLog";
import { ConfidenceCalibration } from "@/components/atlas/ConfidenceCalibration";
import { LearningGaps } from "@/components/atlas/LearningGaps";
import { PolicyLibrary } from "@/components/atlas/PolicyLibrary";
import { DeltaVisualizer } from "@/components/atlas/DeltaVisualizer";
import { CounterfactualExplorer } from "@/components/atlas/CounterfactualExplorer";
import { GeospatialMap } from "@/components/atlas/GeospatialMap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const filters = {
  timeHorizon: ["6 months", "1 year", "3 years", "5 years"],
  sector: ["All Sectors", "Flood Mitigation", "Energy", "Health", "Agriculture", "Ecosystem"],
};

export default function Dashboard() {
  const [timeHorizon, setTimeHorizon] = useState("1 year");
  const [sector, setSector] = useState("All Sectors");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-primary">
                  <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 1v3M8 12v3M1 8h3M12 8h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M3.5 3.5l2 2M10.5 10.5l2 2M3.5 12.5l2-2M10.5 5.5l2-2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
                </svg>
              </div>
              <div>
                <h1 className="text-sm font-bold text-foreground tracking-tight">Atlas Adaptive Learning</h1>
                <p className="text-[11px] text-muted-foreground">Decision feedback · Consequence tracking · Model improvement</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-atlas-positive/10 border border-atlas-positive/20">
                <span className="w-1.5 h-1.5 rounded-full bg-atlas-positive animate-pulse-subtle"></span>
                <span className="text-[10px] font-mono text-atlas-positive">LEARNING ACTIVE</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">Model v4.3</span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border flex-wrap">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Filters</span>
            <div className="flex gap-1.5">
              {filters.timeHorizon.map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeHorizon(t)}
                  className={`text-[11px] px-2.5 py-1 rounded-md transition-all ${
                    timeHorizon === t
                      ? "bg-primary/15 text-primary border border-primary/30 font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex gap-1.5 flex-wrap">
              {filters.sector.map((s) => (
                <button
                  key={s}
                  onClick={() => setSector(s)}
                  className={`text-[11px] px-2.5 py-1 rounded-md transition-all ${
                    sector === s
                      ? "bg-primary/15 text-primary border border-primary/30 font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-6">
        {/* Hero Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <MetricCard label="Learning Score" value="76%" trend="↑ 4.2%" trendDirection="up" confidence="high" subtitle="vs last quarter" delay={0} />
          <MetricCard label="Forecast Accuracy" value="74%" trend="↑ 2.1%" trendDirection="up" confidence="medium" subtitle="rolling 12mo" delay={50} />
          <MetricCard label="Calibration" value="Med-High" trend="stable" trendDirection="neutral" subtitle="confidence alignment" delay={100} />
          <MetricCard label="Outcome Coverage" value="67%" trend="↑ 8%" trendDirection="up" confidence="medium" subtitle="interventions measured" delay={150} />
          <MetricCard label="Fastest Improving" value="Watershed" trend="↑ 12%" trendDirection="up" subtitle="policy domain" delay={200} />
          <MetricCard label="Most Uncertain" value="Urban Mig." trend="↓ 3%" trendDirection="down" confidence="low" subtitle="needs more data" delay={250} />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-secondary/50 border border-border flex-wrap h-auto gap-0.5 p-1">
            <TabsTrigger value="overview" className="text-xs data-[state=active]:bg-card">Overview</TabsTrigger>
            <TabsTrigger value="interventions" className="text-xs data-[state=active]:bg-card">Interventions</TabsTrigger>
            <TabsTrigger value="counterfactual" className="text-xs data-[state=active]:bg-card">Counterfactual</TabsTrigger>
            <TabsTrigger value="geospatial" className="text-xs data-[state=active]:bg-card">Geospatial</TabsTrigger>
            <TabsTrigger value="models" className="text-xs data-[state=active]:bg-card">Model Updates</TabsTrigger>
            <TabsTrigger value="policies" className="text-xs data-[state=active]:bg-card">Policy Library</TabsTrigger>
            <TabsTrigger value="gaps" className="text-xs data-[state=active]:bg-card">Learning Gaps</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-7 space-y-4">
                <ForecastComparison />
                <DeltaVisualizer />
              </div>
              <div className="lg:col-span-5 space-y-4">
                <ConfidenceCalibration />
                <div className="rounded-lg border border-border bg-card p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Recent Model Updates</h3>
                  <ModelUpdateLog />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="interventions">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-8">
                <InterventionTracker />
              </div>
              <div className="lg:col-span-4 space-y-4">
                <DeltaVisualizer />
                <div className="rounded-lg border border-border bg-card p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Intervention Summary</h3>
                  <p className="text-xs text-muted-foreground mb-4">Active tracking across all domains</p>
                  <div className="space-y-3">
                    {[
                      { label: "Active", count: 12, color: "bg-atlas-info" },
                      { label: "Monitoring", count: 8, color: "bg-atlas-warning" },
                      { label: "Completed", count: 23, color: "bg-atlas-positive" },
                      { label: "Rejected", count: 3, color: "bg-atlas-negative" },
                    ].map((s) => (
                      <div key={s.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${s.color}`} />
                          <span className="text-xs text-foreground">{s.label}</span>
                        </div>
                        <span className="font-mono text-xs font-bold text-foreground">{s.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="counterfactual">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-8">
                <CounterfactualExplorer />
              </div>
              <div className="lg:col-span-4 space-y-4">
                <ConfidenceCalibration />
                <div className="rounded-lg border border-border bg-card p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Counterfactual Coverage</h3>
                  <p className="text-xs text-muted-foreground mb-4">How many interventions have modeled alternatives?</p>
                  <div className="space-y-3">
                    {[
                      { label: "Full counterfactual", pct: 28, color: "bg-atlas-positive" },
                      { label: "Partial comparison", pct: 35, color: "bg-atlas-warning" },
                      { label: "No alternative modeled", pct: 37, color: "bg-atlas-neutral" },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-foreground">{item.label}</span>
                          <span className="font-mono text-muted-foreground">{item.pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div className={`h-full rounded-full ${item.color} transition-all`} style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="geospatial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-8">
                <GeospatialMap />
              </div>
              <div className="lg:col-span-4 space-y-4">
                <DeltaVisualizer />
                <div className="rounded-lg border border-border bg-card p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Regional Summary</h3>
                  <p className="text-xs text-muted-foreground mb-4">Intervention distribution by region</p>
                  <div className="space-y-3">
                    {[
                      { label: "Sub-Saharan Africa", count: 14, accuracy: "76%" },
                      { label: "South Asia", count: 9, accuracy: "71%" },
                      { label: "Southeast Asia", count: 7, accuracy: "—" },
                      { label: "Latin America", count: 11, accuracy: "84%" },
                      { label: "Other", count: 5, accuracy: "69%" },
                    ].map((r) => (
                      <div key={r.label} className="flex items-center justify-between">
                        <span className="text-xs text-foreground">{r.label}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[10px] text-muted-foreground">{r.count} interventions</span>
                          <span className="font-mono text-xs font-bold text-foreground w-8 text-right">{r.accuracy}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="models">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-7">
                <div className="rounded-lg border border-border bg-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">Model Update Audit Log</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Every change Atlas made to its reasoning</p>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">4 updates this quarter</span>
                  </div>
                  <ModelUpdateLog />
                </div>
              </div>
              <div className="lg:col-span-5 space-y-4">
                <ConfidenceCalibration />
                <ForecastComparison />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="policies">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-8">
                <div className="rounded-lg border border-border bg-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">Policy Learning Library</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Structured strategic knowledge from repeated intervention outcomes</p>
                    </div>
                    <span className="text-[10px] font-mono text-atlas-positive">6 validated patterns</span>
                  </div>
                  <PolicyLibrary />
                </div>
              </div>
              <div className="lg:col-span-4">
                <DeltaVisualizer />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gaps">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-7">
                <div className="rounded-lg border border-border bg-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">Learning Gaps & Unknowns</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Where Atlas still doesn't know enough to learn reliably</p>
                    </div>
                    <span className="text-[10px] font-mono text-atlas-negative">2 critical gaps</span>
                  </div>
                  <LearningGaps />
                </div>
              </div>
              <div className="lg:col-span-5 space-y-4">
                <ConfidenceCalibration />
                <div className="rounded-lg border border-border bg-card p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Epistemic Health</h3>
                  <p className="text-xs text-muted-foreground mb-4">How honest is Atlas about what it doesn't know?</p>
                  <div className="space-y-3">
                    {[
                      { label: "Known knowns", pct: 38, color: "bg-atlas-positive" },
                      { label: "Known unknowns", pct: 29, color: "bg-atlas-warning" },
                      { label: "Suspected unknowns", pct: 21, color: "bg-atlas-negative" },
                      { label: "Unmeasured", pct: 12, color: "bg-atlas-neutral" },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-foreground">{item.label}</span>
                          <span className="font-mono text-muted-foreground">{item.pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div className={`h-full rounded-full ${item.color} transition-all`} style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-8 pt-4 border-t border-border flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground font-mono">
            Atlas Adaptive Learning Loops · Last model retrain: 12 days ago · Next scheduled: 4 days
          </p>
          <p className="text-[10px] text-muted-foreground">
            "Optimized for becoming smarter, not appearing smart."
          </p>
        </footer>
      </main>
    </div>
  );
}
