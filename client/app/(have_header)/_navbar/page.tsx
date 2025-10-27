"use client";
import Image from "next/image";
import "./navbar.css";
import SidebarMenu from "@/components/SidebarMenu";

export default function Navbar() {
    return (
        <div className="bg-white">
            <main className="flex flex-row justify-between p-2">
                <SidebarMenu />
                <Image
                    // className="dark:invert"
                    src="/next.svg"
                    alt="Logo"
                    width={100}
                    height={20}
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
            </main>
        </div>
    );
}
