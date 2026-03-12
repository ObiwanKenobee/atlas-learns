import { useState } from "react";
import { cn } from "@/lib/utils";
import { useModelVersions, useDeleteModelVersion } from "@/hooks/useModelVersions";
import { useAuth } from "@/hooks/useAuth";
import { ModelVersionForm } from "./ModelVersionForm";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function ModelUpdateLog() {
  const { data: versions, isLoading } = useModelVersions();
  const deleteVersion = useDeleteModelVersion();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-4 animate-pulse">
            <div className="h-3 bg-muted rounded w-1/3 mb-2" />
            <div className="h-3 bg-muted rounded w-2/3 mb-3" />
            <div className="h-12 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  const logs = versions ?? [];

  return (
    <div className="space-y-3">
      {user && (
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Version
        </button>
      )}

      {logs.map((log, i) => {
        const shifts = (log.parameter_shifts as any[]) || [];
        const domains = log.affected_domains || [];

        return (
          <div
            key={log.id}
            className="animate-fade-in-up rounded-lg border border-border bg-card p-4 hover:border-primary/20 transition-all duration-300"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-primary">{log.version_from} → {log.version_to}</span>
                <span className="text-[11px] text-muted-foreground">· {new Date(log.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
              </div>
              {user && (
                <button
                  onClick={() => {
                    if (confirm("Delete this model version?")) {
                      deleteVersion.mutate(log.id, {
                        onSuccess: () => toast({ title: "Deleted" }),
                        onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
                      });
                    }
                  }}
                  className="p-1 rounded hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-3 h-3 text-atlas-negative" />
                </button>
              )}
            </div>
            <p className="text-xs text-foreground/80 leading-relaxed mb-3">{log.trigger_description}</p>

            {shifts.length > 0 && (
              <div className="space-y-1.5 mb-3">
                {shifts.map((s: any, j: number) => (
                  <div key={j} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{s.param}</span>
                    <span className={cn("font-mono font-medium", s.direction === "up" ? "text-atlas-positive" : "text-atlas-negative")}>
                      {s.change}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-1.5 flex-wrap">
              {domains.map((d: string) => (
                <span key={d} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{d}</span>
              ))}
            </div>
          </div>
        );
      })}

      <ModelVersionForm open={showForm} onOpenChange={setShowForm} />
    </div>
  );
}
