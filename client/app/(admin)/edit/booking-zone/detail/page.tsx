"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface Zone {
  zone_id: number;
  zone_no: number;
}

export default function ZoneDetail() {
  const sp = useSearchParams();
  const router = useRouter();
  const zone_id = sp.get("zone_id");

  const [data, setData] = useState<any>(null);
  const [editData, setEditData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchZoneData() {
      if (!zone_id) return;

      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:3000/zones/${zone_id}`,
          {
            method: "GET",
            credentials: 'include',
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

    fetchZoneData();
  }, [zone_id]);

  // useEffect(() => {
  //   setLoading(false);
  //   const mockData: Zone[] = [
  //     { zone_id: 1, zone_no: 1 },
  //     { zone_id: 2, zone_no: 2 },
  //   ];
  //   const mockEditData: Zone = {
  //     zone_id: 1,
  //     zone_no: 1,
  //   };
  //   setData(mockData);
  //   setEditData(mockEditData);
  // }, [zone_id]);

  const handleDelete = async () => {
    if (!zone_id) return;

    const confirmDelete = confirm(
      `Are you sure you want to delete zone ${zone_id}?`
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:3000/zones/${zone_id}`,
        {
          method: "DELETE",
          credentials: 'include',
        }
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
    try {
      const formData = new FormData();
      formData.append("zone_id", zone_id || "");
      formData.append("zone_no", editData.zone_no || "");

      const res = await fetch("http://localhost:3000/zones", {
        method: "PUT",
        credentials: 'include',
        body: formData,
      });

      const json = await res.json();
      if (res.ok) {
        alert(`Update success: ${json.message || "success"}`);
        setData(editData);
        setIsEditing(false);
        setImageFile(null);
      } else {
        alert(`Update failed: ${json.message || "unknown error"}`);
      }
    } catch (err) {
      alert("Update failed: network error");
      console.error(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEditData({ ...editData, [e.target.name]: e.target.value });

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
