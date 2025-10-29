import type { Metadata } from "next";
// import Navbar from "../_navbar/page";

export const metadata: Metadata = {
    title: "Order History",
};

export default function HomeLayout({
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
