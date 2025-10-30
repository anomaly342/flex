"use client";
import Image from "next/image";
import Link from "next/link";
import "./home.css";

export default function Home() {
    let role = "Membership";
    let points = 999;

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
                                <h3>Username</h3>
                                <h4>
                                    <span className="rolename">{role}</span>{" "}
                                    Points: {points}
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
