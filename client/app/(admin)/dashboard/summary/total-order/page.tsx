"use client";

import { useEffect, useState } from "react";

interface OrderData {
  order_id: string;
  start_time: string;
  end_time: string;
  price: number;
  room_id: string | null;
  zone_id: string | null;
  type: "room" | "zone";
  no: string;
  period: number;
}

export default function BookingAccountPage() {
  const [bookings, setBookings] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [rowsPerPage, setRowsPerPage] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedType, setSelectedType] = useState<"all" | "room" | "zone">(
    "all"
  );

  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedDay, setSelectedDay] = useState<string>("");

  const calculatePeriod = (start: string, end: string): number => {
    const diffMs = new Date(end).getTime() - new Date(start).getTime();
    return parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
  };

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:3000/orders/all", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch booking data");

      const data = await res.json();

      const mappedData: OrderData[] = data
        .filter((item: any) => item.room_id !== null || item.zone_id !== null)
        .map((item: any) => ({
          order_id: item.order_id,
          start_time: item.start_time,
          end_time: item.end_time,
          price: item.price,
          room_id: item.room_id,
          zone_id: item.zone_id,
          type: item.room_id ? "room" : "zone",
          no: item.room_id ?? item.zone_id,
          period: calculatePeriod(item.start_time, item.end_time),
        }));

      setBookings(mappedData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
    ];

    const mapped: OrderData[] = mockData.map((item) => ({
      ...item,
      type: item.room_id ? "room" : "zone",
      no: item.room_id ?? item.zone_id ?? "",
      period: calculatePeriod(item.start_time, item.end_time),
    }));

    setBookings(mapped);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // demoFetchData();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const bookingDate = new Date(b.start_time);
    const matchType = selectedType === "all" || b.type === selectedType;
    const matchMonth =
      selectedMonth === "all" ||
      bookingDate.getMonth() + 1 === Number(selectedMonth);
    const matchDay =
      selectedDay === "" ||
      bookingDate.toISOString().slice(0, 10) === selectedDay;
    return matchType && matchMonth && matchDay;
  });

  const totalPages = Math.ceil(filteredBookings.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };
  const handleRowsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value as any);
    setCurrentPage(1);
  };

  const handleCalculateTotal = () => {
    const total = filteredBookings.reduce((sum, b) => sum + b.price, 0);
    setTotalAmount(total);
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <section className="booking-container">
      <div className="table-controls">
        <div className="rows-select">
          <label className="rows-select">Rows per page:</label>
          <select
            id="rows-select"
            className="select-rows"
            value={rowsPerPage}
            onChange={handleRowsChange}
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="type">
          <label className="type-select">Type:</label>
          <select
            id="type-select"
            className="select-types"
            value={selectedType}
            onChange={handleTypeChange}
          >
            <option value="all">All</option>
            <option value="room">Room</option>
            <option value="zone">Zone</option>
          </select>
        </div>

        <div className="month">
          <label className="month-select">Month:</label>
          <select
            id="month-select"
            className="select-month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="all">All</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("en", { month: "long" })}
              </option>
            ))}
          </select>
        </div>

        <div className="date">
          <label className="date-select">Date:</label>
          <input
            id="date-select"
            type="date"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="select-day"
          />
        </div>

        <div className="show-text">
          <p className="showing-text">
            Showing {startIndex + 1} -{" "}
            {Math.min(endIndex, filteredBookings.length)} of{" "}
            {filteredBookings.length}
          </p>
        </div>

        <div className="cal-price">
          <button onClick={handleCalculateTotal} className="calc-btn">
            Calculate Total
          </button>
          {totalAmount !== null && (
            <p className="total-amount">
              Total: ฿{totalAmount.toLocaleString()}
            </p>
          )}
        </div>
      </div>

      <section className="table-wrapper">
        <table className="booking-table">
          <caption className="sr-only">Booking Records Table</caption>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Type</th>
              <th scope="col">No</th>
              <th scope="col">Start Booking</th>
              <th scope="col">End Booking</th>
              <th scope="col">Period (hrs)</th>
              <th scope="col">Price (฿)</th>
            </tr>
          </thead>
          <tbody>
            {currentBookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="no-data">
                  No booking records found.
                </td>
              </tr>
            ) : (
              currentBookings.map((b, i) => (
                <tr key={b.order_id}>
                  <td>{startIndex + i + 1}</td>
                  <td className="capitalize">{b.type}</td>
                  <td>{b.no}</td>
                  <td>{new Date(b.start_time).toLocaleString()}</td>
                  <td>{new Date(b.end_time).toLocaleString()}</td>
                  <td>{b.period.toFixed(2)}</td>
                  <td>{b.price.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <footer className="pagination">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="page-btn"
        >
          &lt;
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="page-btn"
        >
          &gt;
        </button>
      </footer>
    </section>
  );
}
