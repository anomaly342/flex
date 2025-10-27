"use client";
import Image from "next/image";
import "./profile.css";

export default function Profile() {
    let role = "Membership";
    let points = 999;
    let display = "";
    let display2 = "";

    if (role === "Membership") {
        display = "hidden";
        display2 = "block";
    } else {
        display = "block";
        display2 = "hidden";
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log("Button clicked!", event);
    };

    return (
        <div className="maindiv">
            <main>
                <div className="flex flex-row space-x-5 justify-center mt-5">
                    <Image
                        src="/profile.svg"
                        alt="User Profile"
                        width={50}
                        height={50}
                    />
                    <div className="flex flex-col">
                        <h3>Username</h3>
                        <h4>
                            <span className="rolename">{role}</span> Points:{" "}
                            {points}
                        </h4>
                    </div>
                </div>
                <div className="border-2 m-5">
                    <div className={`${display} p-3`}>
                        <h1>Subcribe to our Membership!</h1>
                        <button
                            onClick={handleClick}
                            className="border-1 bg-gray-400 p-1"
                        >
                            Click to Subscribe
                        </button>
                    </div>
                    <div className={`${display2} p-3`}>
                        <h1>Membership</h1>
                        <div>
                            <table className="border-separate border-spacing-x-4">
                                <thead>
                                    <tr>
                                        <th>Your membership ends at</th>
                                        <th>Points</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>January 09, 2025</td>
                                        <td>{points}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="block pb-3">
                        <h1 className="pl-3">History</h1>
                        <table className="border-separate border-spacing-x-4">
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
                        <div className="flex mt-3 justify-center space-x-4">
                            <button className="border-1 bg-gray-200 p-1 rounded-2xl p-1.5">
                                &lt;
                            </button>
                            <button className="border-1 bg-gray-200 p-1 rounded-2xl p-1.5">
                                1
                            </button>
                            <button className="border-1 bg-gray-200 p-1 rounded-2xl p-1.5">
                                &gt;
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
