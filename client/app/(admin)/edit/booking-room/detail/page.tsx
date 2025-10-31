"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface Room {
  room_id: number;
  room_no: string;
  room_floor: number;
}

interface RoomDetail extends Room {
  room_type: string;
  room_detail: string;
  room_img_url: string;
}

export default function RoomDetail() {
  const sp = useSearchParams();
  const router = useRouter();
  const room_id = sp.get("room_id");

  const [data, setData] = useState<any>(null);
  const [editData, setEditData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRoomData() {
      if (!room_id) return;

      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/rooms/${room_id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

        const json = await res.json();
        setData(json);
        setEditData(json);
      } catch (err: any) {
        console.error("Fetch failed:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRoomData();
  }, [room_id]);

  const handleDelete = async () => {
    if (!room_id) return;

    const confirmDelete = confirm(
      `Are you sure you want to delete room ${room_id}?`
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/rooms/${room_id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.ok) {
        alert("Room deleted successfully!");
        router.push("/edit/booking-room");
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
    try {
      const bodyData = new URLSearchParams();
      bodyData.append("room_id", room_id || "");
      bodyData.append("room_no", editData.room_no || "");
      bodyData.append("room_floor", editData.room_floor || "");
      bodyData.append("room_type", editData.room_type || "");
      bodyData.append("room_detail", editData.room_detail || "");
      if (imageFile) {
        bodyData.append("room_img_url", editData.room_img_url || "");
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rooms`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: bodyData.toString(),
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
      console.error(err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setEditData({ ...editData, [e.target.name]: e.target.value });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
  };

  const handleCancel = () => {
    setEditData(data);
    setImageFile(null);
    setIsEditing(false);
  };

  if (loading) return <div className="loading-text">Loading room data...</div>;
  if (error) return <div className="error-text">Error: {error}</div>;
  if (!editData) return <div className="no-data">No data found.</div>;

  return (
    <article className="room-container">
      <header className="room-header">
        <h3>Room {editData.room_no}</h3>
        <p>Floor {editData.room_floor}</p>
      </header>

      <section className="room-content">
        <figure className="image-box">
          {imageFile ? (
            <img src={URL.createObjectURL(imageFile)} alt="Preview" />
          ) : editData.room_img_url ? (
            <img src={editData.room_img_url} alt={`Room ${editData.room_no}`} />
          ) : (
            <figcaption className="no-photo">No Photo</figcaption>
          )}
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              className="file-input"
              onChange={handleFileChange}
            />
          )}
        </figure>

        <form className="form-box" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="room_type">Room Type:</label>
          <input
            id="room_type"
            type="text"
            name="room_type"
            value={editData.room_type || ""}
            onChange={handleChange}
            readOnly={!isEditing}
            className={isEditing ? "editable" : "readonly"}
          />

          <label htmlFor="room_detail">Room Detail:</label>
          <textarea
            id="room_detail"
            name="room_detail"
            value={editData.room_detail || ""}
            onChange={handleChange}
            readOnly={!isEditing}
            rows={5}
            className={isEditing ? "editable" : "readonly"}
          />
        </form>
      </section>

      <footer className="button-group">
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
      </footer>
    </article>
  );
}
