"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import "./individual.css";

interface Zone {
	zone_id: number;
	zone_no: number;
}

export default function ZoneBooking() {
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [zones, setZones] = useState<Zone[]>([]);
	const [loading, setLoading] = useState(true);
	const [lastUpdate, setLastUpdate] = useState(new Date());

	const changeDate = (days: number) => {
		setSelectedDate((prev) => {
			const newDate = new Date(prev);
			newDate.setDate(prev.getDate() + days);
			return newDate;
		});
	};

	const handleRefresh = () => {
		setLastUpdate(new Date());
		loadZones();
	};

	const formatted = selectedDate.toLocaleDateString("en-GB", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});

	const formatted2 = lastUpdate.toLocaleString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});

	// --- Fetch zones from backend ---
	const loadZones = async () => {
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/zones`, {
				method: "GET",
				credentials: "include",
			});

			if (res.ok) {
				const data: Zone[] = await res.json();
				setZones(data);
			} else {
				setZones([]);
			}
		} catch (err) {
			console.error("Failed to load zones", err);
			setZones([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadZones();
	}, []);

	if (loading) return <p>Loading zones...</p>;

	return (
		<div className="maindiv">
			<main>
				<div className="select-date">
					<button onClick={() => changeDate(-1)} className="date-btn">
						&lt;
					</button>
					<p className="date-btn">{formatted}</p>
					<button onClick={() => changeDate(1)} className="date-btn">
						&gt;
					</button>
				</div>

				<div className="zone-mapping">
					{zones.map((zone) => (
						<Link
							key={zone.zone_id}
							href={{
								pathname: "/individual/details",
								query: {
									zone_id: `${zone.zone_no}`,
									floor: `${zone.zone_no}`,
									date: formatted,
								},
							}}
							className="zone-link"
						>
							Zone {zone.zone_no}
						</Link>
					))}
				</div>

				<p className="update-text">Last update:</p>
				<div className="refresh-section">
					<p>{formatted2}</p>
					<button onClick={handleRefresh} className="refresh-btn">
						🔄
					</button>
				</div>
			</main>
		</div>
	);
}
