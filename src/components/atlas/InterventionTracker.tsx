import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useInterventions, useDeleteIntervention, type Intervention } from "@/hooks/useInterventions";
import { useAuth } from "@/hooks/useAuth";
import { InterventionForm } from "./InterventionForm";
import { OutcomeForm } from "./OutcomeForm";
import { Plus, Trash2, Pencil, BarChart3 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  } catch { return d; }
}

function InterventionModal({ item, open, onOpenChange }: { item: Intervention; open: boolean; onOpenChange: (v: boolean) => void }) {
  const timeline = (item.timeline as any[]) || [];
  const linkedDatasets = (item.linked_datasets as any[]) || [];
  const expertAnnotations = (item.expert_annotations as any[]) || [];
  const baselineConditions = (item.baseline_conditions as string[]) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[11px] text-muted-foreground">{item.code}</span>
            <Badge className={cn("text-[10px] font-mono border", statusStyles[item.status] || "")}>{item.status}</Badge>
          </div>
          <DialogTitle className="text-base font-bold text-foreground">{item.title}</DialogTitle>
          <DialogDescription className="text-xs">{item.location} · {item.type} · Confidence at issue: <span className="font-mono font-bold">{item.confidence_at_issue}%</span></DialogDescription>
        </DialogHeader>

        {item.rationale && (
          <div className="p-3 rounded-md bg-secondary/50 border border-border">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 font-medium">Rationale</div>
            <p className="text-xs text-foreground/80 leading-relaxed">{item.rationale}</p>
          </div>
        )}

        {baselineConditions.length > 0 && (
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-medium">Baseline Conditions</div>
            <div className="grid grid-cols-2 gap-1.5">
              {baselineConditions.map((c: string, i: number) => (
                <div key={i} className="text-[11px] font-mono text-foreground/70 px-2 py-1 rounded bg-muted/50">{c}</div>
              ))}
            </div>
          </div>
        )}

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
                {item.outcomes.map((o, j) => (
                  <tr key={j} className="border-t border-border">
                    <td className="p-2 text-foreground">{o.metric}</td>
                    <td className="p-2 text-right font-mono text-muted-foreground">{o.predicted}</td>
                    <td className="p-2 text-right font-mono text-foreground">{o.actual || "—"}</td>
                    <td className={cn("p-2 text-right font-mono font-medium",
                      !o.delta ? "text-muted-foreground" :
                      o.delta === "pending" ? "text-atlas-neutral" :
                      o.favorable ? "text-atlas-positive" :
                      o.favorable === false ? "text-atlas-negative" : "text-muted-foreground"
                    )}>
                      {o.delta || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {timeline.length > 0 && (
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-medium">Evidence Timeline</div>
            <div className="relative pl-4 space-y-3">
              <div className="absolute left-[7px] top-1 bottom-1 w-px bg-border" />
              {timeline.map((t: any, i: number) => (
                <div key={i} className="relative flex items-start gap-3">
                  <div className={cn("absolute left-[-13px] top-1 w-2.5 h-2.5 rounded-full border-2 border-card", timelineTypeStyles[t.type] || "bg-muted")} />
                  <div className="flex-1">
                    <span className="font-mono text-[10px] text-muted-foreground">{t.date}</span>
                    <p className="text-xs text-foreground/80">{t.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {linkedDatasets.length > 0 && (
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-medium">Linked Datasets</div>
            <div className="space-y-1.5">
              {linkedDatasets.map((d: any, i: number) => (
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

        {expertAnnotations.length > 0 && (
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-medium">Expert Annotations</div>
            <div className="space-y-2">
              {expertAnnotations.map((a: any, i: number) => (
                <div key={i} className="p-2.5 rounded-md bg-primary/5 border border-primary/10">
                  <p className="text-xs text-foreground/80 leading-relaxed italic">"{a.note}"</p>
                  <p className="text-[10px] text-muted-foreground mt-1">— {a.author}, {a.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {item.learning_delta && (
          <div className="p-3 rounded-md bg-primary/5 border border-primary/10">
            <div className="text-[10px] uppercase tracking-wider text-primary mb-1 font-medium">Learning Delta</div>
            <p className="text-xs text-foreground/80 leading-relaxed">{item.learning_delta}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function InterventionTracker() {
  const { data: interventionsList, isLoading } = useInterventions();
  const deleteIntervention = useDeleteIntervention();
  const { user } = useAuth();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Intervention | null>(null);
  const [outcomeItem, setOutcomeItem] = useState<Intervention | null>(null);

  const selectedItem = interventionsList?.find((i) => i.id === selectedId);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-5 animate-pulse">
            <div className="h-4 bg-muted rounded w-2/3 mb-3" />
            <div className="h-3 bg-muted rounded w-1/2 mb-2" />
            <div className="h-20 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  const items = interventionsList ?? [];

  return (
    <div className="space-y-3">
      {user && (
        <button
          onClick={() => { setEditItem(null); setShowForm(true); }}
          className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Intervention
        </button>
      )}

      {items.map((item, i) => (
        <div
          key={item.id}
          className="animate-fade-in-up rounded-lg border border-border bg-card p-5 hover:border-primary/20 transition-all duration-300 group cursor-pointer"
          style={{ animationDelay: `${i * 80}ms` }}
          onClick={() => setSelectedId(item.id)}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[11px] text-muted-foreground">{item.code}</span>
                <Badge className={cn("text-[10px] font-mono border", statusStyles[item.status] || "")}>{item.status}</Badge>
                <span className="text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity">Click to expand →</span>
              </div>
              <h3 className="text-sm font-semibold text-foreground leading-tight">{item.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{item.location} · {item.type}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-4">
              {user && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); setOutcomeItem(item); }}
                    className="p-1 rounded hover:bg-primary/10 transition-colors"
                    title="Manage outcomes"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-primary" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditItem(item); setShowForm(true); }}
                    className="p-1 rounded hover:bg-primary/10 transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Delete this intervention?")) {
                        deleteIntervention.mutate(item.id, {
                          onSuccess: () => toast({ title: "Deleted" }),
                          onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
                        });
                      }
                    }}
                    className="p-1 rounded hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-atlas-negative" />
                  </button>
                </>
              )}
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Confidence</div>
                <div className={cn("font-mono text-lg font-bold", item.confidence_at_issue >= 75 ? "text-atlas-positive" : item.confidence_at_issue >= 60 ? "text-atlas-warning" : "text-atlas-negative")}>
                  {item.confidence_at_issue}%
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 text-[11px] text-muted-foreground mb-3">
            <span>Recommended: {formatDate(item.date_recommended)}</span>
            {item.date_implemented && <span>· Implemented: {formatDate(item.date_implemented)}</span>}
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
                {item.outcomes.map((o, j) => (
                  <tr key={j} className="border-t border-border">
                    <td className="p-2 text-foreground">{o.metric}</td>
                    <td className="p-2 text-right font-mono text-muted-foreground">{o.predicted}</td>
                    <td className="p-2 text-right font-mono text-foreground">{o.actual || "—"}</td>
                    <td className={cn("p-2 text-right font-mono font-medium",
                      !o.delta ? "text-muted-foreground" :
                      o.delta === "pending" ? "text-atlas-neutral" :
                      o.favorable ? "text-atlas-positive" :
                      o.favorable === false ? "text-atlas-negative" : "text-muted-foreground"
                    )}>
                      {o.delta || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {item.learning_delta && (
            <div className="mt-3 p-2.5 rounded-md bg-primary/5 border border-primary/10">
              <div className="text-[10px] uppercase tracking-wider text-primary mb-1 font-medium">Learning Delta</div>
              <p className="text-xs text-foreground/80 leading-relaxed">{item.learning_delta}</p>
            </div>
          )}
        </div>
      ))}

      {selectedItem && (
        <InterventionModal item={selectedItem} open={!!selectedId} onOpenChange={(v) => !v && setSelectedId(null)} />
      )}

      <InterventionForm open={showForm} onOpenChange={(v) => { setShowForm(v); if (!v) setEditItem(null); }} editItem={editItem} />

      {outcomeItem && (
        <OutcomeForm
          open={!!outcomeItem}
          onOpenChange={(v) => { if (!v) setOutcomeItem(null); }}
          interventionId={outcomeItem.id}
          outcomes={outcomeItem.outcomes}
        />
      )}
    </div>
  );
}
