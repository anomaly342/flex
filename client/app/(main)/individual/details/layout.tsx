import type { Metadata } from "next";
// import Navbar from "../_navbar/page";
// import DesktopNavbar from "../_desktop_navbar/page";

export const metadata: Metadata = {
    title: "Room Booking",
};

export default function ZoneDetailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {/* mobile */}
            <div className="hidden max-[431px]:flex max-[431px]:flex-col ">
                {/* <Navbar /> */}
                <main>{children}</main>
            </div>
            {/* Desktop */}
            <div className="hidden min-[431px]:flex min-[431px]:flex-col">
                {/* <DesktopNavbar /> */}
                <main>{children}</main>
            </div>
        </>
    );
}
