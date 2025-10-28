import type { Metadata } from "next";
// import Navbar from "../_navbar/page";

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
