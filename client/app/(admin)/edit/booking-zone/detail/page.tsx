"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Zone {
	zone_id: number;
	zone_no: number;
	zone_img_url?: string;
}

export default function ZoneDetail() {
	const sp = useSearchParams();
	const router = useRouter();
	const zone_id = sp.get("zone_id");
	const zone_no = sp.get("zone_no");

	const [data, setData] = useState<Zone | null>(null);
	const [editData, setEditData] = useState<Zone | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Load zone data on mount or when zone_id changes
	useEffect(() => {
		if (!zone_id) {
			setError("Zone ID is missing from URL");
			setLoading(false);
			return;
		}

		const fetchZone = async () => {
			setLoading(true);
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/zones/${zone_id}`,
					{ credentials: "include" }
				);

				if (!res.ok) {
					const json = await res.json();
					throw new Error(json.message || "Failed to fetch zone");
				}

				const json: Zone = await res.json();
				setData(json);
				setEditData(json);
				setLoading(false);
			} catch (err: any) {
				console.error(err);
				setError(err.message || "Network error");
				setLoading(false);
			}
		};

		fetchZone();
	}, [zone_id]);

	const handleDelete = async () => {
		if (!zone_id) return;

		if (!confirm(`Are you sure you want to delete zone ${zone_id}?`)) return;

		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/zones/${zone_id}`,
				{ method: "DELETE", credentials: "include" }
			);

			if (res.ok) {
				alert("Zone deleted successfully!");
				router.push("/edit/booking-zone");
			} else {
				const json = await res.json();
				alert(`Delete failed: ${json.message || "unknown error"}`);
			}
		} catch (err) {
			alert("Delete failed: network error");
			console.error(err);
		}
	};

	const handleConfirm = async () => {
		if (!editData) return;

		try {
			const bodyData = new URLSearchParams();
			bodyData.append("zone_id", zone_id || "");
			bodyData.append("zone_no", editData.zone_no?.toString() || "");
			const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/zones`, {
				method: "PUT",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				credentials: "include",
				body: bodyData,
			});

			if (res.ok) {
				alert(`Update success: success`);
				setData(editData);
				setIsEditing(false);
				setImageFile(null);
			} else {
				alert(`Update failed: unknown error`);
			}
		} catch (err) {
			alert("Update failed: network error");
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setEditData({ ...editData!, [e.target.name]: e.target.value });

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
	};

	const handleCancel = () => {
		setEditData(data);
		setImageFile(null);
		setIsEditing(false);
	};

	if (loading) return <div className="loading-text">Loading zone data...</div>;
	if (error) return <div className="error-text">Error: {error}</div>;
	if (!editData) return <div className="no-data">No data found.</div>;

	return (
		<main className="zone-detail">
			<header className="zone-header">
				<h1>Zone {editData.zone_no}</h1>
				<h2>ID: {editData.zone_id}</h2>
			</header>

			<section className="zone-content">
				<div className="zone-image">
					{imageFile ? (
						<img src={URL.createObjectURL(imageFile)} alt="Preview" />
					) : editData.zone_img_url ? (
						<img src={editData.zone_img_url} alt="Zone" />
					) : (
						<p className="no-photo">No Photo</p>
					)}
					{isEditing && (
						<input
							type="file"
							accept="image/*"
							className="file-input"
							onChange={handleFileChange}
						/>
					)}
				</div>

				<form className="zone-form">
					<label>Zone Number:</label>
					<input
						type="text"
						name="zone_no"
						value={editData.zone_no || ""}
						onChange={handleChange}
						readOnly={!isEditing}
						className={isEditing ? "editable" : "readonly"}
					/>
				</form>

				<div className="zone-buttons">
					{!isEditing ? (
						<>
							<button onClick={() => setIsEditing(true)} className="btn edit">
								Edit
							</button>
							<button onClick={handleDelete} className="btn delete">
								Delete
							</button>
						</>
					) : (
						<>
							<button onClick={handleCancel} className="btn cancel">
								Cancel
							</button>
							<button onClick={handleConfirm} className="btn confirm">
								Confirm
							</button>
						</>
					)}
				</div>
			</section>
		</main>
	);
}
