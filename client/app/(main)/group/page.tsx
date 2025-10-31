"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import "./group.css";

export default function GroupBooking() {
	const maxfloor = 20;
	const [floor, setFloor] = useState(1);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [lastUpdate, setLastUpdate] = useState(new Date());
	const [rooms, setRooms] = useState<
		{ room_id: number; remaining_timeslot: string }[]
	>([]);

	const upperfloor = () => {
		if (floor < maxfloor) setFloor(floor + 1);
	};

	const lowerfloor = () => {
		if (floor > 1) setFloor(floor - 1);
	};

	const changeDate = (days: number) => {
		setSelectedDate((prev) => {
			const newDate = new Date(prev);
			newDate.setDate(prev.getDate() + days);
			return newDate;
		});
	};

	const handleRefresh = () => {
		setLastUpdate(new Date());
		fetchRooms();
	};

	const formatted = selectedDate.toISOString(); // ISO string for backend
	const formatted2 = lastUpdate.toLocaleString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});

	const fetchRooms = async () => {
		try {
			const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/rooms/search?floor=${floor}&date=${formatted}`;
			const res = await fetch(url, { credentials: "include" });
			const data = await res.json();
			setRooms(data);
		} catch (err) {
			console.error("Failed to fetch rooms", err);
		}
	};

	// Fetch rooms whenever floor or selectedDate changes
	useEffect(() => {
		fetchRooms();
	}, [floor, selectedDate]);

	return (
		<div className="maindiv">
			<main>
				<div className="select-date">
					<button className="date-btn" onClick={() => changeDate(-1)}>
						&lt;
					</button>
					<div className="date-btn">
						<p>
							{selectedDate.toLocaleDateString("en-GB", {
								year: "numeric",
								month: "short",
								day: "numeric",
							})}
						</p>
					</div>
					<button className="date-btn" onClick={() => changeDate(1)}>
						&gt;
					</button>
				</div>

				<div className="select-floor">
					<button className="floor-btn" onClick={lowerfloor}>
						&lt;
					</button>
					<div className="floor-btn">
						<p>{`Floor ${floor}`}</p>
					</div>
					<button className="floor-btn" onClick={upperfloor}>
						&gt;
					</button>
				</div>

				<div className="room-mapping">
					{rooms.map((room) => (
						<Link
							key={room.room_id}
							href={{
								pathname: "/group/details",
								query: {
									room: room.room_id,
									floor,
									date: formatted,
								},
							}}
							className="room-link"
						>
							<div className="room-block">
								<div className="timeslot-number">
									{Number(room.remaining_timeslot)}
								</div>
								<div>Room {room.room_id}</div>
							</div>
						</Link>
					))}
				</div>

				<div className="refresh-section">
					<h2>Last update:</h2>
					<p>{formatted2}</p>
					<button onClick={handleRefresh} className="refresh-btn">
						🔄
					</button>
				</div>
			</main>
		</div>
	);
}
