"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface DashboardData {
  bookingAccount: number;
  totalAccount: number;
  bookingRoom: number;
  totalRoom: number;
  bookingZone: number;
  totalZone: number;
}

export default function DashboardPage() {
  const [bookingAccount, setBookingAccount] = useState<number>(0);
  const [totalAccount, setTotalAccount] = useState<number>(0);
  const [bookingRoom, setBookingRoom] = useState<number>(0);
  const [totalRoom, setTotalRoom] = useState<number>(0);
  const [bookingZone, setBookingZone] = useState<number>(0);
  const [totalZone, setTotalZone] = useState<number>(0);

  const router = useRouter();
  const goTo = (path: string) => () => router.push(path);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("http://localhost:3000/dashboard", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data: DashboardData = await response.json();

      setBookingAccount(data.bookingAccount);
      setTotalAccount(data.totalAccount);
      setBookingRoom(data.bookingRoom);
      setTotalRoom(data.totalRoom);
      setBookingZone(data.bookingZone);
      setTotalZone(data.totalZone);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const demoFetchDashboardData = () => {
    setBookingAccount(312);
    setTotalAccount(402);
    setBookingRoom(81);
    setTotalRoom(100);
    setBookingZone(378);
    setTotalZone(500);
  };

  useEffect(() => {
    // fetchDashboardData();
    demoFetchDashboardData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="booking-account" onClick={goTo("/dashboard/summary/booking-account")}>
        <p>
          <strong>
            {bookingAccount}/{totalAccount}
          </strong>
        </p>
        <p>Booking Account</p>
      </div>
      <div className="booking-room" onClick={goTo("/dashboard/summary/booking-room")}>
        <p>
          <strong>
            {bookingRoom}/{totalRoom}
          </strong>
        </p>
        <p>Booking Room</p>
      </div>
      <div className="booking-zone" onClick={goTo("/dashboard/summary/booking-zone")}>
        <p>
          <strong>
            {bookingZone}/{totalZone}
          </strong>
        </p>
        <p>Booking Zone</p>
      </div>
      <div className="booking-status" onClick={goTo("/dashboard/summary/booking-status")}>
        <p>
          <strong>
            {((bookingAccount / totalAccount) * 100).toFixed(2)}%
          </strong>
        </p>
        <p>Booking Status</p>
      </div>
    </div>
  );
}
