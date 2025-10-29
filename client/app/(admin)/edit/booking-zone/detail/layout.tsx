import type { Metadata } from "next";
// import Navbar from "../_navbar/page";
import "./detail.css";

export const metadata: Metadata = {
    title: "Zone Booking",
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