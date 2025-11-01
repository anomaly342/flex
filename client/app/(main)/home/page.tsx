"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./home.css";

interface UserProfile {
	id: number;
	username: string;
	role: string;
	exp_date: null;
	point: number;
}

export default function Home() {
	const router = useRouter();
	const [user, setUser] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// -------- MOCK MODE FOR UI TEST --------
		// const mockUser: UserProfile = {
		//     id: 1,
		//     username: "Alice",
		//     role: "Membership",
		//     exp_date: null,
		//     points: 999,
		// };
		// setUser(mockUser);
		// setLoading(false);

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

	// let role = "Membership";
	// let points = 999;

	return (
		<div className="maindiv">
			<main>
				<div className="link-div">
					<Link href="/group" className="link-btn">
						Group
					</Link>
					<Link href="/individual" className="link-btn">
						Individual
					</Link>
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
									<Link href={"/profile"}>{user?.username}</Link>
								</h3>
								<h4>
									<span className="rolename">{user?.role}</span> Points:{" "}
									{user?.point}
								</h4>
							</div>
						</div>
					</div>
					<div className="reminder">
						<h1>Today</h1>
						<div className="reminder-detail">
							<div className="text-time">
								<p>08:00</p>
								<p>to</p>
								<p>12:00</p>
							</div>
							<div className="text-location">
								<p>Room 1</p>
								<p>(Room 1 Details)</p>
							</div>
						</div>
					</div>
					<div className="reminder">
						<h1>Friday</h1>
						<div className="reminder-detail">
							<div className="text-time">
								<p>13:00</p>
								<p>to</p>
								<p>16:00</p>
							</div>
							<div className="text-location">
								<p>Room 5</p>
								<p>(Room 5 Details)</p>
							</div>
						</div>
					</div>
					<div className="reminder">
						<h1>Sunday</h1>
						<div className="reminder-detail">
							<div className="text-time">
								<p>09:00</p>
								<p>to</p>
								<p>12:00</p>
							</div>
							<div className="text-location">
								<p>Room 8</p>
								<p>(Room 8 Details)</p>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
