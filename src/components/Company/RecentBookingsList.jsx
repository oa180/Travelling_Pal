import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RecentBookingsList({ items = [], testId }) {
  return (
    <Card data-testid={testId}>
      <CardHeader>
        <CardTitle>Recent Bookings ({items.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((b) => (
            <div key={b.id} className="flex items-center justify-between border rounded p-3">
              <div>
                <p className="font-medium text-gray-900">{b.packageTitle || `Package ${b.packageId}`}</p>
                <p className="text-xs text-gray-500">{new Date(b.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm">${Number(b.price || 0).toLocaleString()}</p>
                <span className="text-xs text-gray-600">{b.status}</span>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center text-gray-500 py-8">No recent bookings</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
