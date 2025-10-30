import type { Metadata } from "next";
// import Navbar from "../_navbar/page";

export const metadata: Metadata = {
    title: "Order Detail",
};

export default function HomeLayout({
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
