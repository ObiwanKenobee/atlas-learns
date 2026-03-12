import { supabase } from "@/integrations/supabase/client";

function arrayToCsv(headers: string[], rows: string[][]): string {
  const escape = (val: string) => `"${val.replace(/"/g, '""')}"`;
  const headerRow = headers.map(escape).join(",");
  const dataRows = rows.map((row) => row.map(escape).join(","));
  return [headerRow, ...dataRows].join("\n");
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function exportInterventionsCsv() {
  const { data: interventions } = await supabase.from("interventions").select("*");
  const { data: outcomes } = await supabase.from("outcomes").select("*");

  const headers = ["Code", "Title", "Location", "Type", "Status", "Date Recommended", "Date Implemented", "Confidence", "Learning Delta"];
  const rows = (interventions ?? []).map((i) => [
    i.code, i.title, i.location, i.type, i.status,
    i.date_recommended, i.date_implemented || "—", `${i.confidence_at_issue}%`,
    i.learning_delta || "—",
  ]);

  const outcomeHeaders = ["Code", "Metric", "Predicted", "Actual", "Delta", "Favorable"];
  const outcomeRows = (outcomes ?? []).map((o) => {
    const intervention = (interventions ?? []).find((i) => i.id === o.intervention_id);
    return [intervention?.code || "—", o.metric, o.predicted, o.actual || "—", o.delta || "—", o.favorable === null ? "—" : o.favorable ? "Yes" : "No"];
  });

  const mainCsv = arrayToCsv(headers, rows);
  const outcomeCsv = arrayToCsv(outcomeHeaders, outcomeRows);
  downloadFile(`INTERVENTIONS\n${mainCsv}\n\nOUTCOME DETAILS\n${outcomeCsv}`, `atlas-interventions-${new Date().toISOString().slice(0, 10)}.csv`, "text/csv");
}

export async function exportModelLogsCsv() {
  const { data: versions } = await supabase.from("model_versions").select("*").order("created_at", { ascending: false });
  const headers = ["Version", "Date", "Trigger", "Parameter", "Change", "Direction", "Affected Domains"];
  const rows: string[][] = [];
  (versions ?? []).forEach((v) => {
    const shifts = (v.parameter_shifts as any[]) || [];
    const domains = (v.affected_domains || []).join(", ");
    shifts.forEach((s: any, i: number) => {
      rows.push([
        `${v.version_from} → ${v.version_to}`,
        new Date(v.created_at).toLocaleDateString(),
        i === 0 ? v.trigger_description : "",
        s.param || "", s.change || "", s.direction || "",
        i === 0 ? domains : "",
      ]);
    });
  });
  downloadFile(arrayToCsv(headers, rows), `atlas-model-updates-${new Date().toISOString().slice(0, 10)}.csv`, "text/csv");
}

export async function exportPolicyLibraryCsv() {
  const { data: patterns } = await supabase.from("policy_patterns").select("*");
  const headers = ["Insight", "Confidence", "Domains", "Source"];
  const rows = (patterns ?? []).map((p) => [
    p.insight, p.confidence, (p.domains || []).join(", "), p.source,
  ]);
  downloadFile(arrayToCsv(headers, rows), `atlas-policy-library-${new Date().toISOString().slice(0, 10)}.csv`, "text/csv");
}

export async function exportFullReportCsv() {
  const { data: interventions } = await supabase.from("interventions").select("*");
  const sections: string[] = [];
  sections.push("ATLAS ADAPTIVE LEARNING LOOPS — FULL REPORT");
  sections.push(`Generated: ${new Date().toISOString()}`);
  sections.push("");
  sections.push("KEY METRICS");
  sections.push(arrayToCsv(["Metric", "Value", "Trend"], [
    ["Learning Score", "76%", "↑ 4.2%"],
    ["Forecast Accuracy", "74%", "↑ 2.1%"],
    ["Calibration", "Med-High", "stable"],
    ["Outcome Coverage", "67%", "↑ 8%"],
  ]));
  sections.push("");
  sections.push("INTERVENTIONS");
  const intHeaders = ["Code", "Title", "Location", "Type", "Status", "Confidence"];
  const intRows = (interventions ?? []).map((i) => [i.code, i.title, i.location, i.type, i.status, `${i.confidence_at_issue}%`]);
  sections.push(arrayToCsv(intHeaders, intRows));
  downloadFile(sections.join("\n"), `atlas-full-report-${new Date().toISOString().slice(0, 10)}.csv`, "text/csv");
}
