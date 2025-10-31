"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "./details.css";

interface RoomData {
	room_id: number;
	room_no: number;
	room_floor: number;
	room_type: string;
	room_detail: string;
	room_img_url: string;
}

export default function Profile() {
	const sp = useSearchParams();
	const roomId = sp.get("room");
	const floor = sp.get("floor") ?? "N/A";
	const get_date = sp.get("date") ?? "N/A";

	const [roomData, setRoomData] = useState<RoomData | null>(null);
	const [availability, setAvailability] = useState<number[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [showModal, setShowModal] = useState(false);
	const [startTime, setStartTime] = useState<string | null>(null);
	const [endTime, setEndTime] = useState<string | null>(null);
	const [selectedDate, setSelectedDate] = useState(new Date());

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

	// Fetch room details
	useEffect(() => {
		if (!roomId) return;

		const fetchRoomData = async () => {
			try {
				setLoading(true);
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/rooms/${roomId}`,
					{
						credentials: "include",
					}
				);
				if (!res.ok) throw new Error("Failed to fetch room");
				const data = await res.json();
				setRoomData(data);
			} catch (err: any) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchRoomData();
	}, [roomId]);

	// Fetch availability whenever roomId or selectedDate changes
	useEffect(() => {
		if (!roomId) return;

		const fetchAvailability = async () => {
			try {
				const body = new URLSearchParams();
				body.append("date", selectedDate.toISOString());

				const res = await fetch(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/rooms/${roomId}/remaining`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
						},
						body: body.toString(),
						credentials: "include",
					}
				);

				if (!res.ok) throw new Error("Failed to fetch availability");

				const data = await res.json();
				setAvailability(data.table); // 0 = available, 1 = unavailable
				setStartTime(null); // reset selection when date changes
				setEndTime(null);
			} catch (err: any) {
				console.error(err);
			}
		};

		fetchAvailability();
	}, [roomId, selectedDate]);

	const changeDate = (days: number) => {
		setSelectedDate((prev) => {
			const newDate = new Date(prev);
			newDate.setDate(prev.getDate() + days);
			return newDate;
		});
	};

	// Handle time selection, stops range at unavailable slots
	const handleTimeClick = (time: string, index: number) => {
		if (availability[index] === 1) return; // unavailable

		if (!startTime) {
			setStartTime(time);
			setEndTime(null);
			return;
		}

		const startIndex = times.indexOf(startTime);

		if (!endTime) {
			// Determine valid direction
			if (index >= startIndex) {
				// Forward selection
				for (let i = startIndex; i <= index; i++) {
					if (availability[i] === 1) {
						setEndTime(times[i - 1] || startTime); // stop at previous available
						return;
					}
				}
				setEndTime(time);
			} else {
				// Backward selection
				for (let i = startIndex; i >= index; i--) {
					if (availability[i] === 1) {
						setStartTime(times[i + 1] || startTime);
						setEndTime(startTime);
						return;
					}
				}
				setStartTime(time);
				setEndTime(startTime);
			}
			return;
		}

		// Reset selection if range already exists
		setStartTime(time);
		setEndTime(null);
	};

	const isInRange = (time: string) => {
		if (!startTime) return false;
		if (!endTime) return time === startTime;
		const startIndex = times.indexOf(startTime);
		const endIndex = times.indexOf(endTime);
		const currentIndex = times.indexOf(time);
		return currentIndex >= startIndex && currentIndex <= endIndex;
	};

	const confirmDisabled = !startTime;

	if (loading) return <p className="loading-text">Loading room details...</p>;
	if (error) return <p className="error-text">Error: {error}</p>;

	return (
		<div className="maindiv">
			<main>
				{roomData && (
					<>
						<div className="room-name">
							<p className="room-text">Room {roomData.room_no}</p>
							<p className="floor-text">Floor {roomData.room_floor}</p>
						</div>
						<hr />
						<div className="room-detail">
							<div className="pics">
								<img
									src={roomData.room_img_url}
									alt={roomData.room_type}
									className="room-image"
								/>
							</div>
							<div className="detail-text">
								<p className="detail-header">
									{roomData.room_type.replace("_", " ")}
								</p>
								<p>{roomData.room_detail}</p>
							</div>
						</div>
						<button onClick={() => setShowModal(true)} className="book-btn">
							Book
						</button>
					</>
				)}

				{showModal && (
					<div className="booking-section">
						<div className="booking-section2">
							{/* Time list */}
							<div className="time-mapping">
								{times.map((time, index) => (
									<div
										key={time}
										className={`p-2 text-center cursor-pointer ${
											availability[index] === 1
												? "bg-gray-200 text-gray-400 cursor-not-allowed"
												: isInRange(time)
												? "bg-blue-500 text-white"
												: "hover:bg-gray-100"
										}`}
										onClick={() => handleTimeClick(time, index)}
									>
										{time}
									</div>
								))}
							</div>

							{/* Date selector */}
							<div className="date-section">
								<button onClick={() => changeDate(-1)} className="date-btn">
									&lt;
								</button>
								<p className="date-text">
									{selectedDate.toLocaleDateString("en-GB", {
										day: "2-digit",
										month: "short",
									})}
								</p>
								<button onClick={() => changeDate(1)} className="date-btn">
									&gt;
								</button>
							</div>

							{/* Buttons */}
							<div className="button-section">
								<button
									onClick={() => setShowModal(false)}
									className="cancel-btn"
								>
									Cancel
								</button>
								<button
									onClick={() => {
										alert(
											`Booked ${
												roomData?.room_no
											} on ${get_date} from ${startTime} to ${
												endTime ?? startTime
											}`
										);
										setShowModal(false);
									}}
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
