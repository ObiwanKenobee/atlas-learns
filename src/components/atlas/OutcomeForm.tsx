import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreateOutcome, useUpdateOutcome, useDeleteOutcome } from "@/hooks/useInterventions";
import { toast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Outcome = Tables<"outcomes">;

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  interventionId: string;
  outcomes: Outcome[];
};

const emptyForm = { metric: "", predicted: "", actual: "", delta: "", favorable: "" };

export function OutcomeForm({ open, onOpenChange, interventionId, outcomes }: Props) {
  const create = useCreateOutcome();
  const update = useUpdateOutcome();
  const del = useDeleteOutcome();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const editingOutcome = outcomes.find((o) => o.id === editingId);

  useEffect(() => {
    if (editingOutcome) {
      setForm({
        metric: editingOutcome.metric,
        predicted: editingOutcome.predicted,
        actual: editingOutcome.actual || "",
        delta: editingOutcome.delta || "",
        favorable: editingOutcome.favorable === null ? "" : editingOutcome.favorable ? "true" : "false",
      });
    } else {
      setForm(emptyForm);
      setEditingId(null);
    }
  }, [editingId, editingOutcome]);

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        metric: form.metric,
        predicted: form.predicted,
        actual: form.actual || null,
        delta: form.delta || null,
        favorable: form.favorable === "" ? null : form.favorable === "true",
      };
      if (editingId) {
        await update.mutateAsync({ id: editingId, ...payload });
        toast({ title: "Outcome updated" });
      } else {
        await create.mutateAsync({ ...payload, intervention_id: interventionId });
        toast({ title: "Outcome added" });
      }
      setForm(emptyForm);
      setEditingId(null);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this outcome?")) return;
    try {
      await del.mutateAsync(id);
      toast({ title: "Outcome deleted" });
      if (editingId === id) { setEditingId(null); setForm(emptyForm); }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const pending = create.isPending || update.isPending;
  const inputCls = "w-full rounded-md border border-border bg-secondary px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-sm">Manage Outcomes</DialogTitle>
        </DialogHeader>

        {outcomes.length > 0 && (
          <div className="rounded-md border border-border overflow-hidden mb-2">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-2 font-medium text-muted-foreground">Metric</th>
                  <th className="text-right p-2 font-medium text-muted-foreground">Predicted</th>
                  <th className="text-right p-2 font-medium text-muted-foreground">Actual</th>
                  <th className="p-2 w-16"></th>
                </tr>
              </thead>
              <tbody>
                {outcomes.map((o) => (
                  <tr key={o.id} className={`border-t border-border ${editingId === o.id ? "bg-primary/5" : ""}`}>
                    <td className="p-2 text-foreground">{o.metric}</td>
                    <td className="p-2 text-right font-mono text-muted-foreground">{o.predicted}</td>
                    <td className="p-2 text-right font-mono text-foreground">{o.actual || "—"}</td>
                    <td className="p-2 flex gap-1 justify-end">
                      <button
                        type="button"
                        onClick={() => setEditingId(editingId === o.id ? null : o.id)}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
                      >
                        {editingId === o.id ? "Cancel" : "Edit"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(o.id)}
                        className="p-0.5 rounded hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-3 h-3 text-atlas-negative" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            {editingId ? "Edit Outcome" : "Add New Outcome"}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="Metric name" value={form.metric} onChange={(e) => set("metric", e.target.value)} required className={inputCls} />
            <input placeholder="Predicted value" value={form.predicted} onChange={(e) => set("predicted", e.target.value)} required className={inputCls} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input placeholder="Actual (optional)" value={form.actual} onChange={(e) => set("actual", e.target.value)} className={inputCls} />
            <input placeholder="Delta (optional)" value={form.delta} onChange={(e) => set("delta", e.target.value)} className={inputCls} />
            <select value={form.favorable} onChange={(e) => set("favorable", e.target.value)} className={inputCls}>
              <option value="">Favorable?</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <button type="submit" disabled={pending} className="w-full rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {pending ? "Saving..." : editingId ? "Update Outcome" : "Add Outcome"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
