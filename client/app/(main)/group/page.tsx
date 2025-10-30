"use client";
import { useState } from "react";
import Link from "next/link";
import "./group.css";

export default function GroupBooking() {
    const maxfloor = 20;

    const [floor, setFloor] = useState(1);

    function upperfloor() {
        if (floor < maxfloor) {
            setFloor(floor + 1);
        }
    }

    function lowerfloor() {
        if (floor > 1) {
            setFloor(floor - 1);
        }
    }

    const [selectedDate, setSelectedDate] = useState(new Date());
    const changeDate = (days: number) => {
        setSelectedDate((prev) => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() + days);
            return newDate;
        });
    };

    const [lastUpdate, setLastUpdate] = useState(new Date());
    const handleRefresh = () => {
        setLastUpdate(new Date());
    };

    const formatted = selectedDate.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    const formatted2 = lastUpdate.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    return (
        <div className="maindiv">
            <main>
                <div className="select-date">
                    <button className="date-btn" onClick={() => changeDate(-1)}>
                        &lt;
                    </button>
                    <div className="date-btn">
                        <p>{formatted}</p>
                    </div>
                    <button className="date-btn" onClick={() => changeDate(1)}>
                        &gt;
                    </button>
                </div>
                <div className="select-floor">
                    <button className="floor-btn" onClick={lowerfloor}>
                        &lt;
                    </button>
                    <div className="floor-btn">
                        <p>{`Floor ${floor}`}</p>
                    </div>
                    <button className="floor-btn" onClick={upperfloor}>
                        &gt;
                    </button>
                </div>
                <div className="room-mapping">
                    {[...Array(5)].map((_, i) => (
                        <Link
                            key={i}
                            href={{
                                pathname: "/group/details",
                                query: {
                                    room: `${i + 1}`,
                                    floor: floor,
                                    date: formatted,
                                },
                            }}
                            className="room-link"
                        >
                            Room {i + 1}
                        </Link>
                    ))}
                </div>
                <div className="refresh-section">
                    <h2>Last update:</h2>
                    <p>{formatted2}</p>
                    <button onClick={handleRefresh} className="refresh-btn">
                        🔄
                    </button>
                </div>
            </main>
        </div>
    );
}
