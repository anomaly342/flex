"use client";
import Image from "next/image";
import "./home.css";

export default function Home() {
    let role = "Membership";
    let points = 999;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log("Button clicked!", event);
    };

    return (
        <div className="maindiv">
            <main>
                <div className="flex flex-col">
                    <button type="button" className="border-1 m-3 p-3">
                        <a href="/group">Group</a>
                    </button>
                    <button type="button" className="border-1 m-3 p-3">
                        <a href="/individual">Individual</a>
                    </button>
                </div>
                <div className="border-2 m-5">
                    <div className="block p-3">
                        <h1>Welcome,</h1>
                        <div className="flex flex-row space-x-5 justify-start mt-3">
                            <Image
                                src="/profile.svg"
                                alt="User Profile"
                                width={50}
                                height={50}
                            />
                            <div className="flex flex-col">
                                <h3>Username</h3>
                                <h4>
                                    <span className="rolename">{role}</span>{" "}
                                    Points: {points}
                                </h4>
                            </div>
                        </div>
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
                </div>
            </main>
        </div>
    );
}
