"use client";

import {
  useState,
  useEffect,
  useRef,
  MouseEvent as ReactMouseEvent,
} from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ActiveElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Duration = "Weekly" | "Monthly" | "Yearly";

type FilterType =
  | "booking_account"
  | "total_account"
  | "booking_room"
  | "total_room"
  | "booking_zone"
  | "total_zone"
  | "price";

export default function SummaryPage() {
  const [duration, setDuration] = useState<Duration>("Weekly");
  const [filters, setFilters] = useState<FilterType[]>(["booking_account"]);
  const [dataPreview, setDataPreview] = useState<any[]>([]);
  const [selectedRange, setSelectedRange] = useState<{
    start: number | null;
    end: number | null;
  }>({
    start: null,
    end: null,
  });
  const [showAnalysis, setShowAnalysis] = useState(false);

  const chartRef = useRef<ChartJS<"line"> | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragEnd, setDragEnd] = useState<number | null>(null);

  // ✅ Mock data ปัจจุบัน
  const mockData = [
    {
      date: "2025-10-20",
      booking_account: 50,
      total_account: 401,
      booking_room: 100,
      total_room: 120,
      booking_zone: 60,
      total_zone: 90,
      price: 1200,
    },
    {
      date: "2025-10-21",
      booking_account: 60,
      total_account: 403,
      booking_room: 110,
      total_room: 130,
      booking_zone: 75,
      total_zone: 95,
      price: 1500,
    },
    {
      date: "2025-10-22",
      booking_account: 80,
      total_account: 412,
      booking_room: 130,
      total_room: 150,
      booking_zone: 85,
      total_zone: 100,
      price: 1700,
    },
    {
      date: "2025-10-23",
      booking_account: 100,
      total_account: 423,
      booking_room: 160,
      total_room: 180,
      booking_zone: 95,
      total_zone: 110,
      price: 2100,
    },
    {
      date: "2025-10-24",
      booking_account: 120,
      total_account: 447,
      booking_room: 180,
      total_room: 200,
      booking_zone: 105,
      total_zone: 120,
      price: 2600,
    },
    {
      date: "2025-10-25",
      booking_account: 111,
      total_account: 449,
      booking_room: 195,
      total_room: 200,
      booking_zone: 112,
      total_zone: 120,
      price: 2400,
    },
    {
      date: "2025-10-26",
      booking_account: 235,
      total_account: 461,
      booking_room: 110,
      total_room: 200,
      booking_zone: 1,
      total_zone: 120,
      price: 3000,
    },
  ];

  // ✅ Mock data ปีที่แล้ว (ใช้เทียบ)
  const mockLastYear = [
    {
      date: "2024-10-20",
      booking_account: 30,
      total_account: 380,
      booking_room: 90,
      total_room: 110,
      booking_zone: 50,
      total_zone: 85,
      price: 900,
    },
    {
      date: "2024-10-21",
      booking_account: 40,
      total_account: 385,
      booking_room: 95,
      total_room: 115,
      booking_zone: 55,
      total_zone: 87,
      price: 1100,
    },
    {
      date: "2024-10-22",
      booking_account: 60,
      total_account: 390,
      booking_room: 100,
      total_room: 120,
      booking_zone: 60,
      total_zone: 90,
      price: 1300,
    },
    {
      date: "2024-10-23",
      booking_account: 70,
      total_account: 400,
      booking_room: 110,
      total_room: 130,
      booking_zone: 65,
      total_zone: 92,
      price: 1600,
    },
    {
      date: "2024-10-24",
      booking_account: 85,
      total_account: 420,
      booking_room: 120,
      total_room: 140,
      booking_zone: 70,
      total_zone: 95,
      price: 1800,
    },
    {
      date: "2024-10-25",
      booking_account: 100,
      total_account: 430,
      booking_room: 125,
      total_room: 150,
      booking_zone: 75,
      total_zone: 100,
      price: 2000,
    },
    {
      date: "2024-10-26",
      booking_account: 150,
      total_account: 440,
      booking_room: 130,
      total_room: 160,
      booking_zone: 80,
      total_zone: 110,
      price: 2200,
    },
  ];

  // ✅ Fetch จาก backend (mock ไว้)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/export-data");
        if (!res.ok) throw new Error("Network error");
        const result = await res.json();
        setDataPreview(result);
      } catch (err) {
        console.warn("Fetch failed, using mock data:", err);
        setDataPreview(mockData);
      }
    };
    fetchData();
  }, [duration]);

  // ✅ Mouse selection
  const handleMouseDown = (e: ReactMouseEvent<HTMLCanvasElement>) => {
    if (!chartRef.current) return;
    const chart = chartRef.current;
    const points = chart.getElementsAtEventForMode(
      e.nativeEvent as unknown as Event,
      "nearest",
      { intersect: false },
      false
    ) as ActiveElement[];
    if (points.length > 0) {
      const index = points[0].index;
      setIsDragging(true);
      setDragStart(index);
      setDragEnd(index);
    }
  };
  const handleMouseMove = (e: ReactMouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !chartRef.current) return;
    const chart = chartRef.current;
    const points = chart.getElementsAtEventForMode(
      e.nativeEvent as unknown as Event,
      "nearest",
      { intersect: false },
      false
    ) as ActiveElement[];
    if (points.length > 0) {
      const index = points[0].index;
      setDragEnd(index);
    }
  };
  const handleMouseUp = () => {
    if (isDragging && dragStart !== null && dragEnd !== null) {
      const [start, end] = [dragStart, dragEnd].sort((a, b) => a - b);
      setSelectedRange({ start, end });
    }
    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  };

  const getFilteredData = () => {
    if (selectedRange.start === null || selectedRange.end === null)
      return dataPreview;
    const [min, max] = [selectedRange.start, selectedRange.end].sort(
      (a, b) => a - b
    );
    return dataPreview.slice(min, max + 1);
  };

  const filteredData = getFilteredData();

  // ✅ สีแต่ละ filter
  const colorMap: Record<FilterType, string> = {
    booking_account: "rgb(255,99,132)",
    total_account: "rgb(54,162,235)",
    booking_room: "rgb(255,206,86)",
    total_room: "rgb(75,192,192)",
    booking_zone: "rgb(153,102,255)",
    total_zone: "rgb(255,159,64)",
    price: "rgb(0,200,0)",
  };

  // ✅ Line Chart
  const chartData: ChartData<"line"> = {
    labels: filteredData.map((d) => d.date),
    datasets: filters.map((f) => ({
      label: f.replaceAll("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      data: filteredData.map((d) => d[f]),
      borderColor: colorMap[f],
      backgroundColor: colorMap[f].replace("rgb", "rgba").replace(")", ",0.2)"),
      pointRadius: 4,
      fill: false,
      tension: 0.2,
    })),
  };

  // ✅ ความต่างสะสม (Cumulative Difference)
  const cumulativeDiff = filteredData.map((_, i) => {
    if (i === 0) return 0;
    const prev = filteredData[i - 1];
    const current = filteredData[i];
    return filters.reduce((sum, f) => sum + (current[f] - prev[f]), 0);
  });
  const cumulativeSum = cumulativeDiff.reduce<number[]>((acc, val, i) => {
    acc.push((acc[i - 1] || 0) + val);
    return acc;
  }, []);

  // ✅ ความต่างเทียบปีที่แล้ว
  const yearlyDiff = filteredData.map((d, i) => {
    const lastYear = mockLastYear[i];
    if (!lastYear) return 0;
    return filters.reduce((sum, f) => sum + (d[f] - lastYear[f]), 0);
  });

  // ✅ กราฟวิเคราะห์ (Bar Chart)
  const analysisData: ChartData<"bar"> = {
    labels: filteredData.map((d) => d.date),
    datasets: [
      ...filters.map((f) => ({
        label: f.replaceAll("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        data: filteredData.map((d) => d[f]),
        backgroundColor: colorMap[f]
          .replace("rgb", "rgba")
          .replace(")", ",0.5)"),
      })),
      {
        label: "Cumulative Diff",
        data: cumulativeSum,
        backgroundColor: "rgba(0,0,0,0.6)",
      },
      {
        label: "Yearly Diff",
        data: yearlyDiff,
        backgroundColor: "rgba(255,0,0,0.6)",
      },
    ],
  };

  const handleFilterChange = (f: FilterType) => {
    setFilters((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  };

  const handleClearSelection = () => {
    setSelectedRange({ start: null, end: null });
    setDragStart(null);
    setDragEnd(null);
  };

  return (
    <div className="export-container">
      <div className="export-top">
        <label>Duration</label>
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value as Duration)}
        >
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
        </select>

        <div className="filter-group">
          <label>Filters</label>
          <div className="filter-checkboxes">
            {(
              [
                "booking_account",
                "total_account",
                "booking_room",
                "total_room",
                "booking_zone",
                "total_zone",
                "price",
              ] as FilterType[]
            ).map((f) => (
              <label
                key={f}
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <input
                  type="checkbox"
                  checked={filters.includes(f)}
                  onChange={() => handleFilterChange(f)}
                />
                {f.replaceAll("_", " ")}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="export-preview">
        {dataPreview.length === 0 ? (
          <p>No data yet</p>
        ) : (
          <div className="chart-wrapper">
            <Line
              ref={chartRef}
              data={chartData}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            />
          </div>
        )}
      </div>

      <div className="export-bottom" style={{ marginTop: "10px" }}>
        <button className="btn-clear" onClick={handleClearSelection}>
          Clear Selection
        </button>
        <button
          className="btn-analysis"
          style={{ marginLeft: "10px" }}
          onClick={() => setShowAnalysis(!showAnalysis)}
        >
          {showAnalysis ? "Hide Analysis" : "Analysis"}
        </button>
      </div>

      {selectedRange.start !== null && selectedRange.end !== null && (
        <p>
          Selected Range: {mockData[selectedRange.start].date} →{" "}
          {mockData[selectedRange.end].date}
        </p>
      )}

      {showAnalysis && (
        <div className="analysis-chart" style={{ marginTop: "20px" }}>
          <h3>Analysis (Bar Chart)</h3>
          <Bar data={analysisData} />
        </div>
      )}
    </div>
  );
}
