"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Profile() {
  const sp = useSearchParams();
  const room = sp.get("room") ?? "N/A";
  const floor = sp.get("floor") ?? "N/A";

  const [data, setData] = useState<any>(null);
  const [editData, setEditData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

    // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const res = await fetch(
  //         `http://localhost:3000/edit/room?room=${room}&floor=${floor}`,
  //         { method: "GET" }
  //       );

  //       const json = await res.json();
  //       setData(json);
  //       setEditData(json); // เก็บสำเนาไว้แก้ไข
  //     } catch (err) {
  //       console.error("Fetch failed:", err);
  //     }
  //   }
  //   if (room !== "N/A" && floor !== "N/A") {
  //     fetchData();
  //   }
  // }, [room, floor]);

  // ✅ mock fetch
  useEffect(() => {
    const mockJson = {
      title: `Room ${room} Floor ${floor}`,
      description: "Mocked data for testing UI without backend.",
      features: "Wi-Fi, Desk, AC, Mock Mode Enabled",
      imageUrl: "https://via.placeholder.com/400x300?text=Mock+Room",
    };
    setData(mockJson);
    setEditData(mockJson);
  }, [room, floor]);

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

  const handleConfirm = async () => {
    try {
      const formData = new FormData();
      formData.append("room", room);
      formData.append("floor", floor);
      formData.append("title", editData.title || "");
      formData.append("description", editData.description || "");
      formData.append("features", editData.features || "");
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch("http://localhost:3000/edit/room", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (res.ok) {
        alert(`update success: ${json.message || "success"}`);
        setData(editData);
        setIsEditing(false);
        setImageFile(null);
      } else {
        alert(`update failed: ${json.message || "unknown error"}`);
      }
    } catch (err) {
      alert("update failed: network error");
      console.error(err);
    }
  };

  if (!editData) {
    return <div className="loading-text">Loading room data...</div>;
  }

  return (
    <div className="profile-container">
      <main className="profile-main">
        <div className="header">
          <h1>Room {room}</h1>
          <h2>Floor {floor}</h2>
        </div>

        <div className="content">
          <div className="image-box">
            {imageFile ? (
              <img src={URL.createObjectURL(imageFile)} alt="Preview" />
            ) : editData.imageUrl ? (
              <img src={editData.imageUrl} alt="Room" />
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

          <div className="form-box">
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={editData.title || ""}
              onChange={handleChange}
              readOnly={!isEditing}
              className={isEditing ? "editable" : "readonly"}
            />

            <label>Description:</label>
            <textarea
              name="description"
              value={editData.description || ""}
              onChange={handleChange}
              readOnly={!isEditing}
              rows={5}
              className={isEditing ? "editable" : "readonly"}
            />

            <label>Features:</label>
            <textarea
              name="features"
              value={editData.features || ""}
              onChange={handleChange}
              readOnly={!isEditing}
              rows={4}
              className={isEditing ? "editable" : "readonly"}
            />
          </div>

          <div className="button-group">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="btn edit">
                Edit
              </button>
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
        </div>
      </main>
    </div>
  );
}
