import { useState } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts";
import { cn } from "@/lib/utils";

interface Scenario {
  id: string;
  name: string;
  type: "chosen" | "alternative" | "actual";
  description: string;
  metrics: Record<string, number>;
}

interface CounterfactualCase {
  id: string;
  title: string;
  location: string;
  scenarios: Scenario[];
  dimensions: string[];
  caveat: string;
}

const cases: CounterfactualCase[] = [
  {
    id: "CF-001",
    title: "Wetland Restoration vs Concrete Barriers — Nairobi",
    location: "Nairobi, Kenya",
    dimensions: ["Flood Reduction", "Biodiversity", "Cost Efficiency", "Community Trust", "Maintenance", "Longevity"],
    caveat: "Alternative scenario is modeled counterfactual based on 6 comparable barrier-only interventions in East Africa. Not directly observed.",
    scenarios: [
      {
        id: "s1", name: "Wetland Restoration (Chosen)", type: "chosen",
        description: "Nature-based flood mitigation through peri-urban wetland restoration",
        metrics: { "Flood Reduction": 68, "Biodiversity": 82, "Cost Efficiency": 74, "Community Trust": 42, "Maintenance": 78, "Longevity": 85 },
      },
      {
        id: "s2", name: "Concrete Barriers (Alternative)", type: "alternative",
        description: "Conventional engineered flood barriers along primary waterways",
        metrics: { "Flood Reduction": 79, "Biodiversity": 22, "Cost Efficiency": 48, "Community Trust": 61, "Maintenance": 35, "Longevity": 55 },
      },
      {
        id: "s3", name: "Actual Observed", type: "actual",
        description: "Real-world outcomes measured 18 months post-implementation",
        metrics: { "Flood Reduction": 64, "Biodiversity": 88, "Cost Efficiency": 71, "Community Trust": 35, "Maintenance": 75, "Longevity": 80 },
      },
    ],
  },
  {
    id: "CF-002",
    title: "Distributed Solar vs Centralized Grid Extension — Oaxaca",
    location: "Oaxaca, Mexico",
    dimensions: ["Reliability", "Cost/kWh", "Employment", "Scalability", "Maintenance", "Resilience"],
    caveat: "Centralized grid alternative modeled from CFE expansion cost data and regional outage patterns. No direct comparison available.",
    scenarios: [
      {
        id: "s1", name: "Distributed Solar (Chosen)", type: "chosen",
        description: "Community-owned solar microgrids with battery storage",
        metrics: { "Reliability": 89, "Cost/kWh": 78, "Employment": 85, "Scalability": 72, "Maintenance": 81, "Resilience": 91 },
      },
      {
        id: "s2", name: "Grid Extension (Alternative)", type: "alternative",
        description: "45km transmission line extension to centralized grid",
        metrics: { "Reliability": 72, "Cost/kWh": 55, "Employment": 35, "Scalability": 82, "Maintenance": 42, "Resilience": 38 },
      },
      {
        id: "s3", name: "Actual Observed", type: "actual",
        description: "Real performance data from 9 months of operation",
        metrics: { "Reliability": 92, "Cost/kWh": 74, "Employment": 90, "Scalability": 70, "Maintenance": 83, "Resilience": 88 },
      },
    ],
  },
];

const scenarioColors: Record<string, string> = {
  chosen: "hsl(210, 60%, 55%)",
  alternative: "hsl(38, 80%, 55%)",
  actual: "hsl(173, 58%, 46%)",
};

const scenarioLabels: Record<string, string> = {
  chosen: "text-atlas-info",
  alternative: "text-atlas-warning",
  actual: "text-atlas-positive",
};

export function CounterfactualExplorer() {
  const [selectedCase, setSelectedCase] = useState(cases[0].id);
  const activeCase = cases.find((c) => c.id === selectedCase)!;

  const radarData = activeCase.dimensions.map((dim) => {
    const entry: Record<string, any> = { dimension: dim };
    activeCase.scenarios.forEach((s) => {
      entry[s.type] = s.metrics[dim];
    });
    return entry;
  });

  return (
    <div className="animate-fade-in-up rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Counterfactual Explorer</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Compare chosen recommendation vs alternatives vs reality</p>
        </div>
        <div className="flex gap-1.5">
          {cases.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCase(c.id)}
              className={cn("text-[11px] px-2.5 py-1 rounded-md transition-all border",
                selectedCase === c.id
                  ? "bg-primary/15 text-primary border-primary/30 font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary border-transparent"
              )}
            >
              {c.location}
            </button>
          ))}
        </div>
      </div>

      {/* Scenario descriptions */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {activeCase.scenarios.map((s) => (
          <div key={s.id} className="p-2.5 rounded-md bg-muted/30 border border-border">
            <div className={cn("text-[10px] font-mono font-bold mb-1", scenarioLabels[s.type])}>
              {s.type === "chosen" ? "● " : s.type === "alternative" ? "○ " : "◆ "}{s.name}
            </div>
            <p className="text-[11px] text-foreground/70 leading-relaxed">{s.description}</p>
          </div>
        ))}
      </div>

      {/* Radar Chart */}
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid stroke="hsl(220, 14%, 18%)" />
            <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10, fill: "hsl(215, 12%, 50%)" }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fill: "hsl(215, 12%, 40%)" }} />
            <Radar name="Chosen" dataKey="chosen" stroke={scenarioColors.chosen} fill={scenarioColors.chosen} fillOpacity={0.1} strokeWidth={2} />
            <Radar name="Alternative" dataKey="alternative" stroke={scenarioColors.alternative} fill={scenarioColors.alternative} fillOpacity={0.05} strokeWidth={2} strokeDasharray="6 3" />
            <Radar name="Actual" dataKey="actual" stroke={scenarioColors.actual} fill={scenarioColors.actual} fillOpacity={0.15} strokeWidth={2} />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Metric comparison table */}
      <div className="rounded-md border border-border overflow-hidden mt-4">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left p-2 font-medium text-muted-foreground">Dimension</th>
              {activeCase.scenarios.map((s) => (
                <th key={s.id} className={cn("text-right p-2 font-medium", scenarioLabels[s.type])}>{s.type === "chosen" ? "Chosen" : s.type === "alternative" ? "Alternative" : "Actual"}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeCase.dimensions.map((dim) => (
              <tr key={dim} className="border-t border-border">
                <td className="p-2 text-foreground">{dim}</td>
                {activeCase.scenarios.map((s) => {
                  const val = s.metrics[dim];
                  const best = Math.max(...activeCase.scenarios.map((sc) => sc.metrics[dim]));
                  return (
                    <td key={s.id} className={cn("p-2 text-right font-mono", val === best ? "font-bold text-foreground" : "text-muted-foreground")}>
                      {val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Caveat */}
      <div className="mt-3 p-2.5 rounded-md bg-atlas-warning/5 border border-atlas-warning/15">
        <div className="text-[10px] uppercase tracking-wider text-atlas-warning mb-1 font-medium">⚠ Modeled Counterfactual</div>
        <p className="text-[11px] text-foreground/70 leading-relaxed">{activeCase.caveat}</p>
      </div>
    </div>
  );
}
