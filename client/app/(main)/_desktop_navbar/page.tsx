"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import "./navbar.css";

export default function Desktop_Navbar() {
    const [openList, setOpenList] = useState(false);
    const arrow = openList ? "▼" : "▶";
    return (
        <div className="bg-white text-black">
            <main className="flex flex-row justify-between p-2">
                <Link href="/home">
                    <Image
                        // className="dark:invert"
                        src="/next.svg"
                        alt="Logo"
                        width={100}
                        height={20}
                        className="icon"
                        priority
                    />
                </Link>
                <div className="flex flex-row space-x-5">
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setOpenList(!openList)}
                            className="flex flex-row space-x-3s"
                        >
                            Book
                            <span>{arrow}</span>
                        </button>

                        {openList && (
                            <div className="absolute left-0 mt-2 flex flex-col bg-white border border-gray-300 shadow-lg rounded-md p-2 z-10">
                                <Link
                                    href="/group"
                                    className="hover:bg-gray-100 px-2 py-1 rounded"
                                >
                                    Group
                                </Link>
                                <Link
                                    href="/individual"
                                    className="hover:bg-gray-100 px-2 py-1 rounded"
                                >
                                    Individual
                                </Link>
                            </div>
                        )}
                    </div>

                    <Link href="/orders">Orders</Link>
                    <Link href="/profile" className="flex flex-row space-x-2">
                        <Image
                            src="/profile.svg"
                            alt="Profile"
                            width={25}
                            height={25}
                            className="icon"
                            priority
                        />
                        <p>Username</p>
                    </Link>
                    <Image
                        src="/notification.svg"
                        alt="Notification"
                        width={25}
                        height={25}
                        className="icon"
                        priority
                    />
                    <Image
                        // className="dark:invert"
                        src="/search.svg"
                        alt="Logo"
                        width={25}
                        height={25}
                        className="icon"
                        priority
                    />
                </div>
            </main>
        </div>
    );
}
