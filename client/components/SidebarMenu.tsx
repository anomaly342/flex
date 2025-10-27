"use client";
import { useState } from "react";
import Image from "next/image";

export default function SidebarMenu() {
    const [open, setOpen] = useState(false);

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
                    <a href="#" className="hover:bg-gray-700 rounded px-3 py-2">
                        Home
                    </a>
                    <a href="#" className="hover:bg-gray-700 rounded px-3 py-2">
                        Book
                    </a>
                    <a href="#" className="hover:bg-gray-700 rounded px-3 py-2">
                        Orders
                    </a>
                    <a href="#" className="hover:bg-gray-700 rounded px-3 py-2">
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
