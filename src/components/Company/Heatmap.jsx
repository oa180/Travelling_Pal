import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Simple grid heatmap: expects items like [{ month: "2025-09", bookings: 56 }]
export default function Heatmap({ title = "Bookings by Month", items = [], testId }) {
  const months = items.map((i) => i.month);
  const values = items.map((i) => Number(i.bookings || 0));
  const max = Math.max(1, ...values);
  return (
    <Card data-testid={testId}>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {items.map((i, idx) => {
            const intensity = values[idx] / max; // 0..1
            const bg = `rgba(59,130,246,${0.15 + intensity * 0.7})`;
            return (
              <div key={i.month} className="rounded p-3 text-center" style={{ backgroundColor: bg }}>
                <div className="text-xs text-gray-700">{i.month}</div>
                <div className="text-sm font-semibold text-gray-900">{values[idx]}</div>
              </div>
            );
          })}
          {items.length === 0 && (
            <div className="text-center text-gray-500 py-8 col-span-full">No data</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
