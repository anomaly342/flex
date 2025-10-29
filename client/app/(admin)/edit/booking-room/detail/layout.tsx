import type { Metadata } from "next";
// import Navbar from "../_navbar/page";
import "./detail.css";

export const metadata: Metadata = {
    title: "Room Booking",
};

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {/* <Navbar /> */}
            <main>{children}</main>
        </>
    );
}