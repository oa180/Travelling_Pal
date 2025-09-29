import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function FunnelChart({ title = "Conversion Funnel", funnel = {}, testId }) {
  const stages = [
    { key: "impressions", label: "Impressions" },
    { key: "clicks", label: "Clicks" },
    { key: "bookingStarts", label: "Booking Starts" },
    { key: "bookings", label: "Bookings" },
  ];
  const labels = stages.map((s) => s.label);
  const values = stages.map((s) => Number(funnel?.[s.key] || 0));
  const data = {
    labels,
    datasets: [
      {
        label: "Count",
        data: values,
        backgroundColor: ["#93c5fd", "#a7f3d0", "#fde68a", "#fca5a5"],
        borderWidth: 0,
      },
    ],
  };
  const options = { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };
  return (
    <Card data-testid={testId}>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <div style={{ height: 260 }}>
          <Bar data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
