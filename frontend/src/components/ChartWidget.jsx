import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";

// Chart.js ke parts register karna zaroori hai (warna error aata hai)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

// ABM AI theme colors — bars ke liye gradient palette
const COLORS = [
  "#e8632a",
  "#f0b541",
  "#d4541f",
  "#e89a3c",
  "#c44518",
  "#f5c563",
  "#b83d14",
  "#eba945",
];

export default function ChartWidget({ chartData }) {
  if (!chartData) return null;

  const { type, labels, values, title } = chartData;

  // Chart.js format mein data banao
  const data = {
    labels: labels,
    datasets: [
      {
        label: title || "Data",
        data: values,
        backgroundColor: labels.map((_, i) => COLORS[i % COLORS.length]),
        borderColor: "#e8632a",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "#e8e8e8" } },
      title: {
        display: !!title,
        text: title,
        color: "#e8e8e8",
        font: { size: 16 },
      },
    },
    scales:
      type === "pie"
        ? {}
        : {
            x: { ticks: { color: "#999" }, grid: { color: "#2a2a2a" } },
            y: { ticks: { color: "#999" }, grid: { color: "#2a2a2a" } },
          },
  };

  // type ke hisaab se sahi chart render karo
  return (
    <div style={{ marginTop: "16px" }}>
      {type === "line" && <Line data={data} options={options} />}
      {type === "bar" && <Bar data={data} options={options} />}
      {type === "pie" && <Pie data={data} options={options} />}
    </div>
  );
}
