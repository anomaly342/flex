"use client";
import { useState } from "react";
import Link from "next/link";
import "./individual.css";

export default function Profile() {
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
            <main className="space-y-4">
                <div className="flex flex-row justify-center space-x-5 ">
                    <button
                        onClick={() => changeDate(-1)}
                        className="border-1 p-2"
                    >
                        &lt;
                    </button>
                    <div className="border-1 p-2">
                        <p>{formatted}</p>
                    </div>
                    <button
                        onClick={() => changeDate(1)}
                        className="border-1 p-2"
                    >
                        &gt;
                    </button>
                </div>

                <div className="flex flex-wrap justify-center gap-5">
                    {[...Array(9)].map((_, i) => (
                        <Link
                            href={{
                                pathname: "/individual/details",
                                query: {
                                    zone: `${i + 1}`,
                                    floor: `${i + 1}`,
                                    date: formatted,
                                },
                            }}
                            className="border p-5"
                        >
                            Zone {i + 1}
                        </Link>
                    ))}
                </div>
                <div>
                    <h2>Last update:</h2>
                    <p>{formatted2}</p>
                    <button
                        onClick={handleRefresh}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        🔄
                    </button>
                </div>
            </main>
        </div>
    );
}
