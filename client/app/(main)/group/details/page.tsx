"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import "./details.css";

export default function Profile() {
    const sp = useSearchParams();
    const room = sp.get("room") ?? "N/A";
    const floor = sp.get("floor") ?? "N/A";
    const get_date = sp.get("date") ?? "N/A";

    const [showModal, setShowModal] = useState(false);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const times = [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
    ];

    const changeDate = (days: number) => {
        setSelectedDate((prev) => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() + days);
            return newDate;
        });
    };

    const formattedDate = selectedDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
    });

    const confirmBooking = () => {
        alert(`✅ Booked on ${get_date} at ${selectedTime}`);
        setShowModal(false);
    };

    return (
        <div className="maindiv">
            <main className="space-y-4">
                <div className="flex flex-col items-center">
                    <h1 className="font-bold">Room {room}</h1>
                    <h2>Floor {floor}</h2>
                </div>
                <hr />
                <div className="flex flex-col justify-center items-center space-y-4">
                    <div className="border-1 ">
                        <p className="p-20">Photo</p>
                    </div>
                    <div>
                        <p className="font-semibold mb-1">
                            Japanese-Themed Office
                        </p>

                        <p>
                            A serene, private workspace inspired by traditional
                            Japanese design. The office features:
                        </p>
                        <ul className="list-disc list-inside mt-2">
                            <li>
                                Minimalist wooden desk and ergonomic seating
                            </li>
                            <li>
                                Subtle shoji-style accents and calming décor
                            </li>
                            <li>
                                Soft, natural lighting for focus and comfort
                            </li>
                            <li>
                                High-speed Wi-Fi and convenient power outlets
                            </li>
                        </ul>
                        <p>
                            The tranquil Japanese ambiance makes it ideal for
                            concentrated work, video calls, or quiet meetings.
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-6 py-2 border rounded hover:bg-gray-100"
                >
                    Book
                </button>
                {showModal && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
                        <div className="bg-white rounded-xl p-6 w-72 shadow-lg">
                            {/* Time list */}
                            <div className="max-h-60 overflow-y-auto mb-4 border rounded">
                                {times.map((time) => (
                                    <div
                                        key={time}
                                        className={`p-2 text-center cursor-pointer ${
                                            selectedTime === time
                                                ? "bg-blue-500 text-white"
                                                : "hover:bg-gray-100"
                                        }`}
                                        onClick={() => setSelectedTime(time)}
                                    >
                                        {time}
                                    </div>
                                ))}
                            </div>

                            {/* Date selector */}
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <button
                                    onClick={() => changeDate(-1)}
                                    className="px-2 py-1 border rounded"
                                >
                                    &lt;
                                </button>
                                <p className="font-semibold">{formattedDate}</p>
                                <button
                                    onClick={() => changeDate(1)}
                                    className="px-2 py-1 border rounded"
                                >
                                    &gt;
                                </button>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-between">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-3 py-2 bg-gray-800 text-white rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmBooking}
                                    disabled={!selectedTime}
                                    className={`px-3 py-2 rounded ${
                                        selectedTime
                                            ? "bg-blue-500 text-white hover:bg-blue-600"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    }`}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
