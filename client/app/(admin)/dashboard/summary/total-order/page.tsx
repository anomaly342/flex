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
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/all`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to fetch booking data");

      const data = await res.json();

      const mappedData: OrderData[] = data.map((item: any) => {
        const isRoom = item.room !== null;
        return {
          order_id: item.order_id.toString(),
          start_time: item.start_time,
          end_time: item.end_time,
          price: item.price,
          room_id: isRoom ? item.room.room_id.toString() : null,
          zone_id: !isRoom && item.zone ? item.zone.zone_id.toString() : null,
          type: isRoom ? "room" : "zone",
          no: isRoom
            ? item.room.room_no.toString()
            : item.zone?.zone_no.toString() || "",
          period: calculatePeriod(item.start_time, item.end_time),
        };
      });

      setBookings(mappedData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
      <h1 className="page-title">Booking Records</h1>

      <div className="table-controls">
        <div className="rows-select">
          <label>Rows per page:</label>
          <select value={rowsPerPage} onChange={handleRowsChange}>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="type">
          <label>Type:</label>
          <select value={selectedType} onChange={handleTypeChange}>
            <option value="all">All</option>
            <option value="room">Room</option>
            <option value="zone">Zone</option>
          </select>
        </div>

        <div className="month">
          <label>Month:</label>
          <select
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
          <label>Date:</label>
          <input
            type="date"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
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
          <button onClick={handleCalculateTotal}>Calculate Total</button>
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
              <th>#</th>
              <th>Type</th>
              <th>No</th>
              <th>Start Booking</th>
              <th>End Booking</th>
              <th>Period (hrs)</th>
              <th>Price (฿)</th>
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
