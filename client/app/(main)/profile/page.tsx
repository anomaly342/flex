"use client";
import HardLink from "@/app/components/HardLink";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./profile.css";

interface UserProfile {
	user_id: number;
	username: string;
	role: string;
	exp_date: string | null;
	point: string;
}

interface Order {
	order_id: number;
	qr_url: string;
	start_time: string;
	end_time: string;
	price: number;
	createdAt: string;
}

export default function Profile() {
	const router = useRouter();
	const [user, setUser] = useState<UserProfile>();
	const [orders, setOrders] = useState<Order[]>([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const [orderLoading, setOrderLoading] = useState(false);

	// Fetch user info
	useEffect(() => {
		const loadUser = async () => {
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/authentication/userInfo`,
					{ method: "GET", credentials: "include" }
				);

				if (!res.ok) {
					router.replace("/login");
					return;
				}

				const data: UserProfile = await res.json();
				setUser(data);
			} catch (err) {
				console.error("Failed to load user", err);
				router.replace("/login");
			} finally {
				setLoading(false);
			}
		};

		loadUser();
	}, [router]);

	// Fetch orders
	const loadOrders = async (pageNum: number) => {
		setOrderLoading(true);
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders?page=${pageNum}`,
				{ method: "GET", credentials: "include" }
			);

			if (res.ok) {
				const data: Order[] = await res.json();
				setOrders(data);
			} else {
				setOrders([]);
			}
		} catch (err) {
			console.error("Failed to load orders", err);
			setOrders([]);
		} finally {
			setOrderLoading(false);
		}
	};

	useEffect(() => {
		loadOrders(page);
	}, [page]);

	if (loading) return <p>Loading...</p>;

	const hasSubscription = user?.exp_date !== null;

	// Format date like "23 October 2025"
	const formatDate = (dateStr: string | null) => {
		if (!dateStr) return "";
		const date = new Date(dateStr);
		return date.toLocaleDateString("en-GB", {
			day: "2-digit",
			month: "long",
			year: "numeric",
		});
	};

	return (
		<div className="maindiv">
			<main className="main-wrapper">
				<div className="profile-header-row">
					<Image src="/profile.svg" alt="User Profile" width={50} height={50} />
					<div className="profile-header-col">
						<p>{user?.username}</p>
						<p>
							<span className="rolename">{user?.role}</span> Points:{" "}
							{user?.point}
						</p>
					</div>
				</div>

				<div className="outer-card">
					{/* No subscription */}
					{!hasSubscription && (
						<div className="subscribe-section">
							<p>Subscribe to our Membership!</p>
							<button
								className="subscribe-button"
								onClick={async () => {
									try {
										const res = await fetch(
											`${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction/subscription`,
											{ method: "GET", credentials: "include" }
										);
										if (!res.ok)
											throw new Error("Failed to get subscription link");

										const paymentUrl = await res.text();
										window.location.href = paymentUrl;
									} catch (err) {
										console.error(err);
										alert("Failed to redirect to subscription page.");
									}
								}}
							>
								Go to Subscription Page
							</button>
						</div>
					)}

					{/* Has subscription */}
					{hasSubscription && (
						<div className="member-section">
							<h1 className="title">Membership</h1>
							<table className="member-table">
								<thead>
									<tr>
										<th>Your membership ends at</th>
										<th>Points</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>{formatDate(user.exp_date)}</td>
										<td>{user?.point}</td>
									</tr>
								</tbody>
							</table>

							{/* Return Home Button */}
							<div style={{ marginTop: "1rem" }}>
								<HardLink href="/home" className="subscribe-button">
									Return to Home
								</HardLink>
							</div>
						</div>
					)}

					{/* History section */}
					<div className="history-section">
						<p className="history-title title">History</p>

						{orderLoading ? (
							<p>Loading orders...</p>
						) : orders.length === 0 ? (
							<p>No orders found.</p>
						) : (
							<table className="history-table">
								<thead>
									<tr>
										<th>Date</th>
										<th>Time</th>
										<th>Price</th>
										<th>Action</th>
									</tr>
								</thead>
								<tbody>
									{orders.map((order) => {
										const start = new Date(order.start_time);
										const end = new Date(order.end_time);

										const dateStr = start.toLocaleDateString("en-GB", {
											day: "2-digit",
											month: "short",
											year: "2-digit",
										});

										const startTime = start.toLocaleTimeString("en-GB", {
											hour: "2-digit",
											minute: "2-digit",
										});
										const endTime = end.toLocaleTimeString("en-GB", {
											hour: "2-digit",
											minute: "2-digit",
										});

										return (
											<tr key={order.order_id}>
												<td>{dateStr}</td>
												<td>
													{startTime} - {endTime}
												</td>
												<td>{order.price}</td>
												<td>
													<HardLink
														href={`/order-detail?order_id=${order.order_id}`}
													>
														View Order
													</HardLink>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						)}

						{/* Pagination */}
						<div className="pagination-wrapper">
							<button
								className="pagination-btn"
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								disabled={page === 1}
							>
								&lt;
							</button>
							<button className="pagination-btn active">{page}</button>
							<button
								className="pagination-btn"
								onClick={() => setPage((p) => p + 1)}
							>
								&gt;
							</button>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
