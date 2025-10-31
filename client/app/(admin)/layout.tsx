"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./admin.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const toggleNavbar = () => setOpen(!open);
  const handleLinkClick = () => setOpen(false);
  const [theme, setTheme] = useState<boolean>(false);

  const toggleTheme = () => setTheme((prev) => !prev);

  useEffect(() => {
    const header  = document.getElementById("id-navbar-header");
    if (!header ) return;

    header .classList.remove("blue-theme", "green-theme");
    header .classList.add(theme ? "green-theme" : "blue-theme");
  }, [theme]);

  return (
    <div className="admin-layout">
      <header id="id-navbar-header" className="navbar-header">
        <button className="menu-btn" onClick={toggleNavbar}>
          Menu
        </button>
        <button id="change-theme-btn" onClick={toggleTheme}>
          Change Theme
        </button>
      </header>

      <nav className={`admin-navbar ${theme ? "green-theme" : "blue-theme"}`}>
        <div className={`navbar-links ${open ? "show" : ""}`}>
          <section className="nav-group">
            <h2>Dashboard</h2>
            <Link href="/dashboard" onClick={handleLinkClick}>
              Dashboard
            </Link>
            <Link
              href="/dashboard/summary/total-order"
              onClick={handleLinkClick}
            >
              Total Order
            </Link>
            <Link
              href="/dashboard/summary/order-status"
              onClick={handleLinkClick}
            >
              Order Status
            </Link>
          </section>

          <section className="nav-group">
            <h2>Edit</h2>
            <Link href="/edit/booking-room" onClick={handleLinkClick}>
              Edit Booking Room
            </Link>
            <Link href="/edit/booking-zone" onClick={handleLinkClick}>
              Edit Booking Zone
            </Link>
          </section>

          <section className="nav-group">
            <h2>Export</h2>
            <Link href="/export" onClick={handleLinkClick}>
              Export
            </Link>
          </section>
        </div>
      </nav>

      <main className="admin-container">{children}</main>
    </div>
  );
}
