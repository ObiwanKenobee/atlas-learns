import { useState, useMemo } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { cn } from "@/lib/utils";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface InterventionMarker {
  id: string;
  name: string;
  coordinates: [number, number];
  type: string;
  status: "active" | "monitoring" | "completed";
  accuracy: number;
  primaryMetric: string;
  primaryValue: string;
}

const markers: InterventionMarker[] = [
  { id: "INT-2026-041", name: "Nairobi Wetland Restoration", coordinates: [36.82, -1.29], type: "Flood Mitigation", status: "monitoring", accuracy: 72, primaryMetric: "Flood reduction", primaryValue: "14%" },
  { id: "INT-2026-038", name: "Oaxaca Solar Microgrid", coordinates: [-96.72, 17.07], type: "Energy Resilience", status: "completed", accuracy: 91, primaryMetric: "Grid uptime", primaryValue: "97%" },
  { id: "INT-2026-055", name: "Mekong Regen Agriculture", coordinates: [105.75, 10.04], type: "Agriculture", status: "active", accuracy: 0, primaryMetric: "Soil carbon Δ", primaryValue: "pending" },
  { id: "INT-2025-019", name: "Dhaka CHW Network", coordinates: [90.41, 23.81], type: "Public Health", status: "monitoring", accuracy: 68, primaryMetric: "Detection rate", primaryValue: "+31%" },
  { id: "INT-2026-062", name: "Amazon Reforestation", coordinates: [-60.03, -3.12], type: "Ecosystem", status: "active", accuracy: 0, primaryMetric: "Canopy recovery", primaryValue: "pending" },
  { id: "INT-2026-071", name: "Lagos Flood Early Warning", coordinates: [3.39, 6.52], type: "Flood Mitigation", status: "monitoring", accuracy: 81, primaryMetric: "Alert accuracy", primaryValue: "86%" },
  { id: "INT-2026-044", name: "Rajasthan Water Harvesting", coordinates: [73.87, 26.92], type: "Water Management", status: "completed", accuracy: 88, primaryMetric: "Aquifer recharge", primaryValue: "+22%" },
];

const statusColor: Record<string, string> = {
  active: "hsl(210, 60%, 55%)",
  monitoring: "hsl(38, 80%, 55%)",
  completed: "hsl(173, 58%, 46%)",
};

const statusLabel: Record<string, string> = {
  active: "text-atlas-info",
  monitoring: "text-atlas-warning",
  completed: "text-atlas-positive",
};

export function GeospatialMap() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("All");

  const types = useMemo(() => ["All", ...Array.from(new Set(markers.map((m) => m.type)))], []);
  const filtered = selectedType === "All" ? markers : markers.filter((m) => m.type === selectedType);
  const hoveredMarker = markers.find((m) => m.id === hoveredId);

  return (
    <div className="animate-fade-in-up rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Geospatial Outcome Map</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Intervention locations and outcome signals by region</p>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={cn("text-[10px] px-2 py-0.5 rounded-md transition-all border",
                selectedType === t
                  ? "bg-primary/15 text-primary border-primary/30 font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary border-transparent"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-3 text-[10px]">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full" style={{ background: statusColor.active }}></span>Active</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full" style={{ background: statusColor.monitoring }}></span>Monitoring</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full" style={{ background: statusColor.completed }}></span>Completed</span>
        <span className="text-muted-foreground ml-2">Size = prediction accuracy</span>
      </div>

      <div className="h-[380px] rounded-md overflow-hidden bg-background border border-border relative">
        <ComposableMap
          projectionConfig={{ rotate: [-10, 0, 0], scale: 140 }}
          style={{ width: "100%", height: "100%" }}
        >
          <ZoomableGroup>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="hsl(220, 16%, 13%)"
                    stroke="hsl(220, 14%, 20%)"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "hsl(220, 16%, 16%)", outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>
            {filtered.map((marker) => {
              const size = marker.accuracy > 0 ? Math.max(5, marker.accuracy / 10) : 4;
              return (
                <Marker
                  key={marker.id}
                  coordinates={marker.coordinates}
                  onMouseEnter={() => setHoveredId(marker.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <circle
                    r={size}
                    fill={statusColor[marker.status]}
                    fillOpacity={0.7}
                    stroke={statusColor[marker.status]}
                    strokeWidth={hoveredId === marker.id ? 3 : 1}
                    strokeOpacity={hoveredId === marker.id ? 0.4 : 0.2}
                    style={{ cursor: "pointer", transition: "all 0.2s" }}
                  />
                  {hoveredId === marker.id && (
                    <text
                      textAnchor="middle"
                      y={-size - 6}
                      style={{ fontFamily: "Inter", fontSize: "9px", fill: "hsl(210, 20%, 88%)", fontWeight: 600 }}
                    >
                      {marker.name}
                    </text>
                  )}
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>

        {/* Hover tooltip */}
        {hoveredMarker && (
          <div className="absolute bottom-3 left-3 p-3 rounded-md bg-card/95 border border-border backdrop-blur-sm shadow-lg max-w-[220px]">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="font-mono text-[10px] text-muted-foreground">{hoveredMarker.id}</span>
              <span className={cn("text-[10px] font-mono font-bold", statusLabel[hoveredMarker.status])}>{hoveredMarker.status}</span>
            </div>
            <p className="text-xs font-medium text-foreground">{hoveredMarker.name}</p>
            <p className="text-[10px] text-muted-foreground">{hoveredMarker.type}</p>
            <div className="mt-1.5 pt-1.5 border-t border-border flex justify-between">
              <span className="text-[10px] text-muted-foreground">{hoveredMarker.primaryMetric}</span>
              <span className="text-[10px] font-mono font-bold text-foreground">{hoveredMarker.primaryValue}</span>
            </div>
            {hoveredMarker.accuracy > 0 && (
              <div className="flex justify-between">
                <span className="text-[10px] text-muted-foreground">Prediction accuracy</span>
                <span className="text-[10px] font-mono font-bold text-foreground">{hoveredMarker.accuracy}%</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
