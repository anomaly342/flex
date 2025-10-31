import type { Metadata } from "next";
import "./detail.css";

export const metadata: Metadata = {
    title: "Room Edit Detail",
};

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <article>
            <section>{children}</section>
        </article>
    );
}