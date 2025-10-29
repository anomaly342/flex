"use client";
import { useState } from "react";
import Link from "next/link";

export default function BookingRoom() {
  const maxfloor = 20;
  const [floor, setFloor] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const upperfloor = () => {
    if (floor < maxfloor) setFloor(floor + 1);
  };

  const lowerfloor = () => {
    if (floor > 1) setFloor(floor - 1);
  };

  const changeDate = (days: number) => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + days);
      return newDate;
    });
  };

  const formatted = selectedDate.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

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

        <div className="room-grid">
          {[...Array(5)].map((_, i) => (
            <Link
              key={i}
              href={{
                pathname: "/edit/booking-room/detail",
                query: {
                  room: `${i + 1}`,
                  floor: floor,
                  date: formatted,
                },
              }}
              className="room-box"
            >
              Room {i + 1}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
