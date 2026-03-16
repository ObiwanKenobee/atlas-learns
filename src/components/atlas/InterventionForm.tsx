import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreateIntervention, useUpdateIntervention, type Intervention } from "@/hooks/useInterventions";
import { toast } from "@/hooks/use-toast";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editItem?: Intervention | null;
};

const emptyForm = {
  code: "", title: "", location: "", type: "", status: "active",
  date_recommended: "", date_implemented: "", confidence_at_issue: 50,
  rationale: "", learning_delta: "",
};

export function InterventionForm({ open, onOpenChange, editItem }: Props) {
  const create = useCreateIntervention();
  const update = useUpdateIntervention();
  const [form, setForm] = useState(emptyForm);
  const isEdit = !!editItem;

  useEffect(() => {
    if (editItem) {
      setForm({
        code: editItem.code,
        title: editItem.title,
        location: editItem.location,
        type: editItem.type,
        status: editItem.status,
        date_recommended: editItem.date_recommended,
        date_implemented: editItem.date_implemented || "",
        confidence_at_issue: editItem.confidence_at_issue,
        rationale: editItem.rationale || "",
        learning_delta: editItem.learning_delta || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [editItem, open]);

  const set = (key: string, val: string | number) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        confidence_at_issue: Number(form.confidence_at_issue),
        date_implemented: form.date_implemented || null,
        learning_delta: form.learning_delta || null,
        rationale: form.rationale || null,
      };
      if (isEdit) {
        await update.mutateAsync({ id: editItem!.id, ...payload });
        toast({ title: "Intervention updated" });
      } else {
        await create.mutateAsync(payload);
        toast({ title: "Intervention created" });
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
          <DialogTitle className="text-sm">{isEdit ? "Edit Intervention" : "New Intervention"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="Code (e.g. INT-2026-060)" value={form.code} onChange={(e) => set("code", e.target.value)} required className={inputCls} />
            <input placeholder="Title" value={form.title} onChange={(e) => set("title", e.target.value)} required className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="Location" value={form.location} onChange={(e) => set("location", e.target.value)} required className={inputCls} />
            <input placeholder="Type" value={form.type} onChange={(e) => set("type", e.target.value)} required className={inputCls} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] text-muted-foreground">Recommended</label>
              <input type="date" value={form.date_recommended} onChange={(e) => set("date_recommended", e.target.value)} required className={inputCls} />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground">Implemented</label>
              <input type="date" value={form.date_implemented} onChange={(e) => set("date_implemented", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground">Confidence %</label>
              <input type="number" min={0} max={100} value={form.confidence_at_issue} onChange={(e) => set("confidence_at_issue", e.target.value)} className={inputCls} />
            </div>
          </div>
          <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inputCls}>
            <option value="active">Active</option>
            <option value="monitoring">Monitoring</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
          <textarea placeholder="Rationale" value={form.rationale} onChange={(e) => set("rationale", e.target.value)} rows={2} className={inputCls} />
          <textarea placeholder="Learning Delta" value={form.learning_delta} onChange={(e) => set("learning_delta", e.target.value)} rows={2} className={inputCls} />
          <button type="submit" disabled={pending} className="w-full rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {pending ? "Saving..." : isEdit ? "Update Intervention" : "Create Intervention"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
