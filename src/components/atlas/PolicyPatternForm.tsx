import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreatePolicyPattern } from "@/hooks/usePolicyPatterns";
import { toast } from "@/hooks/use-toast";

export function PolicyPatternForm({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const create = useCreatePolicyPattern();
  const [form, setForm] = useState({
    insight: "", confidence: "medium", domains: "", source: "",
  });

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await create.mutateAsync({
        insight: form.insight,
        confidence: form.confidence,
        domains: form.domains.split(",").map((s) => s.trim()).filter(Boolean),
        source: form.source,
      });
      toast({ title: "Policy pattern created" });
      onOpenChange(false);
      setForm({ insight: "", confidence: "medium", domains: "", source: "" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const inputCls = "w-full rounded-md border border-border bg-secondary px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-sm">New Policy Pattern</DialogTitle>
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
          <button type="submit" disabled={create.isPending} className="w-full rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {create.isPending ? "Creating..." : "Create Pattern"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
