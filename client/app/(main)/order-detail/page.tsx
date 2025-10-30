"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import "./order-detail.css";

export default function OrderDetails() {
    const [qrUrl, setQrUrl] = useState("");
    const room = "Room 4";
    const theme = "Japanese";
    const location = "Floor 5";
    const date = "25 Aug 2025";
    const duration = "09:00 - 15:00";

    useEffect(() => {
        const data = `
            ${room}
            Theme: ${theme}
            Location: ${location}
            Date: ${date}
            Time: ${duration}
        `;

        QRCode.toDataURL(data, {
            width: 250,
            margin: 2,
            color: {
                dark: "#000000",
                light: "#ffffff",
            },
        })
            .then((url) => setQrUrl(url))
            .catch(console.error);
    }, []);

    return (
        <div className="maindiv">
            <main>
                <div className="min-[431px]:flex min-[431px]:flex-row min-[431px]:justify-between min-[431px]:mt-8">
                    <div>
                        <p className="font-bold text-9xl">Order Details</p>
                        <div className="space-y-2 text-sm">
                            <p>
                                <span className="font-semibold">Room:</span>{" "}
                                {room}
                            </p>
                            <p>
                                <span className="font-semibold">Theme:</span>{" "}
                                {theme}
                            </p>
                            <p>
                                <span className="font-semibold">Location:</span>{" "}
                                {location}
                            </p>
                            <p>
                                <span className="font-semibold">Date:</span>{" "}
                                {date}
                            </p>
                            <p>
                                <span className="font-semibold">Duration:</span>{" "}
                                {duration}
                            </p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="font-semibold">QR Code</p>
                        <div className="flex flex-col items-center content-center mt-3">
                            {qrUrl ? (
                                <img
                                    src={qrUrl}
                                    alt="Booking QR Code"
                                    className="border p-2 rounded-lg "
                                />
                            ) : (
                                <p>Generating QR...</p>
                            )}
                            <button
                                onClick={() => {
                                    const link = document.createElement("a");
                                    link.href = qrUrl;
                                    link.download = "booking_qr.png";
                                    link.click();
                                }}
                                className="text-gray-500 flex justify-center underline cursor-pointer mt-3"
                            >
                                SAVE TO DEVICE
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between mt-6">
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
