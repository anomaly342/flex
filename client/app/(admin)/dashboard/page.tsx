"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface OrderData {
  order_id: string;
  start_time: string;
  end_time: string;
  price: number;
  room: {
    room_id: number;
    room_no: number;
    room_floor: number;
    room_type: string;
    room_detail: string;
    room_img_url: string;
  } | null;
  zone: {
    zone_id: number;
    zone_no: number;
  } | null;
}

export default function DashboardPage() {
  const [totalOrder, setTotalOrder] = useState<number>(0);
  const [totalOrderRoom, setTotalOrderRoom] = useState<number>(0);
  const [totalOrderZone, setTotalOrderZone] = useState<number>(0);

  const router = useRouter();
  const goTo = (path: string) => () => router.push(path);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/all`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to fetch dashboard data");

      const data: OrderData[] = await response.json();

      const totalOrders = data.length;
      const totalRooms = data.filter((o) => o.room !== null).length;
      const totalZones = data.filter((o) => o.zone !== null).length;

      setTotalOrder(totalOrders);
      setTotalOrderRoom(totalRooms);
      setTotalOrderZone(totalZones);
    } catch (err: any) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <section id="id-dashboard-container" className="dashboard-container">
      <article
        className="total-order"
        onClick={goTo("/dashboard/summary/total-order")}
      >
        <p>
          <strong>{totalOrder}</strong>
        </p>
        <p>Total Orders</p>
      </article>

      <article
        className="total-order-room"
        onClick={goTo("/dashboard/summary/total-order")}
      >
        <p>
          <strong>{totalOrderRoom}</strong>
        </p>
        <p>Total Orders (Room)</p>
      </article>

      <article
        className="total-order-zone"
        onClick={goTo("/dashboard/summary/total-order")}
      >
        <p>
          <strong>{totalOrderZone}</strong>
        </p>
        <p>Total Orders (Zone)</p>
      </article>
    </section>
  );
}
