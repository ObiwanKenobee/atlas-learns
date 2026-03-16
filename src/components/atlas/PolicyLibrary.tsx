import { useState } from "react";
import { cn } from "@/lib/utils";
import { usePolicyPatterns, useDeletePolicyPattern, type PolicyPattern } from "@/hooks/usePolicyPatterns";
import { useAuth } from "@/hooks/useAuth";
import { PolicyPatternForm } from "./PolicyPatternForm";
import { Plus, Trash2, Pencil } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const confStyles: Record<string, string> = {
  high: "bg-atlas-positive/10 text-atlas-positive border-atlas-positive/20",
  medium: "bg-atlas-warning/10 text-atlas-warning border-atlas-warning/20",
  emerging: "bg-atlas-info/10 text-atlas-info border-atlas-info/20",
};

export function PolicyLibrary() {
  const { data: patterns, isLoading } = usePolicyPatterns();
  const deletePattern = useDeletePolicyPattern();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<PolicyPattern | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-2.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-4 animate-pulse">
            <div className="h-3 bg-muted rounded w-full mb-2" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  const policies = patterns ?? [];

  return (
    <div className="space-y-2.5">
      {user && (
        <button
          onClick={() => { setEditItem(null); setShowForm(true); }}
          className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Pattern
        </button>
      )}

      {policies.map((p, i) => (
        <div
          key={p.id}
          className="animate-fade-in-up rounded-lg border border-border bg-card p-4 hover:border-primary/20 transition-all duration-300"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <p className="text-xs text-foreground leading-relaxed mb-2.5">{p.insight}</p>
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5 flex-wrap">
              {(p.domains || []).map((d: string) => (
                <span key={d} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">{d}</span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">{p.source}</span>
              <span className={cn("text-[10px] font-mono px-1.5 py-0.5 rounded border", confStyles[p.confidence] || "")}>{p.confidence}</span>
              {user && (
                <>
                  <button
                    onClick={() => { setEditItem(p); setShowForm(true); }}
                    className="p-1 rounded hover:bg-primary/10 transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-3 h-3 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete this pattern?")) {
                        deletePattern.mutate(p.id, {
                          onSuccess: () => toast({ title: "Deleted" }),
                          onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
                        });
                      }
                    }}
                    className="p-1 rounded hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-3 h-3 text-atlas-negative" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}

      <PolicyPatternForm open={showForm} onOpenChange={(v) => { setShowForm(v); if (!v) setEditItem(null); }} editItem={editItem} />
    </div>
  );
}
