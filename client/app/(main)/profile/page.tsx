"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./profile.css";

interface UserProfile {
    id: number;
    username: string;
    role: string;
    exp_date: null;
    points: number;
}

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // -------- MOCK MODE FOR UI TEST --------
        const mockUser: UserProfile = {
            id: 1,
            username: "Alice",
            role: "Membership",
            exp_date: null,
            points: 999,
        };
        setUser(mockUser);
        setLoading(false);

        // const loadUser = async () => {
        //     try {
        //         const res = await fetch(
        //             `${process.env.NEXT_PUBLIC_BACKEND_URL}/authentication/me`,
        //             {
        //                 method: "GET",
        //                 credentials: "include",
        //             }
        //         );

        //         if (!res.ok) {
        //             router.replace("/login");
        //             return;
        //         }

        //         const data: UserProfile = await res.json();
        //         setUser(data);
        //     } catch (err) {
        //         console.error("Failed to load user", err);
        //         router.replace("/login");
        //     } finally {
        //         setLoading(false);
        //     }
        // };

        // loadUser();
    }, [router]);

    if (loading) {
        return <p>Loading...</p>;
    }

    // let role = "Membership";
    // let points = 999;

    let display = "";
    let display2 = "";

    if (user?.role === "Membership") {
        display = "hidden";
        display2 = "block";
    } else {
        display = "block";
        display2 = "hidden";
    }

    return (
        <div className="maindiv">
            <main className="main-wrapper">
                <div className="profile-header-row">
                    <Image
                        src="/profile.svg"
                        alt="User Profile"
                        width={50}
                        height={50}
                    />
                    <div className="profile-header-col">
                        <p>{user?.username}</p>
                        <p>
                            <span className="rolename">{user?.role}</span>{" "}
                            Points: {user?.points}
                        </p>
                    </div>
                </div>

                <div className="outer-card">
                    <div className={`subscribe-section ${display}`}>
                        <p>Subcribe to our Membership!</p>
                        <button
                            onClick={() => {
                                console.log("Subscribe!!");
                            }}
                            className="subscribe-button"
                        >
                            Click to Subscribe
                        </button>
                    </div>

                    <div className={`member-section ${display2}`}>
                        <h1 className="title">Membership</h1>
                        <div>
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
                                        <td>{user?.points}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

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
