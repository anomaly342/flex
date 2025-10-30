"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Zone {
  zone_id: number;
  zone_no: number;
}

export default function BookingZone() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchZones = async () => {
  //     try {
  //       setLoading(true);
  //       const res = await fetch("http://localhost:3000/edit/zone");
  //       if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  //       const data = await res.json();
  //       setZones(data);
  //     } catch (err: any) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchZones();
  // }, []);

  useEffect(() => {
    setLoading(false);
    const mockData: Zone[] = [
      { zone_id: 1, zone_no: 1 },
      { zone_id: 2, zone_no: 2 },
    ];
    setZones(mockData);
  }, []);

  const formatted = selectedDate.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="zone-container">
      <main className="zone-main">
        <h2 className="title">Zone Selection</h2>

        {loading ? (
          <p className="loading-text">Loading zones...</p>
        ) : error ? (
          <p className="error-text">Error: {error}</p>
        ) : (
          <div className="zone-grid">
            {zones.length > 0 ? (
              zones.map((z) => (
                <Link
                  key={z.zone_id}
                  href={{
                    pathname: "/edit/booking-zone/detail",
                    query: {
                      zone_id: z.zone_id
                    },
                  }}
                  className="zone-box"
                >
                  Zone {z.zone_no}
                </Link>
              ))
            ) : (
              <p className="no-zone">No zones available</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
