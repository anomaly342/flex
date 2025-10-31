"use client";
import "./orders.css";

export default function OrderHistory() {
    return (
        <div className="maindiv">
            <main>
                <div className="header-div">
                    <h1>Order History</h1>
                </div>
                <div className="reminder-section">
                    <h2>Today</h2>
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
                <div className="reminder-section">
                    <h2>Friday</h2>
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
                <div className="reminder-section">
                    <h2>Sunday</h2>
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
            </main>
        </div>
    );
}
