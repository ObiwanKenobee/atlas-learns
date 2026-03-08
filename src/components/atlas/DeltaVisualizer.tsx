import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const deltaData = [
  { metric: "Flood reduction", predicted: 18, actual: 14, delta: -4 },
  { metric: "Biodiversity", predicted: 9, actual: 15, delta: 6 },
  { metric: "Maint. cost", predicted: -12, actual: -8, delta: 4 },
  { metric: "Community trust", predicted: 7, actual: -3, delta: -10 },
  { metric: "Grid uptime", predicted: 94, actual: 97, delta: 3 },
  { metric: "Employment", predicted: 12, actual: 18, delta: 6 },
  { metric: "Detection rate", predicted: 24, actual: 31, delta: 7 },
  { metric: "Coverage", predicted: 68, actual: 52, delta: -16 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-md border border-border bg-card p-3 shadow-lg">
      <p className="text-xs font-medium text-foreground mb-1">{d.metric}</p>
      <p className="text-xs font-mono text-muted-foreground">Predicted: {d.predicted}%</p>
      <p className="text-xs font-mono text-muted-foreground">Actual: {d.actual}%</p>
      <p className="text-xs font-mono font-bold" style={{ color: d.delta >= 0 ? "hsl(173, 58%, 46%)" : "hsl(0, 62%, 55%)" }}>
        Delta: {d.delta > 0 ? "+" : ""}{d.delta}%
      </p>
    </div>
  );
};

export function DeltaVisualizer() {
  return (
    <div className="animate-fade-in-up rounded-lg border border-border bg-card p-5" style={{ animationDelay: "150ms" }}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Prediction Delta</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Deviation between forecast and observed outcomes</p>
      </div>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={deltaData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
            <XAxis dataKey="metric" tick={{ fontSize: 9, fill: "hsl(215, 12%, 50%)" }} axisLine={{ stroke: "hsl(220, 14%, 18%)" }} tickLine={false} angle={-20} textAnchor="end" height={50} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(215, 12%, 50%)" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="hsl(220, 14%, 25%)" />
            <Bar dataKey="delta" radius={[3, 3, 0, 0]}>
              {deltaData.map((entry, i) => (
                <rect key={i} fill={entry.delta >= 0 ? "hsl(173, 58%, 46%)" : "hsl(0, 62%, 55%)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
