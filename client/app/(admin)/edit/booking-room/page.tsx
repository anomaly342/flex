"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Room {
  room_id: number;
  room_no: string;
  room_floor: number;
}

export default function BookingRoom() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [floor, setFloor] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const maxfloor = 20;

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true); 
        const res = await fetch("http://localhost:3000/rooms", {
          method: "GET", 
          credentials: "include",
        });

        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data = await res.json();
        setRooms(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // useEffect(() => {
  //   setLoading(false);
  //   const mockData: Room[] = [
  //     { room_id: 101, room_no: "101A", room_floor: 1 },
  //     { room_id: 102, room_no: "102B", room_floor: 1 },
  //     { room_id: 201, room_no: "201C", room_floor: 2 },
  //     { room_id: 202, room_no: "202D", room_floor: 2 },
  //   ];
  //   setRooms(mockData);
  // }, []);

  const upperfloor = () => floor < maxfloor && setFloor(floor + 1);
  const lowerfloor = () => floor > 1 && setFloor(floor - 1);

  const formatted = selectedDate.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const filteredRooms = rooms.filter((r) => r.room_floor === floor);

  return (
    <section className="room-container">
      <header className="room-header">
        <h1 className="title">Room Selection</h1>
      </header>

      <main className="room-main">
        <section className="selector-section" aria-label="Floor selector">
          <button
            className="btn small"
            onClick={lowerfloor}
            aria-label="Lower floor"
          >
            &lt;
          </button>

          <div className="selector-box">Floor {floor}</div>

          <button
            className="btn small"
            onClick={upperfloor}
            aria-label="Upper floor"
          >
            &gt;
          </button>
        </section>

        <section className="room-section" aria-label="Room list">
          {loading ? (
            <p className="loading-text">Loading rooms...</p>
          ) : error ? (
            <p className="error-text">Error: {error}</p>
          ) : filteredRooms.length > 0 ? (
            <ul className="room-grid">
              {filteredRooms.map((r) => (
                <li key={r.room_id} className="room-item">
                  <article className="room-box">
                    <Link
                      href={{
                        pathname: "/edit/booking-room/detail",
                        query: { room_id: r.room_id },
                      }}
                    >
                      Room {r.room_no}
                    </Link>
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-room">No rooms on this floor</p>
          )}
        </section>
      </main>
    </section>
  );
}
