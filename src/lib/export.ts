import { interventions } from "@/components/atlas/InterventionTracker";

// CSV export utility
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

export function exportInterventionsCsv() {
  const headers = ["ID", "Title", "Location", "Type", "Status", "Date Recommended", "Date Implemented", "Confidence", "Learning Delta"];
  const rows = interventions.map((i) => [
    i.id, i.title, i.location, i.type, i.status,
    i.dateRecommended, i.dateImplemented || "—", `${i.confidenceAtIssue}%`,
    i.learningDelta || "—",
  ]);

  // Add outcome rows
  const outcomeHeaders = ["ID", "Metric", "Predicted", "Actual", "Delta", "Favorable"];
  const outcomeRows = interventions.flatMap((i) =>
    i.expectedOutcomes.map((o) => [
      i.id, o.metric, o.predicted, o.actual || "—", o.delta || "—", o.favorable === undefined ? "—" : o.favorable ? "Yes" : "No",
    ])
  );

  const mainCsv = arrayToCsv(headers, rows);
  const outcomeCsv = arrayToCsv(outcomeHeaders, outcomeRows);
  const combined = `INTERVENTIONS\n${mainCsv}\n\nOUTCOME DETAILS\n${outcomeCsv}`;
  downloadFile(combined, `atlas-interventions-${new Date().toISOString().slice(0, 10)}.csv`, "text/csv");
}

export function exportModelLogsCsv() {
  const headers = ["Version", "Date", "Trigger", "Parameter", "Change", "Direction", "Affected Domains"];
  const rows = [
    ["v4.2 → v4.3", "Nov 2026", "Wetland restoration showed stronger biodiversity but slower social adoption",
      "Ecological resilience weight", "+0.12", "up", "Flood Mitigation, Ecosystem Restoration"],
    ["v4.2 → v4.3", "Nov 2026", "", "Governance friction variable", "+0.18", "up", ""],
    ["v4.2 → v4.3", "Nov 2026", "", "Infrastructure substitution optimism", "-0.09", "down", ""],
    ["v4.1 → v4.2", "Sep 2026", "Distributed solar with cooperatives outperformed centralized by 23%",
      "Cooperative model effectiveness", "+0.21", "up", "Energy Resilience"],
    ["v4.1 → v4.2", "Sep 2026", "", "Centralized service assumption", "-0.14", "down", ""],
    ["v4.0 → v4.1", "Jul 2026", "CHW coverage underperformed in high-mobility settlements",
      "Settlement mobility factor", "+0.25", "up", "Public Health, Urban Migration"],
    ["v4.0 → v4.1", "Jul 2026", "", "Static population assumption", "-0.19", "down", ""],
    ["v4.0 → v4.1", "Jul 2026", "", "Trust decay rate", "+0.08", "up", ""],
    ["v3.9 → v4.0", "May 2026", "Reforestation water retention compounds after year 3",
      "Compounding ecological benefit", "+0.16", "up", "Reforestation, Water Management"],
    ["v3.9 → v4.0", "May 2026", "", "Linear projection bias", "-0.11", "down", ""],
  ];

  downloadFile(arrayToCsv(headers, rows), `atlas-model-updates-${new Date().toISOString().slice(0, 10)}.csv`, "text/csv");
}

export function exportPolicyLibraryCsv() {
  const headers = ["Insight", "Confidence", "Domains", "Source"];
  const rows = [
    ["Wetland restoration outperforms concrete barriers in moderate flood zones with intact upstream ecosystems", "high", "Flood Mitigation, Ecosystem", "14 interventions, 4 regions"],
    ["Flood relocation policies fail more often where local trust scores are below 45%", "high", "Governance, Migration", "9 interventions, 6 regions"],
    ["Distributed solar resilience gains strongest with local maintenance cooperatives", "medium", "Energy, Community", "7 interventions, 3 regions"],
    ["Reforestation shows delayed but compounding water retention gains after year three", "medium", "Reforestation, Water", "11 interventions, 5 regions"],
    ["CHW networks require min 60% coverage for measurable early detection improvements", "emerging", "Health, Urban", "4 interventions, 2 regions"],
    ["Regenerative agriculture adoption accelerates with market access programs", "emerging", "Agriculture, Economics", "3 interventions, 2 regions"],
  ];

  downloadFile(arrayToCsv(headers, rows), `atlas-policy-library-${new Date().toISOString().slice(0, 10)}.csv`, "text/csv");
}

export function exportFullReportCsv() {
  const sections: string[] = [];

  // Summary
  sections.push("ATLAS ADAPTIVE LEARNING LOOPS — FULL REPORT");
  sections.push(`Generated: ${new Date().toISOString()}`);
  sections.push(`Model Version: v4.3`);
  sections.push("");

  // Metrics
  sections.push("KEY METRICS");
  sections.push(arrayToCsv(
    ["Metric", "Value", "Trend"],
    [
      ["Learning Score", "76%", "↑ 4.2%"],
      ["Forecast Accuracy", "74%", "↑ 2.1%"],
      ["Calibration", "Med-High", "stable"],
      ["Outcome Coverage", "67%", "↑ 8%"],
      ["Fastest Improving", "Watershed", "↑ 12%"],
      ["Most Uncertain", "Urban Migration", "↓ 3%"],
    ]
  ));
  sections.push("");

  // Interventions
  sections.push("INTERVENTIONS");
  const intHeaders = ["ID", "Title", "Location", "Type", "Status", "Confidence"];
  const intRows = interventions.map((i) => [i.id, i.title, i.location, i.type, i.status, `${i.confidenceAtIssue}%`]);
  sections.push(arrayToCsv(intHeaders, intRows));

  downloadFile(sections.join("\n"), `atlas-full-report-${new Date().toISOString().slice(0, 10)}.csv`, "text/csv");
}
