import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function KpiCard({ label, value, hint, testId }) {
  return (
    <Card data-testid={testId}>
      <CardContent className="p-5">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
        {hint ? <p className="text-xs text-gray-500 mt-1">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}
