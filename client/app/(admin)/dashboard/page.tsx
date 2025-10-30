"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface OrderData {
  order_id: string;
  start_time: string;
  end_time: string;
  price: number;
  room_id: string | null;
  zone_id: string | null;
}

export default function DashboardPage() {
  const [totalOrder, setTotalOrder] = useState<number>(0);
  const [totalOrderRoom, setTotalOrderRoom] = useState<number>(0);
  const [totalOrderZone, setTotalOrderZone] = useState<number>(0);

  const router = useRouter();
  const goTo = (path: string) => () => router.push(path);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("http://localhost:3000/total_order", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data: OrderData[] = await response.json();

      const totalOrders = data.length;
      const totalRooms = data.filter((o) => o.room_id !== null).length;
      const totalZones = data.filter((o) => o.zone_id !== null).length;

      setTotalOrder(totalOrders);
      setTotalOrderRoom(totalRooms);
      setTotalOrderZone(totalZones);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const demoFetchDashboardData = () => {
    const mockData: OrderData[] = [
      {
        order_id: "ORD001",
        start_time: "2025-01-10T14:00:00Z",
        end_time: "2025-01-12T10:00:00Z",
        price: 1000.0,
        room_id: "A101",
        zone_id: null,
      },
      {
        order_id: "ORD002",
        start_time: "2025-02-05T09:00:00Z",
        end_time: "2025-02-05T17:00:00Z",
        price: 850.0,
        room_id: null,
        zone_id: "Z03",
      },
      {
        order_id: "ORD003",
        start_time: "2024-11-20T16:00:00Z",
        end_time: "2024-11-22T10:00:00Z",
        price: 1300.5,
        room_id: "A205",
        zone_id: null,
      },
    ];

    setTotalOrder(mockData.length);
    setTotalOrderRoom(mockData.filter((o) => o.room_id !== null).length);
    setTotalOrderZone(mockData.filter((o) => o.zone_id !== null).length);
  };

  useEffect(() => {
    // fetchDashboardData();
    demoFetchDashboardData();
  }, []);

  return (
    <div className="dashboard-container">
      <div
        className="total-order"
        onClick={goTo("/dashboard/summary/total-order")}
      >
        <p>
          <strong>{totalOrder}</strong>
        </p>
        <p>Total Orders</p>
      </div>

      <div
        className="total-order-room"
        onClick={goTo("/dashboard/summary/total-order")}
      >
        <p>
          <strong>{totalOrderRoom}</strong>
        </p>
        <p>Total Orders (Room)</p>
      </div>

      <div
        className="total-order-zone"
        onClick={goTo("/dashboard/summary/total-order")}
      >
        <p>
          <strong>{totalOrderZone}</strong>
        </p>
        <p>Total Orders (Zone)</p>
      </div>
    </div>
  );
}
