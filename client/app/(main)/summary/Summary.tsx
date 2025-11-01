"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "./summary.css";

interface UserProfile {
	user_id: number;
	username: string;
	role: string;
	exp_date: string | null;
	point: number;
}

interface Coupon {
	coupon_id: number;
	coupon_name: string;
	discount: number;
	isUsed: boolean;
}

interface TransactionSummaryResponse {
	id: number;
	user: { user_id: number; username: string };
	price: number;
	price_before_discount: number;
	status: string;
	paymentSessionId: string | null;
	createdAt: string;
	start_time: string;
	end_time: string;
	price_per_unit: number;
	total_hour: number;
	discount_list: string[];
	total_discount_percentage: number;
	point_reduction: number | null;
	room_id: number;
	zone_id: number | null;
}

export default function OrderSummary() {
	const sp = useSearchParams();
	const roomId = sp.get("id");
	const roomType = sp.get("type");
	const startTimeParam = sp.get("start_time");
	const endTimeParam = sp.get("end_time");

	const [user, setUser] = useState<UserProfile | null>(null);
	const [transaction, setTransaction] =
		useState<TransactionSummaryResponse | null>(null);
	const [coupons, setCoupons] = useState<Coupon[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [showModal, setShowModal] = useState(false);
	const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
	const [pointsRedeem, setPointsRedeem] = useState<string>(""); // <-- changed to string

	const startDate = startTimeParam ? new Date(startTimeParam) : null;
	const endDate = endTimeParam ? new Date(endTimeParam) : null;
	const hours =
		startDate && endDate
			? (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)
			: 0;

	// 1️⃣ Fetch user info
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/authentication/userInfo`,
					{ method: "GET", credentials: "include" }
				);
				if (!res.ok) throw new Error("Failed to fetch user info");
				const data = await res.json();
				setUser(data);
			} catch (err: any) {
				console.error(err);
				setError(err.message);
			}
		};
		fetchUser();
	}, []);

	// 2️⃣ Fetch coupons
	useEffect(() => {
		const fetchCoupons = async () => {
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/coupons`,
					{
						credentials: "include",
					}
				);
				if (!res.ok) throw new Error("Failed to fetch coupons");
				const data: Coupon[] = await res.json();
				setCoupons(data);
			} catch (err) {
				console.error(err);
			}
		};
		fetchCoupons();
	}, []);

	// 3️⃣ Create initial transaction summary
	useEffect(() => {
		if (!user || !roomId || !startDate || !endDate) return;

		const createTransaction = async () => {
			try {
				const body = new URLSearchParams();
				body.append("id", roomId);
				body.append("user_id", user.user_id.toString());
				body.append("type", roomType ?? "");
				body.append("price_before_discount", (hours * 50).toString());
				body.append("start_time", startDate.toISOString());
				body.append("end_time", endDate.toISOString());
				body.append("room_id", roomId);

				const res = await fetch(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction/summary`,
					{
						method: "POST",
						headers: { "Content-Type": "application/x-www-form-urlencoded" },
						body: body.toString(),
						credentials: "include",
					}
				);

				if (!res.ok) throw new Error("Failed to fetch transaction summary");
				const data: TransactionSummaryResponse = await res.json();
				setTransaction(data);
			} catch (err: any) {
				console.error(err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		createTransaction();
	}, [user, roomId, startTimeParam, endTimeParam]);

	// 4️⃣ Apply coupon and/or points
	const handleApply = async () => {
		try {
			if (!transaction) return;

			// Apply coupon
			if (selectedCoupon) {
				const body = new URLSearchParams();
				body.append("transaction_id", transaction.id.toString());
				body.append("coupon_id", selectedCoupon.coupon_id.toString());

				const res = await fetch(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction/addCoupon`,
					{
						method: "POST",
						headers: { "Content-Type": "application/x-www-form-urlencoded" },
						body: body.toString(),
						credentials: "include",
					}
				);
				if (!res.ok) throw new Error("Failed to apply coupon");
				const updated: TransactionSummaryResponse = await res.json();
				setTransaction(updated);
			}

			// Apply points
			const pointsValue = Number(pointsRedeem);
			if (pointsValue > 0) {
				const body = new URLSearchParams();
				body.append("transaction_id", transaction.id.toString());
				body.append("point_amount", pointsValue.toString());

				const res = await fetch(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction/addPoints`,
					{
						method: "POST",
						headers: { "Content-Type": "application/x-www-form-urlencoded" },
						body: body.toString(),
						credentials: "include",
					}
				);
				if (!res.ok) throw new Error("Failed to apply points");
				const updated: TransactionSummaryResponse = await res.json();
				setTransaction(updated);
			}

			setShowModal(false);
			setSelectedCoupon(null);
			setPointsRedeem(""); // reset input as string
		} catch (err) {
			console.error(err);
		}
	};

	// 5️⃣ Handle payment
	const handlePay = async () => {
		if (!transaction) return;

		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction/payment/${transaction.id}`,
				{
					method: "GET",
					credentials: "include",
				}
			);
			if (!res.ok) throw new Error("Failed to initiate payment");

			const paymentUrl = await res.text(); // <-- just read plain text
			window.location.href = paymentUrl; // redirect to payment page
		} catch (err) {
			console.error(err);
			alert("Failed to redirect to payment page.");
		}
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;
	if (!transaction) return <p>Calculating summary...</p>;

	return (
		<div className="maindiv">
			<div className="content">
				<p className="title-text">Order Summary</p>

				<div className="detail-section">
					<div className="detail-div">
						<p className="detail-text">Type</p>
						<p>{roomType}</p>
					</div>
					<div className="detail-div">
						<p className="detail-text">
							{roomType === "zone" ? "Zone ID" : "Room ID"}
						</p>
						<p>{roomId}</p>
					</div>
				</div>

				<div className="duration-section">
					<p className="detail-text">Duration</p>
					<div className="duration-div">
						<div className="detail-div">
							<p>
								{startDate?.toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})}{" "}
								-{" "}
								{endDate?.toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})}{" "}
								=
							</p>
						</div>
						<div className="detail-div">
							<div className="hour-div">
								<span className="time-text">{hours}</span>
								<span className="time-text">hrs</span>
							</div>
							<div className="x-div">
								<span className="x-text">x</span>
							</div>
							<div className="rate-div">
								<span className="time-text">{transaction.price_per_unit}</span>
								<span className="time-text">฿/hr</span>
							</div>
						</div>
					</div>
				</div>

				<button className="coupon-btn" onClick={() => setShowModal(true)}>
					Add coupons / Points
				</button>

				{showModal && (
					<div className="booking-section">
						<div className="booking-section2">
							<p className="coupons-header">Coupons</p>
							<div className="time-mapping">
								{coupons.map((c) => (
									<div
										key={c.coupon_id}
										className={`p-2 text-center cursor-pointer ${
											selectedCoupon?.coupon_id === c.coupon_id
												? "bg-blue-500 text-white"
												: "hover:bg-gray-100"
										}`}
										onClick={() => setSelectedCoupon(c)}
									>
										{c.coupon_name} ({c.discount * 100}%)
									</div>
								))}
							</div>

							<div className="points-section">
								<div className="points-current">
									<p>{user?.point ?? 0} Points Available</p>
								</div>
								<div className="points-input-div">
									<input
										type="number"
										min={0}
										max={user?.point ?? 0}
										value={pointsRedeem}
										onChange={(e) => setPointsRedeem(e.target.value)} // <-- manual
										className="points-input"
									/>
								</div>
							</div>

							<div className="button-section">
								<button
									onClick={() => setShowModal(false)}
									className="cancel-btn"
								>
									Cancel
								</button>
								<button
									onClick={handleApply}
									disabled={
										!selectedCoupon &&
										(!pointsRedeem || Number(pointsRedeem) <= 0)
									}
									className={`px-3 py-2 rounded ${
										!selectedCoupon &&
										(!pointsRedeem || Number(pointsRedeem) <= 0)
											? "bg-gray-200 text-gray-400 cursor-not-allowed"
											: "bg-blue-500 text-white hover:bg-blue-600"
									}`}
								>
									Confirm
								</button>
							</div>
						</div>
					</div>
				)}

				<hr className="summary-divider" />

				<div className="price-summary">
					<div className="price-row">
						<div className="price-left-half" />
						<div className="price-right-half">
							<div className="price-col-end">
								<div className="price-inline">
									<span className="price-number">
										{transaction.price_before_discount}
									</span>
									<span>฿</span>
								</div>
								<span className="price-minus-mark">-</span>
							</div>
						</div>
					</div>

					<div className="price-row price-row-topgap-small">
						<div className="price-left-half align-left">
							{transaction.discount_list.join(", ")}
						</div>
						<div className="price-right-half">
							<div className="price-col-end">
								<div className="price-inline">
									<span className="price-number">
										{(
											transaction.price_before_discount - transaction.price
										).toFixed(2)}
									</span>
									<span>฿</span>
								</div>
								<span className="price-minus-mark">-</span>
							</div>
						</div>
					</div>
				</div>

				<hr className="summary-divider summary-divider-gap" />
				<div className="total-row">
					<div className="total-inline">
						<span className="total-number">{transaction.price.toFixed(2)}</span>
						<span>฿</span>
					</div>
				</div>
			</div>

			<div className="footer-row">
				<Link href="/home" className="footer-btn footer-btn-link">
					Go Home
				</Link>
				<button className="footer-btn footer-btn-pay" onClick={handlePay}>
					Pay
				</button>
			</div>
		</div>
	);
}
