"use client";
import HardLink from "@/app/components/HardLink";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./home.css";

interface UserProfile {
	id: number;
	username: string;
	role: string;
	exp_date: null | string;
	point: number;
}

interface Order {
	order_id: number;
	qr_url: string;
	start_time: string;
	end_time: string;
	price: number;
	createdAt: string;
}

export default function Home() {
	const router = useRouter();
	const [user, setUser] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [orders, setOrders] = useState<Order[]>([]);

	useEffect(() => {
		const loadUser = async () => {
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/authentication/userInfo`,
					{
						method: "GET",
						credentials: "include",
					}
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

		const loadOrders = async () => {
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/upcoming`,
					{
						method: "GET",
						credentials: "include",
					}
				);

				if (res.ok) {
					const data: Order[] = await res.json();
					// Sort ascending by start_time
					data.sort(
						(a, b) =>
							new Date(a.start_time).getTime() -
							new Date(b.start_time).getTime()
					);
					setOrders(data);
				}
			} catch (err) {
				console.error("Failed to load upcoming orders", err);
			}
		};

		loadUser();
		loadOrders();
	}, [router]);

	if (loading) return <p>Loading...</p>;

	// --- Helpers ---
	const formatTimeRange = (start: string, end: string) => {
		const startDate = new Date(start);
		const endDate = new Date(end);
		const startTime = startDate.toLocaleTimeString("en-GB", {
			hour: "2-digit",
			minute: "2-digit",
		});
		const endTime = endDate.toLocaleTimeString("en-GB", {
			hour: "2-digit",
			minute: "2-digit",
		});
		return { startTime, endTime };
	};

	const formatDateToWeekday = (dateStr: string) => {
		const date = new Date(dateStr);
		return date.toLocaleDateString("en-GB", { weekday: "long" }); // Monday, Tuesday, ...
	};

	// --- Group orders by weekday ---
	const ordersByWeekday: Record<string, Order[]> = {};
	orders.forEach((order) => {
		const weekday = formatDateToWeekday(order.start_time);
		if (!ordersByWeekday[weekday]) {
			ordersByWeekday[weekday] = [];
		}
		ordersByWeekday[weekday].push(order);
	});

	return (
		<div className="maindiv">
			<main>
				<div className="link-div">
					<HardLink href="/group" className="link-btn">
						Group
					</HardLink>
					<HardLink href="/individual" className="link-btn">
						Individual
					</HardLink>
				</div>

				<div className="outer-card">
					<div className="welcome-section">
						<h1>Welcome,</h1>
						<div className="profile-section">
							<Image
								src="/profile.svg"
								alt="User Profile"
								width={50}
								height={50}
							/>
							<div className="profile-text">
								<h3 className="text-blue underline">
									<HardLink href={"/profile"}>{user?.username}</HardLink>
								</h3>
								<h4>
									<span className="rolename">{user?.role}</span> Points:{" "}
									{user?.point}
								</h4>
							</div>
						</div>
					</div>

					{/* Upcoming orders grouped by weekday */}
					{Object.keys(ordersByWeekday).length === 0 && (
						<p>No upcoming orders in the next 7 days.</p>
					)}

					{Object.entries(ordersByWeekday).map(([weekday, orders]) => (
						<div key={weekday} className="reminder">
							<h1>{weekday}</h1>
							{orders.map((order) => {
								const { startTime, endTime } = formatTimeRange(
									order.start_time,
									order.end_time
								);

								return (
									<div key={order.order_id} className="reminder-detail">
										<div className="text-time">
											<p>{startTime}</p>
											<p>to</p>
											<p>{endTime}</p>
										</div>
										<div className="text-location">
											<p>Price: {order.price}</p>
											<p>
												<a
													href={order.qr_url}
													target="_blank"
													rel="noopener noreferrer"
												>
													View QR
												</a>
											</p>
											<p>
												<HardLink
													href={`/order-detail?order_id=${order.order_id}`}
												>
													View Details
												</HardLink>
											</p>
										</div>
									</div>
								);
							})}
						</div>
					))}
				</div>
			</main>
		</div>
	);
}
