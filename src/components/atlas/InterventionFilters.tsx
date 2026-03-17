import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

const STATUSES = ["active", "monitoring", "completed", "rejected"] as const;

interface InterventionFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: string[];
  onStatusFilterChange: (v: string[]) => void;
  locationFilter: string;
  onLocationFilterChange: (v: string) => void;
  dateFrom: string;
  onDateFromChange: (v: string) => void;
  dateTo: string;
  onDateToChange: (v: string) => void;
  locations: string[];
}

const statusColors: Record<string, string> = {
  active: "bg-atlas-info/15 text-atlas-info border-atlas-info/30",
  monitoring: "bg-atlas-warning/15 text-atlas-warning border-atlas-warning/30",
  completed: "bg-atlas-positive/15 text-atlas-positive border-atlas-positive/30",
  rejected: "bg-atlas-negative/15 text-atlas-negative border-atlas-negative/30",
};

export function InterventionFilters({
  search, onSearchChange,
  statusFilter, onStatusFilterChange,
  locationFilter, onLocationFilterChange,
  dateFrom, onDateFromChange,
  dateTo, onDateToChange,
  locations,
}: InterventionFiltersProps) {
  const hasFilters = search || statusFilter.length > 0 || locationFilter || dateFrom || dateTo;

  const toggleStatus = (s: string) => {
    onStatusFilterChange(
      statusFilter.includes(s) ? statusFilter.filter((x) => x !== s) : [...statusFilter, s]
    );
  };

  return (
    <div className="space-y-2 mb-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search interventions by title, code, or location…"
          className="pl-8 h-8 text-xs bg-card border-border"
        />
        {search && (
          <button onClick={() => onSearchChange("")} className="absolute right-2 top-1/2 -translate-y-1/2">
            <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status toggles */}
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Status</span>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => toggleStatus(s)}
            className={`text-[10px] font-mono px-2 py-0.5 rounded-md border transition-all ${
              statusFilter.includes(s)
                ? statusColors[s]
                : "text-muted-foreground border-transparent hover:border-border hover:bg-secondary/50"
            }`}
          >
            {s}
          </button>
        ))}

        <div className="w-px h-4 bg-border" />

        {/* Location */}
        <select
          value={locationFilter}
          onChange={(e) => onLocationFilterChange(e.target.value)}
          className="text-[10px] font-mono px-2 py-1 rounded-md bg-card border border-border text-foreground"
        >
          <option value="">All locations</option>
          {locations.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>

        <div className="w-px h-4 bg-border" />

        {/* Date range */}
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground">From</span>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          className="text-[10px] font-mono px-2 py-1 rounded-md bg-card border border-border text-foreground"
        />
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground">To</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          className="text-[10px] font-mono px-2 py-1 rounded-md bg-card border border-border text-foreground"
        />

        {hasFilters && (
          <button
            onClick={() => {
              onSearchChange("");
              onStatusFilterChange([]);
              onLocationFilterChange("");
              onDateFromChange("");
              onDateToChange("");
            }}
            className="text-[10px] font-mono px-2 py-0.5 rounded-md text-atlas-negative hover:bg-atlas-negative/10 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
