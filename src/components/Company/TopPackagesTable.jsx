import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TopPackagesTable({ items = [], sort = "revenue", onSortChange, onRowClick, testId }) {
  const [localSort, setLocalSort] = useState(sort);
  const sorted = useMemo(() => {
    const copy = [...items];
    copy.sort((a, b) => (Number(b[localSort] || 0) - Number(a[localSort] || 0)));
    return copy;
  }, [items, localSort]);

  const changeSort = (s) => {
    setLocalSort(s);
    onSortChange && onSortChange(s);
  };

  return (
    <Card data-testid={testId}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Top Packages</span>
          <div className="text-xs text-gray-500 space-x-2">
            <button onClick={() => changeSort("revenue")} className={localSort === "revenue" ? "underline" : "opacity-80"}>Revenue</button>
            <button onClick={() => changeSort("bookings")} className={localSort === "bookings" ? "underline" : "opacity-80"}>Bookings</button>
            <button onClick={() => changeSort("ctr")} className={localSort === "ctr" ? "underline" : "opacity-80"}>CTR</button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2 pr-4">Package</th>
                <th className="py-2 pr-4">Revenue</th>
                <th className="py-2 pr-4">Bookings</th>
                <th className="py-2 pr-4">CTR</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => (
                <tr key={row.packageId} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => onRowClick && onRowClick(row)}>
                  <td className="py-2 pr-4 font-medium">{row.title}</td>
                  <td className="py-2 pr-4">${Number(row.revenue || 0).toLocaleString()}</td>
                  <td className="py-2 pr-4">{row.bookings}</td>
                  <td className="py-2 pr-4">{(Number(row.ctr || 0) * 100).toFixed(2)}%</td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td className="py-6 text-center text-gray-500" colSpan={4}>No data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
