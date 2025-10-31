import type { Metadata } from "next";
import "./booking_zone.css"

export const metadata: Metadata = {
  title: "Zone Edit",
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
