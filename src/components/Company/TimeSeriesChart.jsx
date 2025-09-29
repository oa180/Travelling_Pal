import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function TimeSeriesChart({ title, series = [], testId }) {
  const labels = (series[0]?.data || []).map((p) => p.date);
  const data = {
    labels,
    datasets: series.map((s, idx) => ({
      label: s.label,
      data: s.data.map((p) => p.value),
      borderColor: s.color || ["#2563eb", "#16a34a", "#f59e0b"][idx % 3],
      backgroundColor: "transparent",
      pointRadius: 0,
      tension: 0.25,
    })),
  };
  const options = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true } }, scales: { x: { grid: { display: false } } } };
  return (
    <Card data-testid={testId}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: 280 }}>
          <Line data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
