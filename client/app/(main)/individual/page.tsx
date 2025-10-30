"use client";
import { useState } from "react";
import Link from "next/link";
import "./individual.css";

export default function ZoneBooking() {
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
                    <button onClick={() => changeDate(-1)} className="date-btn">
                        &lt;
                    </button>
                    <p className="date-btn">{formatted}</p>
                    <button onClick={() => changeDate(1)} className="date-btn">
                        &gt;
                    </button>
                </div>

                <div className="zone-mapping">
                    {[...Array(9)].map((_, i) => (
                        <Link
                            key={i}
                            href={{
                                pathname: "/individual/details",
                                query: {
                                    zone: `${i + 1}`,
                                    floor: `${i + 1}`,
                                    date: formatted,
                                },
                            }}
                            className="zone-link"
                        >
                            Zone {i + 1}
                        </Link>
                    ))}
                </div>
                <p className="update-text">Last update:</p>
                <div className="refresh-section">
                    <p>{formatted2}</p>
                    <button onClick={handleRefresh} className="refresh-btn">
                        🔄
                    </button>
                </div>
            </main>
        </div>
    );
}
