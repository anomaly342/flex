"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function BookingRoom() {
  const [rooms, setRooms] = useState<{ room: string; floor: number }[]>([]);
  const [floor, setFloor] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const maxfloor = 20;

//   useEffect(() => {
//     const fetchRooms = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch("http://localhost:3000/edit/room");
//         if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
//         const data = await res.json();
//         setRooms(data);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRooms();
//   }, []);

  useEffect(() => {
    setLoading(false);
    const mockData = [
      { room: "A", floor: 1 },
      { room: "B", floor: 1 },
      { room: "C", floor: 2 },
      { room: "D", floor: 3 },
    ];
    setRooms(mockData);
  }, []);

  const upperfloor = () => floor < maxfloor && setFloor(floor + 1);
  const lowerfloor = () => floor > 1 && setFloor(floor - 1);
  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const formatted = selectedDate.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const filteredRooms = rooms.filter((r) => r.floor === floor);

  return (
    <div className="booking-container">
      <main className="booking-main">
        <div className="selector-row">
          <button className="btn small" onClick={() => changeDate(-1)}>
            &lt;
          </button>
          <div className="selector-box">{formatted}</div>
          <button className="btn small" onClick={() => changeDate(1)}>
            &gt;
          </button>
        </div>

        <div className="selector-row">
          <button className="btn small" onClick={lowerfloor}>
            &lt;
          </button>
          <div className="selector-box">Floor {floor}</div>
          <button className="btn small" onClick={upperfloor}>
            &gt;
          </button>
        </div>

        {loading ? (
          <p className="loading-text">Loading rooms...</p>
        ) : error ? (
          <p className="error-text">Error: {error}</p>
        ) : (
          <div className="room-grid">
            {filteredRooms.length > 0 ? (
              filteredRooms.map((r, i) => (
                <Link
                  key={i}
                  href={{
                    pathname: "/edit/booking-room/detail",
                    query: { room: r.room, floor: floor, date: formatted },
                  }}
                  className="room-box"
                >
                  Room {r.room}
                </Link>
              ))
            ) : (
              <p className="no-room">No rooms on this floor</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
