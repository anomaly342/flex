"use client";
import Link from "next/link";
import "./order-detail.css";

export default function OrderDetails() {
    const room = "Room 4";
    const theme = "Japanese";
    const location = "Floor 5";
    const date = "25 Aug 2025";
    const duration = "09:00 - 15:00";
    return (
        <div className="maindiv">
            <main>
                <p className="font-bold">Order Details</p>
                <div>
                    <p>
                        <span className="font-semibold">Room:</span> {room}
                    </p>
                    <p>
                        <span className="font-semibold">Theme:</span> {theme}
                    </p>
                    <p>
                        <span className="font-semibold">Location:</span>{" "}
                        {location}
                    </p>
                    <p>
                        <span className="font-semibold">Date:</span> {date}
                    </p>
                    <p>
                        <span className="font-semibold">Duration:</span>{" "}
                        {duration}
                    </p>
                </div>
                <div className="mt-4">
                    <p className="font-semibold">QR Code</p>
                    {/* add qr code here */}
                    <p className="text-gray-500 flex justify-center underline">
                        SAVE TO DEVICE
                    </p>
                </div>
                <div className="flex justify-between">
                    <Link
                        href="/home"
                        className="px-6 py-2 border rounded bg-black text-white hover:bg-gray-600"
                    >
                        Go Home
                    </Link>
                    <button className="px-6 py-2 border rounded hover:bg-gray-100">
                        Cancel Booking
                    </button>
                </div>
            </main>
        </div>
    );
}
