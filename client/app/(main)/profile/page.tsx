"use client";
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

export default function Profile() {
	const router = useRouter();
	const [user, setUser] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);

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

		loadUser();
	}, [router]);

	if (loading) {
		return <p>Loading...</p>;
	}

	const hasSubscription = user?.exp_date !== null;

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
								onClick={() => {
									// You can replace this URL with your actual subscription link
									window.location.href =
										"https://your-subscription-website.com";
								}}
								className="subscribe-button"
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
										<td>{user?.exp_date}</td>
										<td>{user?.point}</td>
									</tr>
								</tbody>
							</table>
						</div>
					)}

					{/* History section */}
					<div className="history-section">
						<p className="history-title title">History</p>
						<table className="history-table">
							<thead>
								<tr>
									<th>Date</th>
									<th>Time</th>
									<th>Type</th>
									<th>Room</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>12 Jan 25</td>
									<td>12:00 - 17:00</td>
									<td>Individual</td>
									<td>Zone 10</td>
								</tr>
								<tr>
									<td>14 Jan 25</td>
									<td>14:00 - 19:00</td>
									<td>Group</td>
									<td>Room 1</td>
								</tr>
							</tbody>
						</table>

						<div className="pagination-wrapper">
							<button className="pagination-btn">&lt;</button>
							<button className="pagination-btn">1</button>
							<button className="pagination-btn">&gt;</button>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
