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
  | "total_order"
  | "total_order_room"
  | "total_order_zone"
  | "income";

interface BookingItem {
  type: string;
  no: string;
  startBooking: string;
  endBooking?: string;
  price: number;
}

export default function ExportPage() {
  const [duration, setDuration] = useState<Duration>("Weekly");
  const [yearRange, setYearRange] = useState<YearRangeOption>("current");
  const [filters, setFilters] = useState<FilterType[]>(["total_order"]);
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
    total_order: "rgb(255,99,132)",
    total_order_room: "rgb(255,206,86)",
    total_order_zone: "rgb(153,102,255)",
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
        total_order: number;
        total_order_room: number;
        total_order_zone: number;
        income: number;
      }
    > = {};

    const { from: yearFrom, to: yearTo } = computeYearBounds(yearRangeOption);

    const add = (
      item: BookingItem,
      bucket: "total_order" | "total_order_room" | "total_order_zone"
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
          total_order: 0,
          total_order_room: 0,
          total_order_zone: 0,
          income: 0,
        };
      }
      map[key][bucket] += 1;
      map[key].income += Number(item.price || 0);
    };

    accData.forEach((it) => add(it, "total_order"));
    roomData.forEach((it) => add(it, "total_order_room"));
    zoneData.forEach((it) => add(it, "total_order_zone"));

    return Object.values(map).sort(
      (a, b) => a.keyDate.getTime() - b.keyDate.getTime()
    );
  };

  const handleExportCSV = () => {
    if (!filteredData || filteredData.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = [
      "Label",
      ...filters.map((f) =>
        f.replaceAll("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())
      ),
    ];

    const rows = filteredData.map((item) => [
      item.label,
      ...filters.map((f) => item[f]),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell ?? ""}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    a.download = `export_${duration}_${yearRange}_${timestamp}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/all`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Network error while fetching bookings");

        const allData = await res.json();
        if (cancelled) return;

        const roomData: BookingItem[] = allData
          .filter((b: any) => b.room_id !== null)
          .map((b: any) => ({
            type: "room",
            no: b.order_id,
            startBooking: b.start_time,
            endBooking: b.end_time,
            price: b.price,
          }));

        const zoneData: BookingItem[] = allData
          .filter((b: any) => b.zone_id !== null)
          .map((b: any) => ({
            type: "zone",
            no: b.order_id,
            startBooking: b.start_time,
            endBooking: b.end_time,
            price: b.price,
          }));

        const accData: BookingItem[] = allData.map((b: any) => ({
          type: "account",
          no: b.order_id,
          startBooking: b.start_time,
          endBooking: b.end_time,
          price: b.price,
        }));

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

    const demoFetchData = () => {
      const mockData = [
        {
          order_id: "ORD001",
          start_time: "2025-01-10T14:00:00Z",
          end_time: "2025-01-12T10:00:00Z",
          price: 1000.0,
          room_id: "A101",
          zone_id: null,
        },
        {
          order_id: "ORD002",
          start_time: "2025-02-05T09:00:00Z",
          end_time: "2025-02-05T17:00:00Z",
          price: 850.0,
          room_id: null,
          zone_id: "Z03",
        },
        {
          order_id: "ORD003",
          start_time: "2024-11-20T16:00:00Z",
          end_time: "2024-11-22T10:00:00Z",
          price: 1300.5,
          room_id: "A205",
          zone_id: null,
        },
        {
          order_id: "ORD004",
          start_time: "2025-03-10T09:00:00Z",
          end_time: "2025-03-12T10:00:00Z",
          price: 1750.0,
          room_id: "A302",
          zone_id: null,
        },
        {
          order_id: "ORD005",
          start_time: "2025-03-20T13:00:00Z",
          end_time: "2025-03-20T18:00:00Z",
          price: 650.0,
          room_id: null,
          zone_id: "Z08",
        },
      ];

      const roomData: BookingItem[] = mockData
        .filter((b) => b.room_id !== null)
        .map((b) => ({
          type: "room",
          no: b.order_id,
          startBooking: b.start_time,
          endBooking: b.end_time,
          price: b.price,
        }));

      const zoneData: BookingItem[] = mockData
        .filter((b) => b.zone_id !== null)
        .map((b) => ({
          type: "zone",
          no: b.order_id,
          startBooking: b.start_time,
          endBooking: b.end_time,
          price: b.price,
        }));

      const accData: BookingItem[] = mockData.map((b) => ({
        type: "account",
        no: b.order_id,
        startBooking: b.start_time,
        endBooking: b.end_time,
        price: b.price,
      }));

      const aggregated = aggregateBookings(
        accData,
        roomData,
        zoneData,
        duration,
        yearRange
      );

      setDataPreview(aggregated);
    };

    fetchData();
    // demoFetchData();

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
      const dYear = d.keyDate.getFullYear();
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
    <section className="export-container">
      <header className="export-top">
        <div className="duration">
          <label htmlFor="duration">Duration</label>
          <select
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value as Duration)}
          >
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>

        <div className="year-range">
          <label htmlFor="yearRange">Year Range</label>
          <select
            id="yearRange"
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

        <fieldset className="filter-group">
          <legend>Filters</legend>
          <div className="filter-checkboxes">
            {(
              [
                "total_order",
                "total_order_room",
                "total_order_zone",
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
        </fieldset>
      </header>

      <section className="export-preview">
        {dataPreview.length === 0 ? (
          <p>No data yet</p>
        ) : (
          <figure className="chart-wrapper">
            <Line
              ref={chartRef}
              data={chartData}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            />
          </figure>
        )}
      </section>

      <footer className="export-bottom">
        <button className="btn-export" onClick={handleExportCSV}>
          Export CSV
        </button>
        <button className="btn-clear" onClick={handleClearSelection}>
          Clear Selection
        </button>
        <button
          className="btn-analysis"
          onClick={() => setShowAnalysis(!showAnalysis)}
        >
          {showAnalysis ? "Hide Analysis" : "Analysis"}
        </button>
      </footer>

      {selectedRange.start !== null &&
        selectedRange.end !== null &&
        dataPreview[selectedRange.start] &&
        dataPreview[selectedRange.end] && (
          <p className="range-text">
            Selected Range: {dataPreview[selectedRange.start].label} →{" "}
            {dataPreview[selectedRange.end].label}
          </p>
        )}

      {showAnalysis && (
        <section className="analysis-chart">
          <h3>Analysis (Bar Chart)</h3>
          <Bar data={analysisData} />
        </section>
      )}
    </section>
  );
}
