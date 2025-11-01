"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "./details.css";

interface RemainingResponse {
	table: number[]; // 0 = available, 1 = unavailable
}

export default function ZoneDetail() {
	const sp = useSearchParams();
	const router = useRouter();

	const zone = sp.get("zone") ?? "N/A";
	const floor = sp.get("floor") ?? "N/A";
	const get_date = sp.get("date") ?? "N/A";

	const [showModal, setShowModal] = useState(false);
	const [startTime, setStartTime] = useState<string | null>(null);
	const [endTime, setEndTime] = useState<string | null>(null);
	const [remaining, setRemaining] = useState<number[]>([]);
	const [loading, setLoading] = useState(true);

	const [selectedDate, setSelectedDate] = useState(new Date(get_date));

	const times = [
		"08:00",
		"09:00",
		"10:00",
		"11:00",
		"12:00",
		"13:00",
		"14:00",
		"15:00",
		"16:00",
		"17:00",
		"18:00",
		"19:00",
		"20:00",
		"21:00",
		"22:00",
	];

	const changeDate = (days: number) => {
		setSelectedDate((prev) => {
			const newDate = new Date(prev);
			newDate.setDate(prev.getDate() + days);
			return newDate;
		});
	};

	useEffect(() => {
		const fetchRemaining = async () => {
			if (zone === "N/A") return;
			setLoading(true);
			try {
				const formatted = selectedDate.toLocaleDateString("en-GB", {
					day: "2-digit",
					month: "short",
					year: "numeric",
				});
				const res = await fetch(
					`${
						process.env.NEXT_PUBLIC_BACKEND_URL
					}/zones/${zone}/remaining?date=${encodeURIComponent(formatted)}`,
					{ method: "GET", credentials: "include" }
				);
				if (res.ok) {
					const data: RemainingResponse = await res.json();
					setRemaining(data.table);
				} else {
					setRemaining(Array(times.length).fill(0));
				}
			} catch (err) {
				console.error("Failed to fetch remaining slots", err);
				setRemaining(Array(times.length).fill(0));
			} finally {
				setLoading(false);
			}
		};
		fetchRemaining();
	}, [zone, selectedDate]);

	const formattedDate = selectedDate.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "short",
	});

	const handleTimeClick = (time: string) => {
		const index = times.indexOf(time);
		if (remaining[index] === 1 || loading) return; // block clicks if loading

		if (!startTime) {
			setStartTime(time);
			setEndTime(null);
			return;
		}

		if (!endTime) {
			const startIndex = times.indexOf(startTime);
			const newIndex = times.indexOf(time);
			if (newIndex >= startIndex) {
				setEndTime(time);
			} else {
				setStartTime(time);
				setEndTime(startTime);
			}
			return;
		}

		setStartTime(time);
		setEndTime(null);
	};

	const isInRange = (time: string) => {
		const index = times.indexOf(time);
		if (remaining[index] === 1 || loading) return false;
		if (!startTime) return false;
		if (!endTime) return time === startTime;
		const startIndex = times.indexOf(startTime);
		const endIndex = times.indexOf(endTime);
		const currentIndex = times.indexOf(time);
		return currentIndex >= startIndex && currentIndex <= endIndex;
	};

	const confirmDisabled = !startTime || loading;

	const confirmBooking = () => {
		if (!startTime) return;

		const selectedDay = selectedDate.toISOString().split("T")[0];
		const startDateTime = `${selectedDay}T${startTime}:00`;
		const endDateTime = `${selectedDay}T${endTime ?? startTime}:00`;

		router.push(
			`/summary?id=${zone}&type=zone&start_time=${encodeURIComponent(
				startDateTime
			)}&end_time=${encodeURIComponent(endDateTime)}`
		);
	};

	return (
		<div className="maindiv">
			<main>
				<div className="zone-name">
					<p className="zone-text">Zone {zone}</p>
					<p className="floor-text">Floor {floor}</p>
				</div>
				<hr />
				<div className="zone-detail">
					<div className="detail-text">
						<p className="detail-header">Japanese-Themed Office</p>
						<p>
							A serene, private workspace inspired by traditional Japanese
							design. The office features:
						</p>
						<ul className="detail-list">
							<li>Minimalist wooden desk and ergonomic seating</li>
							<li>Subtle shoji-style accents and calming décor</li>
							<li>Soft, natural lighting for focus and comfort</li>
							<li>High-speed Wi-Fi and convenient power outlets</li>
						</ul>
						<p>
							The tranquil Japanese ambiance makes it ideal for concentrated
							work, video calls, or quiet meetings.
						</p>
					</div>
				</div>

				<button onClick={() => setShowModal(true)} className="book-btn">
					Book
				</button>

				{showModal && (
					<div className="booking-section">
						<div className="booking-section2">
							<div className="time-mapping">
								{times.map((time, idx) => (
									<div
										key={time}
										className={`p-2 text-center cursor-pointer ${
											remaining[idx] === 1
												? "bg-gray-300 text-gray-500 cursor-not-allowed"
												: isInRange(time)
												? "bg-blue-500 text-white"
												: "hover:bg-gray-100"
										}`}
										onClick={() => handleTimeClick(time)}
									>
										{time}
									</div>
								))}
							</div>

							<div className="date-section">
								<button onClick={() => changeDate(-1)} className="date-btn">
									&lt;
								</button>
								<p className="date-text">{formattedDate}</p>
								<button onClick={() => changeDate(1)} className="date-btn">
									&gt;
								</button>
							</div>

							<div className="button-section">
								<button
									onClick={() => setShowModal(false)}
									className="cancel-btn"
								>
									Cancel
								</button>

								<button
									onClick={confirmBooking}
									disabled={confirmDisabled}
									className={`px-3 py-2 rounded ${
										!confirmDisabled
											? "bg-blue-500 text-white hover:bg-blue-600"
											: "bg-gray-200 text-gray-400 cursor-not-allowed"
									}`}
								>
									{startTime && endTime
										? `Confirm ${startTime} - ${endTime}`
										: startTime
										? `Confirm ${startTime}`
										: "Confirm"}
								</button>
							</div>
						</div>
					</div>
				)}
			</main>
		</div>
	);
}
