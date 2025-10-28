"use client";

import { useEffect, useState } from "react";

interface Booking {
  id: number;
  type: "small" | "medium" | "big";
  no: number;
  start: string;
  end: string;
  period: number;
  price: number;
}

export default function BookingZonePage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [rowsPerPage, setRowsPerPage] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedType, setSelectedType] = useState<"all" | Booking["type"]>(
    "all"
  );

  const calculatePeriod = (start: string, end: string): number => {
    const diffMs = new Date(end).getTime() - new Date(start).getTime();
    return parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
  };

//     useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch("http://localhost:3000/booking_account", {
//           method: "GET",
//           credentials: "include",
//         });

//         if (!res.ok) throw new Error("Failed to fetch booking data");

//         const data: Booking[] = await res.json();
//         setBookings(data);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

  useEffect(() => {
    const mockData: Booking[] = Array.from({ length: 378 }, (_, i) => {
      const startDate = new Date(
        2025,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1,
        Math.floor(Math.random() * 23),
        Math.floor(Math.random() * 60)
      );
      const endDate = new Date(
        startDate.getTime() + (1 + Math.random() * 5) * 60 * 60 * 1000
      );
      const startISO = startDate.toISOString();
      const endISO = endDate.toISOString();

      const types: Booking["type"][] = ["small", "medium", "big"];
      return {
        id: i + 1,
        type: types[Math.floor(Math.random() * 3)],
        no: Math.floor(Math.random() * 20) + 1,
        start: startISO,
        end: endISO,
        period: calculatePeriod(startISO, endISO),
        price: Math.floor(Math.random() * 2000) + 500,
      };
    });

    setBookings(mockData);
    setLoading(false);
  }, []);

  const filteredBookings =
    selectedType === "all"
      ? bookings
      : bookings.filter((b) => b.type === selectedType);

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

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="booking-container">
      <h1 className="page-title">Booking Zone</h1>

      <div className="table-controls">
        <div className="rows-select">
          <label htmlFor="rows">Rows per page:</label>
          <select className="select-rows" id="rows" value={rowsPerPage} onChange={handleRowsChange}>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="type-select">
          <label htmlFor="type">Type:</label>
          <select className="select-types" id="type" value={selectedType} onChange={handleTypeChange}>
            <option value="all">All</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="big">Big</option>
          </select>
        </div>

        <p className="showing-text">
          Showing {startIndex + 1} -{" "}
          {Math.min(endIndex, filteredBookings.length)} of{" "}
          {filteredBookings.length}
        </p>
      </div>

      <div className="table-wrapper">
        <table className="booking-table">
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
                <tr key={b.id}>
                  <td>{startIndex + i + 1}</td>
                  <td className="capitalize">{b.type}</td>
                  <td>{b.no}</td>
                  <td>{new Date(b.start).toLocaleString()}</td>
                  <td>{new Date(b.end).toLocaleString()}</td>
                  <td>{b.period.toFixed(2)}</td>
                  <td>{b.price.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="page-btn"
        >
          {"<"}
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="page-btn"
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
