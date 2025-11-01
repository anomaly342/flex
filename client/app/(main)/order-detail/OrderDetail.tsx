"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface OrderData {
	order_id: number;
	qr_url: string;
	start_time: string;
	end_time: string;
	price: number;
	createdAt: string;
}

export default function OrderDetails() {
	const searchParams = useSearchParams();
	const orderId = searchParams.get("order_id");

	const [order, setOrder] = useState<OrderData | null>(null);
	const [loading, setLoading] = useState(true);

	const replaceQrUrl = (originalUrl: string) => {
		const baseUrl = "https://pub-58ea0d557d3a4b5ba725a068317dcdf6.r2.dev";
		const filename = originalUrl.split("/").pop();
		return `${baseUrl}/${filename}`;
	};

	useEffect(() => {
		if (!orderId) return;

		const fetchOrder = async () => {
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/${orderId}`,
					{ credentials: "include" }
				);
				if (!res.ok) throw new Error("Failed to fetch order");
				const data: OrderData = await res.json();
				data.qr_url = replaceQrUrl(data.qr_url);
				setOrder(data);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchOrder();
	}, [orderId]);

	if (!orderId)
		return <p className="text-center mt-10">No order ID provided.</p>;
	if (loading)
		return <p className="text-center mt-10">Loading order details...</p>;
	if (!order) return <p className="text-center mt-10">Order not found.</p>;

	const startTime = new Date(order.start_time).toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});
	const endTime = new Date(order.end_time).toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});
	const date = new Date(order.start_time).toLocaleDateString();

	return (
		<div className="max-w-4xl mx-auto my-10 p-6 bg-white shadow-lg rounded-xl">
			<h1 className="text-4xl font-bold mb-6 text-center">Order Details</h1>

			<div className="md:flex md:justify-between md:items-start gap-6">
				{/* Order Info */}
				<div className="flex-1 space-y-4">
					<p>
						<span className="font-semibold">Order ID:</span> {order.order_id}
					</p>
					<p>
						<span className="font-semibold">Date:</span> {date}
					</p>
					<p>
						<span className="font-semibold">Duration:</span> {startTime} -{" "}
						{endTime}
					</p>
					<p>
						<span className="font-semibold">Price:</span> ${order.price}
					</p>
				</div>

				{/* QR Code */}
				<div className="flex flex-col items-center mt-6 md:mt-0">
					<img
						src={order.qr_url}
						alt="Booking QR Code"
						className="border p-3 rounded-lg w-48 h-48 object-contain"
					/>
					<button
						onClick={() => {
							const link = document.createElement("a");
							link.href = order.qr_url;
							link.download = "booking_qr.png";
							link.click();
						}}
						className="mt-4 px-4 py-2 border rounded hover:bg-gray-100 text-gray-700"
					>
						Save QR
					</button>
				</div>
			</div>

			{/* Actions */}
			<div className="mt-8 flex justify-end gap-4">
				<Link
					href="/home"
					className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
				>
					Go Home
				</Link>
			</div>
		</div>
	);
}
