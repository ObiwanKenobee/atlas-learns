import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const calibrationData = [
  { confidence: 92, accuracy: 88, type: "Flood", label: "High conf, correct" },
  { confidence: 85, accuracy: 82, type: "Flood", label: "High conf, correct" },
  { confidence: 78, accuracy: 74, type: "Ecosystem", label: "Med conf, correct" },
  { confidence: 88, accuracy: 61, type: "Health", label: "High conf, WRONG" },
  { confidence: 62, accuracy: 58, type: "Energy", label: "Low conf, correct" },
  { confidence: 71, accuracy: 75, type: "Agriculture", label: "Med conf, correct" },
  { confidence: 45, accuracy: 72, type: "Migration", label: "Low conf, underconf" },
  { confidence: 55, accuracy: 50, type: "Governance", label: "Low conf, correct" },
  { confidence: 82, accuracy: 43, type: "Urban", label: "High conf, WRONG" },
  { confidence: 68, accuracy: 71, type: "Ecosystem", label: "Med conf, correct" },
  { confidence: 76, accuracy: 78, type: "Energy", label: "Med conf, correct" },
  { confidence: 91, accuracy: 89, type: "Flood", label: "High conf, correct" },
  { confidence: 38, accuracy: 35, type: "Migration", label: "Low conf, expected" },
  { confidence: 84, accuracy: 80, type: "Agriculture", label: "High conf, correct" },
  { confidence: 73, accuracy: 52, type: "Health", label: "Med conf, missed" },
];

const getColor = (confidence: number, accuracy: number) => {
  const diff = Math.abs(confidence - accuracy);
  if (diff <= 10 && accuracy >= 60) return "hsl(173, 58%, 46%)"; // well-calibrated
  if (confidence > accuracy + 15) return "hsl(0, 62%, 55%)"; // overconfident
  if (accuracy > confidence + 15) return "hsl(38, 80%, 55%)"; // underconfident
  return "hsl(215, 12%, 50%)"; // neutral
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-md border border-border bg-card p-3 shadow-lg">
      <p className="text-xs font-medium text-foreground mb-1">{d.type}</p>
      <p className="text-xs font-mono text-muted-foreground">Confidence: {d.confidence}%</p>
      <p className="text-xs font-mono text-muted-foreground">Accuracy: {d.accuracy}%</p>
      <p className="text-[10px] text-atlas-neutral mt-1">{d.label}</p>
    </div>
  );
};

export function ConfidenceCalibration() {
  return (
    <div className="animate-fade-in-up rounded-lg border border-border bg-card p-5" style={{ animationDelay: "200ms" }}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Confidence Calibration</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Is Atlas confident when it should be?</p>
      </div>
      <div className="flex gap-4 mb-3 text-[10px]">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-atlas-positive inline-block"></span>Well-calibrated</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-atlas-negative inline-block"></span>Overconfident</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-atlas-warning inline-block"></span>Underconfident</span>
      </div>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
            <XAxis type="number" dataKey="confidence" name="Confidence" domain={[20, 100]}
              tick={{ fontSize: 10, fill: "hsl(215, 12%, 50%)" }} axisLine={{ stroke: "hsl(220, 14%, 18%)" }} tickLine={false}
              label={{ value: "Confidence %", position: "insideBottom", offset: -2, fontSize: 10, fill: "hsl(215, 12%, 50%)" }} />
            <YAxis type="number" dataKey="accuracy" name="Accuracy" domain={[20, 100]}
              tick={{ fontSize: 10, fill: "hsl(215, 12%, 50%)" }} axisLine={false} tickLine={false}
              label={{ value: "Accuracy %", angle: -90, position: "insideLeft", offset: 30, fontSize: 10, fill: "hsl(215, 12%, 50%)" }} />
            <Tooltip content={<CustomTooltip />} />
            <Scatter data={calibrationData}>
              {calibrationData.map((entry, i) => (
                <Cell key={i} fill={getColor(entry.confidence, entry.accuracy)} fillOpacity={0.8} r={6} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      {/* Perfect calibration line note */}
      <p className="text-[10px] text-muted-foreground text-center mt-2">Points on the diagonal = perfectly calibrated predictions</p>
    </div>
  );
}
