"use client";
import Image from "next/image";
import "./orders.css";

export default function Home() {
    let role = "Membership";
    let points = 999;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log("Button clicked!", event);
    };

    return (
        <div className="maindiv">
            <main>
                <div className="flex justify-center">
                    <p>Order History</p>
                </div>
                <div className="block pb-3 pl-3 pr-3">
                    <h1>Today</h1>
                    <div className="border-1 flex flex-row justify-start p-3 space-x-5">
                        <div className="text-center">
                            <p>08:00</p>
                            <p>to</p>
                            <p>12:00</p>
                        </div>
                        <div className="text-start flex flex-col justify-center">
                            <p>Room 1</p>
                            <p>(Room 1 Details)</p>
                        </div>
                    </div>
                </div>
                <div className="block pb-3 pl-3 pr-3">
                    <h1>Friday</h1>
                    <div className="border-1 flex flex-row justify-start p-3 space-x-5">
                        <div className="text-center">
                            <p>13:00</p>
                            <p>to</p>
                            <p>16:00</p>
                        </div>
                        <div className="text-start flex flex-col justify-center">
                            <p>Room 5</p>
                            <p>(Room 5 Details)</p>
                        </div>
                    </div>
                </div>
                <div className="block pb-3 pl-3 pr-3">
                    <h1>Sunday</h1>
                    <div className="border-1 flex flex-row justify-start p-3 space-x-5">
                        <div className="text-center">
                            <p>09:00</p>
                            <p>to</p>
                            <p>12:00</p>
                        </div>
                        <div className="text-start flex flex-col justify-center">
                            <p>Room 8</p>
                            <p>(Room 8 Details)</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
