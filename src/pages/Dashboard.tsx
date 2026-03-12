import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Download, LogIn, LogOut } from "lucide-react";
import { exportInterventionsCsv, exportModelLogsCsv, exportPolicyLibraryCsv, exportFullReportCsv } from "@/lib/export";
import { NotificationBadge } from "@/components/atlas/NotificationBadge";
import { useAuth } from "@/hooks/useAuth";

const filters = {
  timeHorizon: ["6 months", "1 year", "3 years", "5 years"],
  sector: ["All Sectors", "Flood Mitigation", "Energy", "Health", "Agriculture", "Ecosystem"],
};

function ExportButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-md bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border transition-all"
      title={`Export ${label}`}
    >
      <Download className="w-3 h-3" />
      <span className="hidden sm:inline">Export</span>
    </button>
  );
}

export default function Dashboard() {
  const [timeHorizon, setTimeHorizon] = useState("1 year");
  const [sector, setSector] = useState("All Sectors");
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-primary">
                  <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 1v3M8 12v3M1 8h3M12 8h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M3.5 3.5l2 2M10.5 10.5l2 2M3.5 12.5l2-2M10.5 5.5l2-2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
                </svg>
              </div>
              <div className="min-w-0">
                <h1 className="text-xs sm:text-sm font-bold text-foreground tracking-tight truncate">Atlas Adaptive Learning</h1>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate">Decision feedback · Consequence tracking</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <div className="flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-md bg-atlas-positive/10 border border-atlas-positive/20">
                <span className="w-1.5 h-1.5 rounded-full bg-atlas-positive animate-pulse-subtle"></span>
                <span className="text-[9px] sm:text-[10px] font-mono text-atlas-positive">ACTIVE</span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-mono text-muted-foreground hidden sm:inline">Model v4.3</span>
              <NotificationBadge />
              <ExportButton onClick={exportFullReportCsv} label="Full Report" />
            </div>
          </div>

          {/* Filters — horizontal scroll on mobile */}
          <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-border overflow-x-auto scrollbar-hide">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground shrink-0">Filters</span>
            <div className="flex gap-1 shrink-0">
              {filters.timeHorizon.map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeHorizon(t)}
                  className={`text-[10px] sm:text-[11px] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md transition-all whitespace-nowrap ${
                    timeHorizon === t
                      ? "bg-primary/15 text-primary border border-primary/30 font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="w-px h-4 bg-border shrink-0" />
            <div className="flex gap-1 shrink-0">
              {filters.sector.map((s) => (
                <button
                  key={s}
                  onClick={() => setSector(s)}
                  className={`text-[10px] sm:text-[11px] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md transition-all whitespace-nowrap ${
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

      <main className="max-w-[1600px] mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* Hero Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <MetricCard label="Learning Score" value="76%" trend="↑ 4.2%" trendDirection="up" confidence="high" subtitle="vs last quarter" delay={0} />
          <MetricCard label="Forecast Accuracy" value="74%" trend="↑ 2.1%" trendDirection="up" confidence="medium" subtitle="rolling 12mo" delay={50} />
          <MetricCard label="Calibration" value="Med-High" trend="stable" trendDirection="neutral" subtitle="confidence alignment" delay={100} />
          <MetricCard label="Outcome Coverage" value="67%" trend="↑ 8%" trendDirection="up" confidence="medium" subtitle="interventions measured" delay={150} />
          <MetricCard label="Fastest Improving" value="Watershed" trend="↑ 12%" trendDirection="up" subtitle="policy domain" delay={200} />
          <MetricCard label="Most Uncertain" value="Urban Mig." trend="↓ 3%" trendDirection="down" confidence="low" subtitle="needs more data" delay={250} />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-3 sm:space-y-4">
          <div className="overflow-x-auto scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0">
            <TabsList className="bg-secondary/50 border border-border h-auto gap-0.5 p-1 inline-flex w-auto min-w-full sm:min-w-0">
              <TabsTrigger value="overview" className="text-[10px] sm:text-xs data-[state=active]:bg-card px-2 sm:px-3">Overview</TabsTrigger>
              <TabsTrigger value="interventions" className="text-[10px] sm:text-xs data-[state=active]:bg-card px-2 sm:px-3">Interventions</TabsTrigger>
              <TabsTrigger value="counterfactual" className="text-[10px] sm:text-xs data-[state=active]:bg-card px-2 sm:px-3">Counterfactual</TabsTrigger>
              <TabsTrigger value="geospatial" className="text-[10px] sm:text-xs data-[state=active]:bg-card px-2 sm:px-3">Geospatial</TabsTrigger>
              <TabsTrigger value="models" className="text-[10px] sm:text-xs data-[state=active]:bg-card px-2 sm:px-3">Models</TabsTrigger>
              <TabsTrigger value="policies" className="text-[10px] sm:text-xs data-[state=active]:bg-card px-2 sm:px-3">Policies</TabsTrigger>
              <TabsTrigger value="gaps" className="text-[10px] sm:text-xs data-[state=active]:bg-card px-2 sm:px-3">Gaps</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
              <div className="lg:col-span-7 space-y-3 sm:space-y-4">
                <ForecastComparison />
                <DeltaVisualizer />
              </div>
              <div className="lg:col-span-5 space-y-3 sm:space-y-4">
                <ConfidenceCalibration />
                <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Recent Model Updates</h3>
                  <ModelUpdateLog />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="interventions">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
              <div className="lg:col-span-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground">Intervention Tracker</h3>
                  <ExportButton onClick={exportInterventionsCsv} label="Interventions" />
                </div>
                <InterventionTracker />
              </div>
              <div className="lg:col-span-4 space-y-3 sm:space-y-4">
                <DeltaVisualizer />
                <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
              <div className="lg:col-span-8">
                <CounterfactualExplorer />
              </div>
              <div className="lg:col-span-4 space-y-3 sm:space-y-4">
                <ConfidenceCalibration />
                <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
              <div className="lg:col-span-8">
                <GeospatialMap />
              </div>
              <div className="lg:col-span-4 space-y-3 sm:space-y-4">
                <DeltaVisualizer />
                <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
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
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="font-mono text-[10px] text-muted-foreground">{r.count} int.</span>
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
              <div className="lg:col-span-7">
                <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">Model Update Audit Log</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Every change Atlas made to its reasoning</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-muted-foreground hidden sm:inline">4 updates this quarter</span>
                      <ExportButton onClick={exportModelLogsCsv} label="Model Logs" />
                    </div>
                  </div>
                  <ModelUpdateLog />
                </div>
              </div>
              <div className="lg:col-span-5 space-y-3 sm:space-y-4">
                <ConfidenceCalibration />
                <ForecastComparison />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="policies">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
              <div className="lg:col-span-8">
                <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">Policy Learning Library</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Structured strategic knowledge from repeated outcomes</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-atlas-positive hidden sm:inline">6 validated</span>
                      <ExportButton onClick={exportPolicyLibraryCsv} label="Policies" />
                    </div>
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
              <div className="lg:col-span-7">
                <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">Learning Gaps & Unknowns</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Where Atlas still doesn't know enough</p>
                    </div>
                    <span className="text-[10px] font-mono text-atlas-negative">2 critical gaps</span>
                  </div>
                  <LearningGaps />
                </div>
              </div>
              <div className="lg:col-span-5 space-y-3 sm:space-y-4">
                <ConfidenceCalibration />
                <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
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
        <footer className="mt-6 sm:mt-8 pt-3 sm:pt-4 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
          <p className="text-[9px] sm:text-[10px] text-muted-foreground font-mono">
            Atlas Adaptive Learning Loops · Last retrain: 12d ago · Next: 4d
          </p>
          <p className="text-[9px] sm:text-[10px] text-muted-foreground">
            "Optimized for becoming smarter, not appearing smart."
          </p>
        </footer>
      </main>
    </div>
  );
}
