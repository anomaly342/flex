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
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  ActiveElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  | "total_zone";

export default function ExportDataPage() {
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

  const chartRef = useRef<ChartJS<"line"> | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragEnd, setDragEnd] = useState<number | null>(null);

  const mockData = [
    {
      date: "2025-10-20",
      booking_account: 50,
      total_account: 401,
      booking_room: 100,
      total_room: 120,
      booking_zone: 60,
      total_zone: 90,
    },
    {
      date: "2025-10-21",
      booking_account: 60,
      total_account: 403,
      booking_room: 110,
      total_room: 130,
      booking_zone: 75,
      total_zone: 95,
    },
    {
      date: "2025-10-22",
      booking_account: 80,
      total_account: 412,
      booking_room: 130,
      total_room: 150,
      booking_zone: 85,
      total_zone: 100,
    },
    {
      date: "2025-10-23",
      booking_account: 100,
      total_account: 423,
      booking_room: 160,
      total_room: 180,
      booking_zone: 95,
      total_zone: 110,
    },
    {
      date: "2025-10-24",
      booking_account: 120,
      total_account: 447,
      booking_room: 180,
      total_room: 200,
      booking_zone: 105,
      total_zone: 120,
    },
    {
      date: "2025-10-25",
      booking_account: 111,
      total_account: 449,
      booking_room: 195,
      total_room: 200,
      booking_zone: 112,
      total_zone: 120,
    },
    {
      date: "2025-10-26",
      booking_account: 235,
      total_account: 461,
      booking_room: 110,
      total_room: 200,
      booking_zone: 1,
      total_zone: 120,
    },
  ];

  useEffect(() => {
    setDataPreview(mockData);
  }, [duration]);

  const handleMouseDown = (event: ReactMouseEvent<HTMLCanvasElement>) => {
    if (!chartRef.current) return;
    const chart = chartRef.current;
    const points = chart.getElementsAtEventForMode(
      event.nativeEvent as unknown as Event,
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

  const handleMouseMove = (event: ReactMouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !chartRef.current) return;
    const chart = chartRef.current;
    const points = chart.getElementsAtEventForMode(
      event.nativeEvent as unknown as Event,
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

  const colorMap: Record<FilterType, string> = {
    booking_account: "rgb(255,99,132)",
    total_account: "rgb(54,162,235)",
    booking_room: "rgb(255,206,86)",
    total_room: "rgb(75,192,192)",
    booking_zone: "rgb(153,102,255)",
    total_zone: "rgb(255,159,64)",
  };

  const chartData: ChartData<"line"> = {
    labels: filteredData.map((d) => d.date),
    datasets: filters.map((f) => ({
      label: f.replaceAll("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      data: filteredData.map((d) => d[f]),
      borderColor: colorMap[f],
      backgroundColor: colorMap[f].replace("rgb", "rgba").replace(")", ",0.2)"),
      pointRadius: 5,
      fill: false,
      tension: 0.2,
    })),
  };

  const selectionPlugin = {
    id: "selectionPlugin",
    beforeDraw: (chart: ChartJS) => {
      const ctx = chart.ctx;
      const xAxis = chart.scales.x;
      if (!xAxis) return;

      let startIndex = null as number | null;
      let endIndex = null as number | null;

      if (isDragging && dragStart !== null && dragEnd !== null) {
        const offset = selectedRange.start !== null ? selectedRange.start : 0;
        const startFilteredIndex = dragStart - offset;
        const endFilteredIndex = dragEnd - offset;
        if (startFilteredIndex >= 0 && endFilteredIndex < filteredData.length) {
          [startIndex, endIndex] = [startFilteredIndex, endFilteredIndex].sort(
            (a, b) => a - b
          );
        } else return;
      } else if (selectedRange.start !== null && selectedRange.end !== null) {
        startIndex = 0;
        endIndex = filteredData.length - 1;
      } else return;

      if (startIndex === null || endIndex === null) return;

      let startPixel = xAxis.getPixelForValue(startIndex);
      let endPixel = xAxis.getPixelForValue(endIndex);

      const barWidth = xAxis.getPixelForValue(1) - xAxis.getPixelForValue(0);
      startPixel -= barWidth / 2;
      endPixel += barWidth / 2;

      ctx.save();
      ctx.fillStyle = "rgba(0, 123, 255, 0.4)";
      ctx.fillRect(
        startPixel,
        chart.chartArea.top,
        endPixel - startPixel,
        chart.chartArea.bottom - chart.chartArea.top
      );
      ctx.restore();
    },
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
              plugins={[selectionPlugin]}
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
      </div>

      {selectedRange.start !== null && selectedRange.end !== null && (
        <p>
          Selected Range: {mockData[selectedRange.start].date} →{" "}
          {mockData[selectedRange.end].date}
        </p>
      )}
    </div>
  );
}