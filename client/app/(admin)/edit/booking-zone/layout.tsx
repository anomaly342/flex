import type { Metadata } from "next";
import "./booking_zone.css"

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
