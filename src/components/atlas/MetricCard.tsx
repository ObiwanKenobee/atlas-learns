import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  confidence?: "high" | "medium" | "low";
  subtitle?: string;
  delay?: number;
}

export function MetricCard({ label, value, trend, trendDirection = "neutral", confidence, subtitle, delay = 0 }: MetricCardProps) {
  const trendColor = trendDirection === "up" ? "text-atlas-positive" : trendDirection === "down" ? "text-atlas-negative" : "text-atlas-neutral";
  const confidenceColor = confidence === "high" ? "bg-atlas-positive/20 text-atlas-positive" : confidence === "medium" ? "bg-atlas-warning/20 text-atlas-warning" : "bg-atlas-negative/20 text-atlas-negative";

  return (
    <div
      className="animate-fade-in-up rounded-lg border border-border bg-card p-5 hover:border-primary/30 transition-all duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
        {confidence && (
          <Badge className={cn("text-[10px] font-mono border-0", confidenceColor)}>
            {confidence}
          </Badge>
        )}
      </div>
      <div className="font-mono text-2xl font-bold text-foreground tracking-tight">{value}</div>
      <div className="mt-2 flex items-center gap-2">
        {trend && <span className={cn("font-mono text-xs font-medium", trendColor)}>{trend}</span>}
        {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
      </div>
    </div>
  );
}
