"use client";
import HardLink from "@/app/components/HardLink";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "./success.css";

interface TransactionOrderData {
	price: number;
	createdAt: string;
	order_id: number;
}

export default function PaySuccessful() {
	const searchParams = useSearchParams();
	const router = useRouter();

	const transactionId = searchParams.get("transaction_id");

	const [data, setData] = useState<TransactionOrderData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!transactionId) return;

		const fetchOrder = async () => {
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction/${transactionId}/orderId`,
					{ credentials: "include" }
				);
				if (!res.ok) throw new Error("Failed to fetch order data");
				const result: TransactionOrderData = await res.json();
				setData(result);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchOrder();
	}, [transactionId]);

	if (!transactionId) return <p>No transaction ID provided.</p>;
	if (loading) return <p>Loading...</p>;
	if (!data) return <p>Transaction not found.</p>;

	const date = new Date(data.createdAt).toLocaleDateString();
	const time = new Date(data.createdAt).toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});

	return (
		<div className="maindiv">
			<Image src="/check.svg" width={100} height={100} alt="Payment Success" />
			<p className="head-text">Payment Successful</p>

			<div className="amount-section">
				<span>Amount:</span>
				<span>{data.price.toFixed(2)} ฿</span>
			</div>

			<div className="date-section">
				<span>Date & Time:</span>
				<div className="date-text">
					<p>{date}</p>
					<p>{time}</p>
				</div>
			</div>

			<HardLink
				href={"/order-detail?order_id=${data.order_id}"}
				className="detail-link"
			>
				View Order
			</HardLink>
		</div>
	);
}
