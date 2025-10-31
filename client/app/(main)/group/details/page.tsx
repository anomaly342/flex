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
    const [startTime, setStartTime] = useState<string | null>(null);
    const [endTime, setEndTime] = useState<string | null>(null);
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
        alert(
            `✅ Booked on ${get_date} from ${startTime} to ${
                endTime ?? startTime
            }`
        );
        setShowModal(false);
    };

    const handleTimeClick = (time: string) => {
        if (!startTime) {
            setStartTime(time);
            setEndTime(null);
            return;
        }

        if (!endTime) {
            const startIndex = times.indexOf(startTime);
            const newIndex = times.indexOf(time);

            if (newIndex >= startIndex) {
                // valid range
                setEndTime(time);
            } else {
                setStartTime(time);
                setEndTime(startTime);
            }
            return;
        }

        setStartTime(time);
        setEndTime(null);
    };

    const isInRange = (time: string) => {
        if (!startTime) return false;
        if (!endTime) return time === startTime;
        const startIndex = times.indexOf(startTime);
        const endIndex = times.indexOf(endTime);
        const currentIndex = times.indexOf(time);
        return currentIndex >= startIndex && currentIndex <= endIndex;
    };

    const confirmDisabled = !startTime;

    return (
        <div className="maindiv">
            <main>
                <div className="room-name">
                    <p className="room-text">Room {room}</p>
                    <p className="floor-text">Floor {floor}</p>
                </div>
                <hr />
                <div className="room-detail">
                    <div className="pics">
                        <p className="p-20">Photo</p>
                    </div>
                    <div className="detail-text">
                        <p className="detail-header">Japanese-Themed Office</p>

                        <p>
                            A serene, private workspace inspired by traditional
                            Japanese design. The office features:
                        </p>
                        <ul className="detail-list">
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
                <button onClick={() => setShowModal(true)} className="book-btn">
                    Book
                </button>
                {showModal && (
                    <div className="booking-section">
                        <div className="booking-section2">
                            {/* Time list */}
                            <div className="time-mapping">
                                {times.map((time) => (
                                    <div
                                        key={time}
                                        className={`p-2 text-center cursor-pointer ${
                                            isInRange(time)
                                                ? "bg-blue-500 text-white"
                                                : "hover:bg-gray-100"
                                        }`}
                                        onClick={() => handleTimeClick(time)}
                                    >
                                        {time}
                                    </div>
                                ))}
                            </div>

                            {/* Date selector */}
                            <div className="date-section">
                                <button
                                    onClick={() => changeDate(-1)}
                                    className="date-btn"
                                >
                                    &lt;
                                </button>
                                <p className="date-text">{formattedDate}</p>
                                <button
                                    onClick={() => changeDate(1)}
                                    className="date-btn"
                                >
                                    &gt;
                                </button>
                            </div>

                            {/* Buttons */}
                            <div className="button-section">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="cancel-btn"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmBooking}
                                    disabled={confirmDisabled}
                                    className={`px-3 py-2 rounded ${
                                        !confirmDisabled
                                            ? "bg-blue-500 text-white hover:bg-blue-600"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    }`}
                                >
                                    {startTime && endTime
                                        ? `Confirm ${startTime} - ${endTime}`
                                        : startTime
                                        ? `Confirm ${startTime}`
                                        : "Confirm"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
