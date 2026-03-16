import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreatePolicyPattern, useUpdatePolicyPattern, type PolicyPattern } from "@/hooks/usePolicyPatterns";
import { toast } from "@/hooks/use-toast";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editItem?: PolicyPattern | null;
};

const emptyForm = { insight: "", confidence: "medium", domains: "", source: "" };

export function PolicyPatternForm({ open, onOpenChange, editItem }: Props) {
  const create = useCreatePolicyPattern();
  const update = useUpdatePolicyPattern();
  const [form, setForm] = useState(emptyForm);
  const isEdit = !!editItem;

  useEffect(() => {
    if (editItem) {
      setForm({
        insight: editItem.insight,
        confidence: editItem.confidence,
        domains: (editItem.domains || []).join(", "),
        source: editItem.source,
      });
    } else {
      setForm(emptyForm);
    }
  }, [editItem, open]);

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        insight: form.insight,
        confidence: form.confidence,
        domains: form.domains.split(",").map((s) => s.trim()).filter(Boolean),
        source: form.source,
      };
      if (isEdit) {
        await update.mutateAsync({ id: editItem!.id, ...payload });
        toast({ title: "Policy pattern updated" });
      } else {
        await create.mutateAsync(payload);
        toast({ title: "Policy pattern created" });
      }
      onOpenChange(false);
      setForm(emptyForm);
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
          <DialogTitle className="text-sm">{isEdit ? "Edit Policy Pattern" : "New Policy Pattern"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea placeholder="Insight" value={form.insight} onChange={(e) => set("insight", e.target.value)} required rows={3} className={inputCls} />
          <select value={form.confidence} onChange={(e) => set("confidence", e.target.value)} className={inputCls}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="emerging">Emerging</option>
          </select>
          <input placeholder="Domains (comma-separated)" value={form.domains} onChange={(e) => set("domains", e.target.value)} className={inputCls} />
          <input placeholder="Source" value={form.source} onChange={(e) => set("source", e.target.value)} required className={inputCls} />
          <button type="submit" disabled={pending} className="w-full rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {pending ? "Saving..." : isEdit ? "Update Pattern" : "Create Pattern"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
