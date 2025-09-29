import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DonutChart({ title, items = [], testId }) {
  const labels = items.map((i) => i.status);
  const data = items.map((i) => i.count);
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: ["#22c55e", "#eab308", "#ef4444", "#3b82f6", "#8b5cf6"],
        borderWidth: 0,
      },
    ],
  };
  const options = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } };
  return (
    <Card data-testid={testId}>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <div style={{ height: 260 }}>
          <Doughnut data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
