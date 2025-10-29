"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function BookingZone() {
  const [zones, setZones] = useState<{ zone: string; floor: number }[]>([]);
  const [floor, setFloor] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const maxfloor = 20;

//   useEffect(() => {
//     const fetchZones = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch("http://localhost:3000/edit/zone");
//         if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
//         const data = await res.json();
//         setZones(data);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchZones();
//   }, []);

  useEffect(() => {
    setLoading(false);
    const mockData = [
      { zone: "A", floor: 1 },
      { zone: "B", floor: 1 },
      { zone: "C", floor: 2 },
      { zone: "D", floor: 3 },
    ];
    setZones(mockData);
  }, []);

  const upperfloor = () => floor < maxfloor && setFloor(floor + 1);
  const lowerfloor = () => floor > 1 && setFloor(floor - 1);

  const formatted = selectedDate.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const filteredZones = zones.filter((z) => z.floor === floor);

  return (
    <div className="booking-container">
      <main className="booking-main">
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
          <p className="loading-text">Loading zones...</p>
        ) : error ? (
          <p className="error-text">Error: {error}</p>
        ) : (
          <div className="zone-grid">
            {filteredZones.length > 0 ? (
              filteredZones.map((z, i) => (
                <Link
                  key={i}
                  href={{
                    pathname: "/edit/booking-zone/detail",
                    query: { zone: z.zone, floor: floor, date: formatted },
                  }}
                  className="zone-box"
                >
                  Zone {z.zone}
                </Link>
              ))
            ) : (
              <p className="no-zone">No zones on this floor</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
