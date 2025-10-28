"use client";
import { useState } from "react";
import "./group.css";

export default function Profile() {
    const today = new Date();
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

    const [lastUpdate, setLastUpdate] = useState(new Date());
    const handleRefresh = () => {
        setLastUpdate(new Date());
    };

    const formatted = today.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
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
                    <div className="border-1 p-2">
                        <p>&lt;</p>
                    </div>
                    <div className="border-1 p-2">
                        <p>{`${formatted}`}</p>
                    </div>
                    <div className="border-1 p-2">
                        <p>&gt;</p>
                    </div>
                </div>
                <div className="flex flex-row justify-center space-x-14">
                    <div className="border-1 p-2">
                        <button type="button" onClick={lowerfloor}>
                            &lt;
                        </button>
                    </div>
                    <div className="border-1 p-2">
                        <p>{`Floor ${floor}`}</p>
                    </div>
                    <div className="border-1 p-2">
                        <button type="button" onClick={upperfloor}>
                            &gt;
                        </button>
                    </div>
                </div>
                <div className="space-x-5 space-y-5 block">
                    <button type="button" className="border-1 p-5">
                        <a>Room 1</a>
                    </button>
                    <button type="button" className="border-1 p-5">
                        <a>Room 2</a>
                    </button>
                    <button type="button" className="border-1 p-5">
                        <a>Room 3</a>
                    </button>
                    <button type="button" className="border-1 p-5">
                        <a>Room 4</a>
                    </button>
                    <button type="button" className="border-1 p-5">
                        <a>Room 5</a>
                    </button>
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
