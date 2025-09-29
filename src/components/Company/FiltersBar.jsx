import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CompanyAnalyticsAPI } from "@/api";

const PRESETS = [
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 90 days", value: "90" },
];

function formatDate(d) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function FiltersBar({ companyId, value, onChange, debounceMs = 250, testId }) {
  const [local, setLocal] = useState(() => ({ ...value }));
  const [pkgQuery, setPkgQuery] = useState("");
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loadingPkgs, setLoadingPkgs] = useState(false);
  const [loadingDests, setLoadingDests] = useState(false);

  // Debounce emitting changes
  useEffect(() => {
    const t = setTimeout(() => onChange(local), debounceMs);
    return () => clearTimeout(t);
  }, [local, onChange, debounceMs]);

  // Load dropdowns
  useEffect(() => {
    if (!companyId) return;
    setLoadingDests(true);
    CompanyAnalyticsAPI.getDestinations({ companyId })
      .then((res) => setDestinations(Array.isArray(res?.items) ? res.items : []))
      .finally(() => setLoadingDests(false));
  }, [companyId]);

  useEffect(() => {
    if (!companyId) return;
    let cancel = false;
    async function run() {
      try {
        setLoadingPkgs(true);
        const res = await CompanyAnalyticsAPI.getPackages({ query: pkgQuery, companyId });
        if (!cancel) setPackages(Array.isArray(res?.items) ? res.items : []);
      } finally {
        if (!cancel) setLoadingPkgs(false);
      }
    }
    const t = setTimeout(run, 250);
    return () => { cancel = true; clearTimeout(t); };
  }, [pkgQuery, companyId]);

  const presetHandler = (days) => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - Number(days));
    setLocal((prev) => ({ ...prev, from: formatDate(from), to: formatDate(to) }));
  };

  return (
    <Card data-testid={testId}>
      <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
        <div className="space-y-1">
          <label className="text-xs text-gray-600">From</label>
          <Input type="date" value={local.from} onChange={(e) => setLocal((p) => ({ ...p, from: e.target.value }))} />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-600">To</label>
          <Input type="date" value={local.to} onChange={(e) => setLocal((p) => ({ ...p, to: e.target.value }))} />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-600">Preset</label>
          <Select onValueChange={presetHandler}>
            <SelectTrigger>
              <SelectValue placeholder="Quick range" />
            </SelectTrigger>
            <SelectContent>
              {PRESETS.map((p) => (
                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-600">Package</label>
          <Input placeholder="Search packages..." value={pkgQuery} onChange={(e) => setPkgQuery(e.target.value)} />
          <Select value={local.packageId ?? 'ALL'} onValueChange={(v) => setLocal((p) => ({ ...p, packageId: v === 'ALL' ? null : v }))}>
            <SelectTrigger>
              <SelectValue placeholder={loadingPkgs ? "Loading..." : "Select package"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All packages</SelectItem>
              {packages.map((pkg) => (
                <SelectItem key={pkg.id} value={String(pkg.id)}>{pkg.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-600">Destination</label>
          <Select value={local.destination ?? 'ALL'} onValueChange={(v) => setLocal((p) => ({ ...p, destination: v === 'ALL' ? null : v }))}>
            <SelectTrigger>
              <SelectValue placeholder={loadingDests ? "Loading..." : "Select destination"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All destinations</SelectItem>
              {destinations.map((d) => (
                <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
