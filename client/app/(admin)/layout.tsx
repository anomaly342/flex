"use client";

import { useState } from "react";
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

  return (
    <div className="admin-layout">
      <nav className="admin-navbar">
        <div className="navbar-header">
          <button className="menu-btn" onClick={toggleNavbar}>
            Menu
          </button>
          <h3>Admin Panel</h3>
        </div>

        <div className={`navbar-links ${open ? "show" : ""}`}>
          <div className="nav-group">
            <p>Dashboard</p>
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
          </div>

          <div className="nav-group">
            <p>Edit</p>
            <Link href="/edit/booking-room" onClick={handleLinkClick}>
              Edit Booking Room
            </Link>
            <Link href="/edit/booking-zone" onClick={handleLinkClick}>
              Edit Booking Zone
            </Link>
          </div>

          <div className="nav-group">
            <p>Export</p>
            <Link href="/export" onClick={handleLinkClick}>
              Export
            </Link>
          </div>
        </div>
      </nav>

      <main className="admin-container">{children}</main>
    </div>
  );
}
