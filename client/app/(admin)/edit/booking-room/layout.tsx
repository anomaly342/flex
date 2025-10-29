import type { Metadata } from "next";
import "./booking_room.css";
// import Navbar from "../_navbar/page";

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
