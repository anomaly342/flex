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
type YearRangeOption = "current" | "1" | "3" | "5" | "all";

type FilterType =
  | "booking_account"
  | "booking_room"
  | "booking_zone"
  | "income";

interface BookingItem {
  type: string;
  no: string;
  startBooking: string;
  endBooking?: string;
  price: number;
}

export default function SummaryPage() {
  const [duration, setDuration] = useState<Duration>("Weekly");
  const [yearRange, setYearRange] = useState<YearRangeOption>("current");
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

  const colorMap: Record<FilterType, string> = {
    booking_account: "rgb(255,99,132)",
    booking_room: "rgb(255,206,86)",
    booking_zone: "rgb(153,102,255)",
    income: "rgb(0,200,0)",
  };

  const parseDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      return new Date(Date.parse(dateStr));
    }
    return d;
  };

  const getYear = (d: Date) => d.getFullYear();

  const getISOWeek = (d0: Date) => {
    const d = new Date(Date.UTC(d0.getFullYear(), d0.getMonth(), d0.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(
      ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
    );
    return { year: d.getUTCFullYear(), week: weekNo };
  };

  const formatKeyAndLabel = (d: Date, duration: Duration) => {
    if (duration === "Weekly") {
      const { year, week } = getISOWeek(d);
      const label = `${year}-W${String(week).padStart(2, "0")}`;
      const tmp = new Date(d);
      const day = tmp.getDay() || 7;
      const monday = new Date(tmp);
      monday.setDate(tmp.getDate() - (day - 1));
      monday.setHours(0, 0, 0, 0);
      return {
        key: `${year}-W${String(week).padStart(2, "0")}`,
        label,
        keyDate: monday,
      };
    } else if (duration === "Monthly") {
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const label = `${y}-${String(m).padStart(2, "0")}`;
      const keyDate = new Date(y, m - 1, 1);
      return { key: `${y}-${String(m).padStart(2, "0")}`, label, keyDate };
    } else {
      const y = d.getFullYear();
      const label = `${y}`;
      const keyDate = new Date(y, 0, 1);
      return { key: `${y}`, label, keyDate };
    }
  };

  const computeYearBounds = (option: YearRangeOption) => {
    const current = new Date().getFullYear();
    if (option === "current") return { from: current, to: current };
    if (option === "1") return { from: current - 1, to: current };
    if (option === "3") return { from: current - 3, to: current };
    if (option === "5") return { from: current - 5, to: current };
    return { from: -Infinity, to: Infinity };
  };

  const aggregateBookings = (
    accData: BookingItem[],
    roomData: BookingItem[],
    zoneData: BookingItem[],
    durationFilter: Duration,
    yearRangeOption: YearRangeOption
  ) => {
    const map: Record<
      string,
      {
        key: string;
        label: string;
        keyDate: Date;
        booking_account: number;
        booking_room: number;
        booking_zone: number;
        income: number;
      }
    > = {};

    const { from: yearFrom, to: yearTo } = computeYearBounds(yearRangeOption);

    const add = (
      item: BookingItem,
      bucket: "booking_account" | "booking_room" | "booking_zone"
    ) => {
      const d = parseDate(item.startBooking);
      if (isNaN(d.getTime())) return;
      const y = getYear(d);
      if (y < yearFrom || y > yearTo) return;

      const { key, label, keyDate } = formatKeyAndLabel(d, durationFilter);

      if (!map[key]) {
        map[key] = {
          key,
          label,
          keyDate,
          booking_account: 0,
          booking_room: 0,
          booking_zone: 0,
          income: 0,
        };
      }
      map[key][bucket] += 1;
      map[key].income += Number(item.price || 0);
    };

    accData.forEach((it) => add(it, "booking_account"));
    roomData.forEach((it) => add(it, "booking_room"));
    zoneData.forEach((it) => add(it, "booking_zone"));

    return Object.values(map).sort(
      (a, b) => a.keyDate.getTime() - b.keyDate.getTime()
    );
  };

  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      try {
        const base = "http://localhost:8080/api";
        const [accRes, roomRes, zoneRes] = await Promise.all([
          fetch(`${base}/booking-account`),
          fetch(`${base}/booking-room`),
          fetch(`${base}/booking-zone`),
        ]);

        if (!accRes.ok || !roomRes.ok || !zoneRes.ok) {
          throw new Error("Network error while fetching booking APIs");
        }

        const [accData, roomData, zoneData] = await Promise.all([
          accRes.json(),
          roomRes.json(),
          zoneRes.json(),
        ]);

        if (cancelled) return;

        const aggregated = aggregateBookings(
          accData,
          roomData,
          zoneData,
          duration,
          yearRange
        );
        setDataPreview(aggregated);
      } catch (err) {
        console.warn("Fetch error:", err);
        setDataPreview([]);
      }
    };

    fetchAll();

    return () => {
      cancelled = true;
    };
  }, [duration, yearRange]);

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
    const { from: yearFrom, to: yearTo } = computeYearBounds(yearRange);

    let filtered = dataPreview.filter((d) => {
      const dYear = parseDate(d.date).getFullYear();
      return dYear >= yearFrom && dYear <= yearTo;
    });

    if (selectedRange.start !== null && selectedRange.end !== null) {
      const [min, max] = [selectedRange.start, selectedRange.end].sort(
        (a, b) => a - b
      );
      filtered = filtered.slice(min, max + 1);
    }

    return filtered;
  };

  const filteredData = getFilteredData();

  const chartData: ChartData<"line"> = {
    labels: filteredData.map((d) => d.label),
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

  const yearlyDiff = filteredData.map((d, i) => {
    if (i === 0) return 0;
    const prev = filteredData[i - 1];
    return filters.reduce((sum, f) => sum + (d[f] - prev[f]), 0);
  });

  const analysisData: ChartData<"bar"> = {
    labels: filteredData.map((d) => d.label),
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
        <div className="duration">
          <label>Duration</label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value as Duration)}
          >
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>

        <div className="year-range">
          <label>Year Range</label>
          <select
            value={yearRange}
            onChange={(e) => setYearRange(e.target.value as YearRangeOption)}
          >
            <option value="current">Current</option>
            <option value="1">Past 1 year</option>
            <option value="3">Past 3 years</option>
            <option value="5">Past 5 years</option>
            <option value="all">All</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Filters</label>
          <div className="filter-checkboxes">
            {(
              [
                "booking_account",
                "booking_room",
                "booking_zone",
                "income",
              ] as FilterType[]
            ).map((f) => (
              <label key={f}>
                <input
                  type="checkbox"
                  checked={filters.includes(f)}
                  onChange={() => handleFilterChange(f)}
                />
                <span>{f.replaceAll("_", " ")}</span>
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

      <div className="export-bottom">
        <button className="btn-clear" onClick={handleClearSelection}>
          Clear Selection
        </button>

        <button
          className="btn-analysis"
          onClick={() => setShowAnalysis(!showAnalysis)}
        >
          {showAnalysis ? "Hide Analysis" : "Analysis"}
        </button>
      </div>

      {selectedRange.start !== null &&
        selectedRange.end !== null &&
        dataPreview[selectedRange.start] &&
        dataPreview[selectedRange.end] && (
          <p>
            Selected Range: {dataPreview[selectedRange.start].label} →{" "}
            {dataPreview[selectedRange.end].label}
          </p>
        )}

      {showAnalysis && (
        <div className="analysis-chart">
          <h3>Analysis (Bar Chart)</h3>
          <Bar data={analysisData} />
        </div>
      )}
    </div>
  );
}
