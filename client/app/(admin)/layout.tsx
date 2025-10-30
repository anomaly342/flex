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

  useEffect(() => {
    const changeThemeBtn = document.getElementById("change-theme-btn");

    if (changeThemeBtn) {
      changeThemeBtn.addEventListener("click", () => {
        setTheme((prev) => !prev);
      });
    }

    return () => {
      if (changeThemeBtn) {
        changeThemeBtn.removeEventListener("click", () =>
          setTheme((prev) => !prev)
        );
      }
    };
  }, []);

  useEffect(() => {
    const navbar = document.getElementById("id-admin-navbar");
    if (!navbar) return;

    if (theme) {
      navbar.classList.add("green-theme");
      navbar.classList.remove("blue-theme");
    } else {
      navbar.classList.add("blue-theme");
      navbar.classList.remove("green-theme");
    }

  }, [theme])

  return (
    <div className="admin-layout">
      <nav id="id-admin-navbar" className="admin-navbar">
        <div className="navbar-header">
          <button className="menu-btn" onClick={toggleNavbar}>
            Menu
          </button>
          <button id="change-theme-btn">Change Theme</button>
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
