import type { Metadata } from "next";
import "./booking_room.css";

export const metadata: Metadata = {
  title: "Room Edit",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <article>{children}</article>
    </section>
  );
}
