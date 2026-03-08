import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const forecastData = [
  { month: "Jan", predicted: 72, actual: 68, confidence_upper: 82, confidence_lower: 62 },
  { month: "Feb", predicted: 74, actual: 71, confidence_upper: 84, confidence_lower: 64 },
  { month: "Mar", predicted: 71, actual: 75, confidence_upper: 81, confidence_lower: 61 },
  { month: "Apr", predicted: 69, actual: 64, confidence_upper: 79, confidence_lower: 59 },
  { month: "May", predicted: 73, actual: 70, confidence_upper: 83, confidence_lower: 63 },
  { month: "Jun", predicted: 76, actual: 74, confidence_upper: 86, confidence_lower: 66 },
  { month: "Jul", predicted: 78, actual: 82, confidence_upper: 88, confidence_lower: 68 },
  { month: "Aug", predicted: 75, actual: 77, confidence_upper: 85, confidence_lower: 65 },
  { month: "Sep", predicted: 79, actual: 76, confidence_upper: 89, confidence_lower: 69 },
  { month: "Oct", predicted: 81, actual: 79, confidence_upper: 91, confidence_lower: 71 },
  { month: "Nov", predicted: 83, actual: 85, confidence_upper: 93, confidence_lower: 73 },
  { month: "Dec", predicted: 80, actual: null, confidence_upper: 90, confidence_lower: 70 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-card p-3 shadow-lg">
      <p className="text-xs font-medium text-foreground mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        entry.name !== "confidence_upper" && entry.name !== "confidence_lower" && (
          <p key={i} className="text-xs font-mono" style={{ color: entry.color }}>
            {entry.name === "predicted" ? "Predicted" : "Actual"}: {entry.value ?? "—"}%
          </p>
        )
      ))}
    </div>
  );
};

export function ForecastComparison() {
  return (
    <div className="animate-fade-in-up rounded-lg border border-border bg-card p-5" style={{ animationDelay: "100ms" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Forecast vs Reality</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Recommendation accuracy over time with confidence bands</p>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-atlas-info rounded-full inline-block"></span> Predicted</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-atlas-positive rounded-full inline-block"></span> Actual</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-atlas-info/10 border border-atlas-info/20 rounded-sm inline-block"></span> Confidence</span>
        </div>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecastData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(210, 60%, 55%)" stopOpacity={0.15} />
                <stop offset="100%" stopColor="hsl(210, 60%, 55%)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(215, 12%, 50%)" }} axisLine={{ stroke: "hsl(220, 14%, 18%)" }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(215, 12%, 50%)" }} axisLine={false} tickLine={false} domain={[50, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="confidence_upper" stroke="none" fill="url(#confidenceBand)" />
            <Area type="monotone" dataKey="confidence_lower" stroke="none" fill="hsl(220, 20%, 7%)" />
            <Line type="monotone" dataKey="predicted" stroke="hsl(210, 60%, 55%)" strokeWidth={2} dot={false} strokeDasharray="6 3" />
            <Line type="monotone" dataKey="actual" stroke="hsl(173, 58%, 46%)" strokeWidth={2} dot={{ r: 3, fill: "hsl(173, 58%, 46%)" }} connectNulls={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
