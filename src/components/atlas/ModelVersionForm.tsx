import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreateModelVersion } from "@/hooks/useModelVersions";
import { toast } from "@/hooks/use-toast";

export function ModelVersionForm({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const create = useCreateModelVersion();
  const [form, setForm] = useState({
    version_from: "", version_to: "", trigger_description: "", affected_domains: "", parameter_shifts: "",
  });

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let shifts: { param: string; change: string; direction: string }[] = [];
      if (form.parameter_shifts.trim()) {
        try { shifts = JSON.parse(form.parameter_shifts); } catch {
          toast({ title: "Invalid JSON for parameter shifts", variant: "destructive" }); return;
        }
      }
      await create.mutateAsync({
        version_from: form.version_from,
        version_to: form.version_to,
        trigger_description: form.trigger_description,
        affected_domains: form.affected_domains.split(",").map((s) => s.trim()).filter(Boolean),
        parameter_shifts: shifts,
      });
      toast({ title: "Model version created" });
      onOpenChange(false);
      setForm({ version_from: "", version_to: "", trigger_description: "", affected_domains: "", parameter_shifts: "" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const inputCls = "w-full rounded-md border border-border bg-secondary px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-sm">New Model Version</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="Version From (e.g. v4.3)" value={form.version_from} onChange={(e) => set("version_from", e.target.value)} required className={inputCls} />
            <input placeholder="Version To (e.g. v4.4)" value={form.version_to} onChange={(e) => set("version_to", e.target.value)} required className={inputCls} />
          </div>
          <textarea placeholder="Trigger description" value={form.trigger_description} onChange={(e) => set("trigger_description", e.target.value)} required rows={3} className={inputCls} />
          <input placeholder="Affected domains (comma-separated)" value={form.affected_domains} onChange={(e) => set("affected_domains", e.target.value)} className={inputCls} />
          <textarea placeholder='Parameter shifts JSON: [{"param":"...", "change":"+0.1", "direction":"up"}]' value={form.parameter_shifts} onChange={(e) => set("parameter_shifts", e.target.value)} rows={3} className={inputCls} />
          <button type="submit" disabled={create.isPending} className="w-full rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {create.isPending ? "Creating..." : "Create Version"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
