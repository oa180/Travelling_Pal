import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend);

export default function ComboChart({ title, bars = [], line = null, testId }) {
  const labels = (bars[0]?.data || []).map((p) => p.date);
  const datasets = [];
  bars.forEach((b, idx) => {
    datasets.push({
      type: 'bar',
      label: b.label,
      data: b.data.map((p) => p.value),
      backgroundColor: b.color || ['#93c5fd', '#fca5a5'][idx % 2],
      borderWidth: 0,
    });
  });
  if (line) {
    datasets.push({
      type: 'line',
      label: line.label,
      data: line.data.map((p) => p.value),
      borderColor: line.color || '#16a34a',
      backgroundColor: 'transparent',
      yAxisID: 'y1',
      pointRadius: 0,
      tension: 0.25,
    });
  }
  const data = { labels, datasets };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true },
      y1: { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false } },
    },
    plugins: { legend: { display: true } },
  };
  return (
    <Card data-testid={testId}>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <div style={{ height: 280 }}>
          <Bar data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
