"use client";
import { useState } from "react";
import Image from "next/image";

export default function SidebarMenu() {
    const [open, setOpen] = useState(false);
    const [openList, setOpenList] = useState(false);
    let display = "";
    let arrow = "";

    if (openList) {
        display = "flex flex-col";
        arrow = "▼";
    } else {
        display = "hidden";
        arrow = "▶";
    }

    return (
        <div className="flex">
            {/* ===== Sidebar ===== */}
            <aside
                className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 p-4 transition-transform duration-300 ${
                    open ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <Image
                    // className="dark:invert"
                    src="/menu-burger.svg"
                    alt="Menu Burger"
                    width={55}
                    height={60}
                    className="invert"
                    onClick={() => setOpen(!open)}
                    priority
                />
                <nav className="flex flex-col space-y-3">
                    <a
                        href="/home"
                        className="hover:bg-gray-700 rounded px-3 py-2"
                    >
                        Home
                    </a>
                    <div className="flex flex-row space-x-5 px-3">
                        <button
                            type="button"
                            onClick={() => setOpenList(!openList)}
                        >
                            Booking
                        </button>
                        <p>{arrow}</p>
                    </div>
                    <div className={`${display} px-5`}>
                        <a
                            href="/group"
                            className="hover:bg-gray-700 rounded px-3 py-2"
                        >
                            Group
                        </a>
                        <a
                            href="/individual"
                            className="hover:bg-gray-700 rounded px-3 py-2"
                        >
                            Individual
                        </a>
                    </div>
                    <a
                        href="/orders"
                        className="hover:bg-gray-700 rounded px-3 py-2"
                    >
                        Orders
                    </a>
                    <a
                        href="/profile"
                        className="hover:bg-gray-700 rounded px-3 py-2"
                    >
                        Profile
                    </a>
                </nav>
            </aside>

            {/* ===== Main content ===== */}
            <div className="flex-1">
                <Image
                    // className="dark:invert"
                    src="/menu-burger.svg"
                    alt="Menu Burger"
                    width={55}
                    height={60}
                    onClick={() => setOpen(!open)}
                    priority
                />
            </div>
        </div>
    );
}
